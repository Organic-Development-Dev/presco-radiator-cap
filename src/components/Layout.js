import Head from 'next/head';
import { AppProvider } from './context/AppContext';
import Header from './Header';
import Footer from './Footer';
import client from './ApolloClient';
import Router from 'next/router';
import NProgress from 'nprogress';
import { ApolloProvider } from '@apollo/client';
import React from 'react';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const Layout = (props) => {
  return (
    <ApolloProvider client={client}>
      <AppProvider>
        <div>
          <Head>
            <title>Presco Radiator</title>
            <meta
              name='Unlock your success with our Copy Trading platform offering 100% passive income, Forex Signals and Future Signals! Join our platform for expert-guided trading strategies, real-time signals and automated copy trading. 
                Maximise your profits with the power of knowledge and experience in the world of trading'
              content='Trade and Thrive with Copy Trading,Forex signals and Future Signals'
            />
            <link rel='icon' type='image/x-icon' href='/img/favicon.png' />
          </Head>
          <Header />
          <div style={{ minHeight: '80vh' }}>{props.children}</div>
          <Footer />
        </div>
      </AppProvider>
    </ApolloProvider>
  );
};

export default Layout;
