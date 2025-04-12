import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "../src/styles/grid.css";
import "../src/styles/custom.css";
import "../src/styles/main.scss";
import "../src/styles/style.scss";

import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useEffect } from "react";
import Layout from "../src/components/Layout";
import TagManager from "react-gtm-module";
import ErrorBoundary from "../src/components/ErrorBoundary";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Initialize Google Tag Manager
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GTM_ID) {
      TagManager.initialize({ gtmId: process.env.NEXT_PUBLIC_GTM_ID });
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

