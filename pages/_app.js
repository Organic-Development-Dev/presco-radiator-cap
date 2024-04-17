import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "../src/styles/main.scss";
import "../src/styles/style.scss";

import Router from 'next/router';
import NProgress from 'nprogress';
import { useEffect } from "react";
import Layout from "../src/components/Layout";
import TagManager from "react-gtm-module";

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  useEffect(() => {
      TagManager.initialize({ gtmId: process.env.NEXT_PUBLIC_GTM_ID });
  }, []);
  return (<Layout>
    <Component {...pageProps} />
  </Layout>)

}

export default MyApp

