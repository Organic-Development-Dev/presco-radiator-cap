import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Ultra-simplified banner implementation to fix React errors
function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  
  // Simple slides data
  const slides = [
    {
      src: '/img/banner1.webp',
      alt: 'Presco Radiator Caps - Premium Automotive Components',
      link: '/product-category/radiator-caps'
    },
    {
      src: '/img/banner2.webp',
      alt: 'High-Performance Radiator Caps for All Vehicle Types',
      link: '/product-category/auto'
    },
    {
      src: '/img/banner3.webp',
      alt: 'Quality Engineered Cooling System Components',
      link: '/products'
    }
  ];

  // Simple auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [slides.length]);
  
  // Simple navigation handler
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Navigation handler
  const navigateToLink = (link) => {
    router.push(link);
  };
  
  return (
    <div id="banner" className="relative banner-placeholder">
      {/* Render current slide only */}
      <div 
        className="banner-image active" 
        onClick={() => navigateToLink(slides[currentSlide].link)}
        style={{cursor: 'pointer'}}
      >
        <img
          src={slides[currentSlide].src}
          alt={slides[currentSlide].alt}
          style={{
            width: '100%',
            height: '100%', 
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      </div>
      
      {/* Simple navigation dots */}
      <div className="banner-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`banner-dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Banner;