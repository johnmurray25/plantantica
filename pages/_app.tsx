import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { ThemeProvider } from "next-themes";

import '../styles/globals.css' // enable tailwind
import PlantContext from "../context/PlantContext"
import usePlants from "../hooks/usePlants"
import Header from './components/util/Header';

// Bind loading/progress functions to NextJS event listeners
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function Plantantica({ Component, pageProps }) {

  const { plants, setPlants, deletePlant } = usePlants()

  return <>
    <ThemeProvider attribute='class'>
      <Header />
      <div className="antialiased select-none text-gray-100 text-opacity-80 bg-lightbg dark:bg-[#0A0E03] w-screen min-h-screen break-words tracking-wide">
        <PlantContext.Provider value={{ plants, setPlants, deletePlant }}>
          <Component {...pageProps} />
        </PlantContext.Provider>
      </div>
    </ThemeProvider>
  </>
}

export default Plantantica
