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

  // Initialize Google Tag Manager
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GTM_ID) {
      try {
        TagManager.initialize({ gtmId: process.env.NEXT_PUBLIC_GTM_ID });
      } catch (error) {
        // Silently catch errors in production
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to initialize TagManager:', error);
        }
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

