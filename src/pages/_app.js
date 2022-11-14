import Router from 'next/router';
import NProgress from 'nprogress'; 
import 'nprogress/nprogress.css'; 
import NextHead from './components/NextHead';

import '../styles/globals.css'

// Bind loading/progress functions to Next event listeners
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return <>
    <NextHead />
    <Component {...pageProps} />
  </>
}

export default MyApp
