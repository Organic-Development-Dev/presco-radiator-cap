// Only import styles needed for all pages (move specific styles to components that need them)
import "../src/styles/grid.css";
import "../src/styles/custom.css";
// Use dynamic import for SCSS to reduce initial CSS payload
import dynamic from 'next/dynamic';

import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useEffect, useState } from "react";
import Layout from "../src/components/Layout";
import ErrorBoundary from "../src/components/ErrorBoundary";
import Head from "next/head";

// Dynamically import heavy resources
const TagManager = dynamic(() => import("react-gtm-module"), { ssr: false });

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Add state to control when to load heavy CSS
  const [loadStyles, setLoadStyles] = useState(false);
  
  // Initialize Google Tag Manager and load non-critical CSS
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GTM_ID) {
      // Dynamically initialize Tag Manager
      TagManager.default.initialize({ gtmId: process.env.NEXT_PUBLIC_GTM_ID });
    }
    
    // Delay loading of additional styles after initial paint
    const timer = setTimeout(() => {
      import("../src/styles/main.scss");
      import("../src/styles/style.scss");
      setLoadStyles(true);
    }, 1000);
    
    return () => clearTimeout(timer);
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
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/_next/static/media/fonts/your-font.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
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

