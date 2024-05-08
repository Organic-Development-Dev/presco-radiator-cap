import Head from 'next/head';
import { AppProvider } from './context/AppContext';
import Header from './Header';
import Footer from './Footer';
import client from './ApolloClient';
import Router from 'next/router';
import NProgress from 'nprogress';
import { ApolloProvider } from '@apollo/client';
import React from 'react';
import Subscribe from './home/subscriber';

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
              name='Presco Radiator Caps'
              content='Welcome to the Presco Radiator Caps Ltd Web site.'
            />
            <link rel='icon' type='image/x-icon' href='/img/favicon.png' />
          </Head>
          <Header />
          <div style={{ minHeight: '80vh' }}>{props.children}</div>
          <Subscribe />
          <Footer />
        </div>
      </AppProvider>
    </ApolloProvider>
  );
};

export default Layout;
