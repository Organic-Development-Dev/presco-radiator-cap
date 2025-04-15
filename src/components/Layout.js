import Head from 'next/head';
import { AppProvider } from './context/AppContext';
import Header from './Header';
import Footer from './Footer';
import { initializeApollo } from './ApolloClient';
import Router from 'next/router';
import NProgress from 'nprogress';
import { ApolloProvider } from '@apollo/client';
import React, { useMemo } from 'react';
import Subscribe from './home/subscriber';
import ErrorBoundary from './ErrorBoundary';

// Use the Router events outside of the component to avoid excessive re-renders
if (typeof window !== 'undefined') {
  Router.events.on('routeChangeStart', () => NProgress.start());
  Router.events.on('routeChangeComplete', () => NProgress.done());
  Router.events.on('routeChangeError', () => NProgress.done());
}

const Layout = (props) => {
  // Initialize Apollo with useMemo to prevent unnecessary recreations
  const apolloClient = useMemo(() => initializeApollo(), []);
  
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
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
            <div style={{ minHeight: '50vh' }}>{props.children}</div>
            <Subscribe />
            <Footer />
          </div>
        </AppProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

export default Layout;
