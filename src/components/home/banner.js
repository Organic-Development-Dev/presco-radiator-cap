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

// Placeholder base64 data for blur effect - ultra-optimized (112 bytes)
const BLUR_DATA_URL = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADQAQCdASoQAAQABUB8JaQAA3AA/vd52Kf/7gAAAA==';

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
    // Define function to dynamically import swiper with ultra-low priority
    const loadSwiper = () => {
      try {
        // Use requestIdleCallback for better performance during idle time
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            // Only set swiperLoaded to true when browser is idle
            // and the first image has been loaded (for best performance)
            if (imagesLoaded[0]) {
              setSwiperLoaded(true);
            } else {
              // If image isn't loaded yet, check again in 500ms
              setTimeout(() => {
                if (imagesLoaded[0] || document.readyState === 'complete') {
                  setSwiperLoaded(true);
                }
              }, 500);
            }
          }, { timeout: 4000 }); // 4 second maximum timeout
        } else {
          // Fallback for browsers without requestIdleCallback
          // Wait for a longer time to ensure LCP is complete
          setTimeout(() => {
            setSwiperLoaded(true);
          }, imagesLoaded[0] ? 300 : 4000);
        }
      } catch (error) {
        console.error('Failed to load Swiper:', error);
      }
    };
    
    // Start loading Swiper only after page has fully loaded
    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        loadSwiper();
      } else {
        window.addEventListener('load', loadSwiper);
        return () => window.removeEventListener('load', loadSwiper);
      }
    }
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
                sizes="(max-width: 640px) 640px, 960px"
                quality={75}
                fetchPriority="high"
                loading="eager"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                onLoad={() => handleImageLoad(0)}
                srcSet={`/img/optimized/banner1-lcp-sm.webp 640w, /img/optimized/banner1-lcp.webp 960w`}
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
  const [isImportingSwiper, setIsImportingSwiper] = useState(false);
  
  useEffect(() => {
    // Import the Swiper components dynamically
    const loadSwiperComponents = async () => {
      if (isImportingSwiper) return; // Prevent duplicate loads
      
      try {
        setIsImportingSwiper(true);
        
        // Use dynamic import with low priority
        let SwiperModule, SwiperCoreModule;
        
        // Import components in parallel for better performance
        [SwiperModule, SwiperCoreModule] = await Promise.all([
          import('swiper/react'),
          import('swiper/modules'),
          import('swiper/css'),
          import('swiper/css/pagination')
        ]);
        
        // Set the modules - but only if component is still mounted
        if (typeof setSwiperComponents === 'function') {
          setSwiperComponents({
            Swiper: SwiperModule.Swiper,
            SwiperSlide: SwiperModule.SwiperSlide,
            Autoplay: SwiperCoreModule.Autoplay,
            Pagination: SwiperCoreModule.Pagination,
          });
        }
      } catch (error) {
        // Silence errors in production
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load Swiper components:', error);
        }
      } finally {
        setIsImportingSwiper(false);
      }
    };
    
    // Use requestIdleCallback to load Swiper when the browser is idle
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadSwiperComponents, { timeout: 3000 });
      } else {
        // Fallback to setTimeout for browsers without requestIdleCallback
        setTimeout(loadSwiperComponents, 100);
      }
    }
    
    // Cleanup
    return () => {
      // Cancel any pending callbacks or imports if component unmounts
    };
  }, [isImportingSwiper]);
  
  // If Swiper components aren't loaded yet, maintain the simple banner
  if (!SwiperComponents) {
    return (
      <div className="banner-placeholder relative">
        <Image
          src="/img/optimized/banner1-lcp.webp"
          alt="Presco Radiator Caps - Premium Automotive Components"
          priority={false} // We already have this loaded from the initial banner
          fill
          sizes="100vw"
          quality={75}
          loading="eager" // Already visible content should use eager loading
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="banner-image active"
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    );
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
      preloadImages={false} // Don't preload all images at once
      lazy={{ 
        loadPrevNext: true,
        loadPrevNextAmount: 1
      }}
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
            quality={80}
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
            quality={70}
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
            quality={70}
          />
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Banner;
