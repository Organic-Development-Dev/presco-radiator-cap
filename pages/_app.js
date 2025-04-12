// Import all necessary styles directly
import "../src/styles/grid.css";
import "../src/styles/custom.css";
import "../src/styles/main.scss";
import "../src/styles/style.scss";

import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useEffect, useState } from "react";
import Layout from "../src/components/Layout";
import ErrorBoundary from "../src/components/ErrorBoundary";
import Head from "next/head";
import TagManager from 'react-gtm-module';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Initialize Google Tag Manager asynchronously with low priority to improve LCP
  useEffect(() => {
    // Only load GTM after the page has loaded (all critical content is displayed)
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GTM_ID) {
      // Use requestIdleCallback to load GTM during browser idle time
      const loadGTM = () => {
        try {
          TagManager.initialize({ 
            gtmId: process.env.NEXT_PUBLIC_GTM_ID,
            // Use dataLayer variables to optimize GTM
            dataLayer: {
              'gtm.start': new Date().getTime(),
              event: 'gtm.js',
              'optimizeLoad': true, // Custom flag to use in GTM for optimized loading
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

      // Load GTM after initial page render is complete
      if ('requestIdleCallback' in window) {
        // Modern browsers - use requestIdleCallback
        window.requestIdleCallback(loadGTM, { timeout: 2000 });
      } else if ('requestAnimationFrame' in window) {
        // Fallback - use requestAnimationFrame with a delay
        window.addEventListener('load', () => {
          setTimeout(() => window.requestAnimationFrame(loadGTM), 1000);
        });
      } else {
        // Legacy fallback - use window load with timeout
        window.addEventListener('load', () => {
          setTimeout(loadGTM, 1500);
        });
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
      <ErrorBoundary>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;

