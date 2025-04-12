// Import all necessary styles directly
import "../src/styles/grid.css";
import "../src/styles/custom.css";
import "../src/styles/main.scss";
import "../src/styles/style.scss";
import "../src/styles/mobile-fixes.css";

import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useEffect, useState } from "react";
import Layout from "../src/components/Layout";
import dynamic from 'next/dynamic';
const ErrorBoundary = dynamic(() => import('../src/components/ErrorBoundary'), { ssr: false });
import Head from "next/head";
// Import TagManager dynamically to avoid impacting initial loading
// import TagManager from 'react-gtm-module';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Ultimate GTM lazy-loading to prioritize LCP
  useEffect(() => {
    // Only load GTM long after the page has fully loaded and user has interacted
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GTM_ID) {
      // Create a function to dynamically import and initialize TagManager
      const importAndInitializeGTM = async () => {
        try {
          // Dynamically import TagManager only when needed
          const TagManagerModule = await import('react-gtm-module');
          const TagManager = TagManagerModule.default;
          
          // Initialize with performance tracking
          TagManager.initialize({ 
            gtmId: process.env.NEXT_PUBLIC_GTM_ID,
            // Use dataLayer variables to optimize GTM
            dataLayer: {
              'gtm.start': new Date().getTime(),
              event: 'gtm.js',
              'optimizeLoad': true, // Custom flag for optimized loading
              'pageLoadTime': window.performance && 
                window.performance.timing ? 
                (window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart) : 
                'unavailable'
            }
          });
        } catch (error) {
          // Silently catch errors in production
          if (process.env.NODE_ENV !== 'production') {
            console.error('Failed to initialize TagManager:', error);
          }
        }
      };

      // Use passive interaction detection to delay GTM until user interaction
      const initializeAfterInteraction = () => {
        // Define events that indicate user engagement
        const interactionEvents = ['scroll', 'click', 'mousemove', 'touchstart'];
        
        // Function that loads GTM and removes all event listeners
        const loadGTMAndCleanup = () => {
          // Clean up event listeners before import
          interactionEvents.forEach(event => {
            window.removeEventListener(event, loadGTMAndCleanup, { passive: true });
          });
          
          // Delay import even after interaction for better performance
          setTimeout(importAndInitializeGTM, 2000);
        };
        
        // Add passive event listeners for interaction events
        interactionEvents.forEach(event => {
          window.addEventListener(event, loadGTMAndCleanup, { passive: true, once: true });
        });
        
        // Fallback: load GTM after a long timeout even without interaction
        setTimeout(loadGTMAndCleanup, 10000);
      };
      
      // Wait for the page to fully load before setting up interaction detection
      if (document.readyState === 'complete') {
        initializeAfterInteraction();
      } else {
        window.addEventListener('load', initializeAfterInteraction);
      }
    }
  }, []);

  // Setup NProgress (loading indicator)
  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        {/* Script to detect modern browsers and serve specific JavaScript */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Check for modern browser
                var isModern = 'IntersectionObserver' in window && 
                              'fetch' in window && 
                              'CustomEvent' in window;
                document.documentElement.className = isModern ? 'modern-browser' : 'legacy-browser';
              })();
            `,
          }}
        />
      </Head>
      {/* No ErrorBoundary here - it's been moved to Layout component */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;

