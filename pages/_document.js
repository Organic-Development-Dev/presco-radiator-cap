import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // Feature detection for modern optimizations
  const featureDetection = `
    (function() {
      // Create feature detection flags for modern browser capabilities
      window.__features = {
        supportsWebP: false,
        supportsIntersectionObserver: 'IntersectionObserver' in window,
        supportsModules: 'noModule' in document.createElement('script'),
        supportsAvif: false,
        supportsFetchPriority: 'fetchPriority' in document.createElement('img')
      };
      
      // Test for WebP support
      var webP = new Image();
      webP.onload = function() { window.__features.supportsWebP = (webP.width === 1); };
      webP.onerror = function() { window.__features.supportsWebP = false; };
      webP.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
      
      // Test for AVIF support
      var avif = new Image();
      avif.onload = function() { window.__features.supportsAvif = (avif.width === 1); };
      avif.onerror = function() { window.__features.supportsAvif = false; };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      
      // Preload the LCP image based on best format support
      var preferredFormat = window.__features.supportsAvif ? 'avif' : 
                          window.__features.supportsWebP ? 'webp' : 'png';
      
      // Mark start time for performance measurement
      if (window.performance && window.performance.mark) {
        window.performance.mark('app-init');
      }
      
      // Preload LCP image immediately 
      if (window.__features.supportsFetchPriority) {
        var preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = '/img/optimized/banner1-lcp.webp';
        preloadLink.type = 'image/webp';
        preloadLink.fetchPriority = 'high';
        document.head.appendChild(preloadLink);
      }
    })();
  `;

  // LCP optimization - eager load optimized banner image
  const preloadBanner = `
    window.addEventListener('load', function() {
      // Mark page load complete for performance measurement
      if (window.performance && window.performance.mark) {
        window.performance.mark('page-loaded');
        // Measure and report to analytics if needed
        window.performance.measure('page-load-time', 'app-init', 'page-loaded');
      }

      // Preload the rest of the banner images after page load
      ['/img/banner2.webp', '/img/banner3.webp'].forEach(function(src) {
        var img = new Image();
        img.src = src;
      });
    });
  `;

  return (
    <Html lang='en'>
      <Head>
        {/* Preconnect to critical origins as early as possible */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin="anonymous" />
        
        {/* Feature detection script - execute as early as possible */}
        <script dangerouslySetInnerHTML={{ __html: featureDetection }} />
        
        {/* Load critical fonts first, other weights later - using the display=swap pattern */}
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap'
          rel='stylesheet'
          media="print"
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap'
            rel='stylesheet'
          />
        </noscript>
        
        {/* Non-critical font weights loaded with low priority */}
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600&display=optional'
          rel='stylesheet' 
          media="print"
          onLoad="this.media='all'"
          fetchpriority="low"
        />
        
        {/* Core web vitals optimization - preload critical resources with highest priority */}
        <link 
          rel="preload" 
          as="image" 
          href="/img/optimized/banner1-lcp.webp" 
          type="image/webp" 
          media="(min-width: 641px)"
          fetchpriority="high" 
        />
        <link 
          rel="preload" 
          as="image" 
          href="/img/optimized/banner1-lcp-sm.webp" 
          type="image/webp"
          media="(max-width: 640px)" 
          fetchpriority="high" 
        />
        <link rel="preload" as="image" href="/img/logo.png" fetchpriority="high" />
        
        {/* Add resource hints for domains we'll connect to */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <link rel="dns-prefetch" href="https://www.presco-radiator-caps.com" />
                
        {/* Inline critical CSS for faster render */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical CSS for initial render - keep minimal */
          :root {
            --primary-color: #A11A36;
            --secondary-color: #4C4C4C;
          }
          body {
            font-family: 'Montserrat', sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
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
          /* Hide content flash while loading */
          .js-banner-loading {
            opacity: 0.01;
            transition: opacity 0.5s ease-in-out;
          }
          .js-banner-loaded {
            opacity: 1;
          }
        `}} />
        
        {/* Preload script */}
        <script dangerouslySetInnerHTML={{ __html: preloadBanner }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
