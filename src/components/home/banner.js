import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';

// Inline critical CSS to avoid render-blocking
const CRITICAL_CSS = `
  .banner-placeholder {
    position: relative;
    width: 100%;
    padding-top: 30%;
    background-color: #f5f5f5;
    overflow: hidden;
  }
  
  .banner-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  
  .banner-image.active {
    opacity: 1;
  }
  
  .banner-dots {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    z-index: 10;
  }
  
  .banner-dot {
    width: 10px;
    height: 10px;
    margin: 0 5px;
    border-radius: 50%;
    background-color: rgba(255,255,255,0.5);
    cursor: pointer;
    border: none;
    padding: 0;
    transition: background-color 0.3s;
  }
  
  .banner-dot.active {
    background-color: #A11A36;
  }
`;

// Placeholder base64 data for blur effect
const BLUR_DATA_URL = 'data:image/webp;base64,UklGRpQAAABXRUJQVlA4WAoAAAAQAAAADwAAAwAAQUxQSBIAAAABFyKRbQrInf6Ko0xERGAG/RMRAFZQOCAiAAAADAEAnQEqEAAEAAEAHCWkAANwAP77+DAAXgA=';

// Optimized banner component - no swiper on initial load
function Banner() {
  const [swiperLoaded, setSwiperLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({ 0: false, 1: false, 2: false });
  const timeoutRef = useRef(null);
  const bannerRef = useRef(null);
  const lcpMarked = useRef(false);
  
  // Load next slide after time interval (simple carousel before Swiper loads)
  useEffect(() => {
    if (swiperLoaded) return;
    
    timeoutRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentSlide, swiperLoaded]);
  
  // Import Swiper dynamically to reduce initial JS bundle
  useEffect(() => {
    // Define function to dynamically import swiper
    const loadSwiper = async () => {
      try {
        // Only start loading Swiper after LCP is marked or after 3 seconds
        const delay = imagesLoaded[0] ? 200 : 3000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Mark swiper as loaded
        setSwiperLoaded(true);
      } catch (error) {
        console.error('Failed to load Swiper:', error);
      }
    };
    
    // Start loading Swiper
    loadSwiper();
  }, [imagesLoaded]);
  
  // Mark image as loaded
  const handleImageLoad = (index) => {
    setImagesLoaded(prev => ({ ...prev, [index]: true }));
    
    // Mark LCP only once and only for the first slide
    if (index === 0 && !lcpMarked.current && bannerRef.current) {
      lcpMarked.current = true;
      bannerRef.current.dataset.lcpLoaded = "true";
      
      // Report LCP to analytics if needed
      if (window.performance && window.performance.mark) {
        window.performance.mark('lcp-banner-complete');
      }
    }
  };
  
  return (
    <>
      <Head>
        {/* Preload the optimized banner images with appropriate priorities */}
        <link 
          rel="preload" 
          as="image" 
          href="/img/optimized/banner1-lcp.webp" 
          type="image/webp" 
          fetchpriority="high" 
        />
        
        {/* Inline critical CSS for LCP */}
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
      </Head>
      
      <div id="banner" ref={bannerRef} className="relative">
        {!swiperLoaded ? (
          // Optimized banner with minimal JS for fast LCP
          <div className="banner-placeholder">
            {/* Banner 1 - LCP critical */}
            <div className={`banner-image ${currentSlide === 0 ? 'active' : ''}`}>
              <Image
                src="/img/optimized/banner1-lcp.webp"
                alt="Presco Radiator Caps - Premium Automotive Components"
                priority={true}
                fill
                sizes="100vw"
                quality={75}
                fetchPriority="high"
                loading="eager"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                onLoad={() => handleImageLoad(0)}
              />
            </div>
            
            {/* Other banners - loaded with lower priority and only if needed */}
            {currentSlide === 1 || imagesLoaded[0] ? (
              <div className={`banner-image ${currentSlide === 1 ? 'active' : ''}`}>
                <Image
                  src="/img/optimized/banner2-lcp.webp"
                  alt="High-Performance Radiator Caps for All Vehicle Types"
                  fill
                  sizes="100vw"
                  quality={65}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  onLoad={() => handleImageLoad(1)}
                />
              </div>
            ) : null}
            
            {currentSlide === 2 || imagesLoaded[0] ? (
              <div className={`banner-image ${currentSlide === 2 ? 'active' : ''}`}>
                <Image
                  src="/img/optimized/banner3-lcp.webp"
                  alt="Quality Engineered Cooling System Components"
                  fill
                  sizes="100vw"
                  quality={65}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  onLoad={() => handleImageLoad(2)}
                />
              </div>
            ) : null}
            
            {/* Simple navigation dots */}
            <div className="banner-dots">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  className={`banner-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          // Load Swiper dynamically once initial LCP is complete
          <SwiperBanner />
        )}
      </div>
    </>
  );
}

// Separated Swiper component that loads dynamically
const SwiperBanner = () => {
  // Dynamically import Swiper components
  const [SwiperComponents, setSwiperComponents] = useState(null);
  
  useEffect(() => {
    // Import the Swiper components dynamically
    const loadSwiperComponents = async () => {
      try {
        // Import necessary components
        const SwiperModule = await import('swiper/react');
        const SwiperCoreModule = await import('swiper/modules');
        
        // Import CSS
        await import('swiper/css');
        await import('swiper/css/pagination');
        
        // Set the modules
        setSwiperComponents({
          Swiper: SwiperModule.Swiper,
          SwiperSlide: SwiperModule.SwiperSlide,
          Autoplay: SwiperCoreModule.Autoplay,
          Pagination: SwiperCoreModule.Pagination,
        });
      } catch (error) {
        console.error('Failed to load Swiper components:', error);
      }
    };
    
    loadSwiperComponents();
  }, []);
  
  // If Swiper components aren't loaded yet, show a minimal loader
  if (!SwiperComponents) {
    return <div className="h-20 flex items-center justify-center">
      <div className="animate-pulse bg-gray-200 rounded-md w-32 h-6"></div>
    </div>;
  }
  
  const { Swiper, SwiperSlide, Autoplay, Pagination } = SwiperComponents;
  
  return (
    <Swiper
      style={{ paddingBottom: '40px' }}
      slidesPerView={1}
      spaceBetween={0}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      loop={true}
      modules={[Autoplay, Pagination]}
    >
      <SwiperSlide>
        <div className='relative' style={{ paddingTop: '30%', backgroundColor: '#f5f5f5' }}>
          <Image
            src='/img/banner1.webp'
            alt='Presco Radiator Caps - Premium Automotive Components'
            className='absolute object-cover'
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            loading="eager"
            quality={85}
          />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className='relative' style={{ paddingTop: '30%', backgroundColor: '#f5f5f5' }}>
          <Image
            src='/img/banner2.webp'
            alt='High-Performance Radiator Caps for All Vehicle Types'
            className='absolute object-cover'
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            loading="lazy"
            quality={75}
          />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className='relative' style={{ paddingTop: '30%', backgroundColor: '#f5f5f5' }}>
          <Image
            src='/img/banner3.webp'
            alt='Quality Engineered Cooling System Components'
            className='absolute object-cover'
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            loading="lazy"
            quality={75}
          />
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Banner;
