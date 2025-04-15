import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Simple banner component without Next.js Image or Link components
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

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [slides.length]);
  
  // Navigation handler
  const navigateToLink = (link) => {
    router.push(link);
  };
  
  return (
    <div id="banner" style={{
      position: 'relative',
      width: '100%',
      paddingTop: '40%', // Aspect ratio
      overflow: 'hidden',
      backgroundColor: '#f5f5f5',
    }}>
      {/* Current slide */}
      <div 
        onClick={() => navigateToLink(slides[currentSlide].link)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          zIndex: 10
        }}
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
      
      {/* Navigation dots */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '6px',
        zIndex: 20
      }}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: currentSlide === index ? '#A11A36' : 'rgba(255,255,255,0.5)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              margin: '0 2px'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Banner;