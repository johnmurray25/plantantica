import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import HeroContainer from './HeroContainer'
import NavBar2 from './NavBar2'
import GithubLogo from "../../public/vector/github.svg";

const HeroDesktop = () => {

    const { width } = useWindowDimensions()

    return (
        <HeroContainer>
            <NavBar2 />
            <h1 className='text-center font-bold text-[60px] pb-8'>
                Plant care made easy.
            </h1>
            <ul className='list-disc bg-[#8A9889] text-white text-opacity-75 bg-opacity-50 w-screen py-3 text-[28px] font-bold text-justify pl-[20vw]'>
                <li className='py-4'>
                    <span className='text-[40px]'>TRACK</span> your plants&apos; watering, care, & growth
                </li>
                <li className='py-4'>
                    <span className='text-[40px]'>GET</span> reminders when your plants are thirsty
                </li>
                <li className='py-4'>
                    <span className='text-[40px]'>SHARE</span> photos and tips with the growing community
                </li>
                <li className='py-4'>
                    <span className='text-[40px]'>LEARN</span> about your plants&apos; needs
                </li>
            </ul>
            <div className='flex justify-center text-center pb-0 pt-8 text-gray-100'>
                <Link href="/auth" passHref className='bg-primary bg-opacity-80 hover:bg-primary transition-colors font-bold text-[36px] w-fit px-12 py-2 rounded-full leading-none'>
                    Join Now <br></br> <span className='text-[20px]'>it&apos;s free</span>
                </Link>
            </div>
            <div className='mt-12 text-left flex justify-center w-full font-bold'>
                <div className='py-2 px-4 w-2/5 bg-[#8A9889] bg-opacity-80 text-gray-100 text-opacity-70 font-bold text-[28px]'>
                    <h3>How does it work?</h3>
                    <Image
                        src="/desktop-demo-screenshot.png"
                        alt="demo on desktop"
                        width={width ? width / 2 : 600}
                        height={384}
                    />
                    <ul className='list-decimal bg-[#8A9889] text-gray-100 text-opacity-60 bg-opacity-50 py-3 text-[28px] font-normal px-8'>
                        <li className='py-3'>
                            Choose one of your plants
                        </li>
                        <li className='py-3'>
                            Enter species, watering frequency, and date to water next.
                        </li>
                        <li className='py-3'>
                            We&apos;ll remind you when it&apos;s time to water!
                        </li>
                        <li className='py-3'>
                            Check the soil, and adjust watering frequency if needed.
                        </li>
                    </ul>
                </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end items-center pr-12 text-lg py-4 mt-12 bg-gray-700 text-gray-800 text-opactiy-70 bg-opacity-10">
                <Link href="https://github.com/johnmurray25/plantantica" passHref>
                    <Image
                        src={GithubLogo}
                        alt="Link to GitHubRepo"
                        width={40}
                        height={40}
                    />
                </Link>
                <p className='ml-12'>
                    An app by John Murray
                </p>
            </div>
        </HeroContainer>
    )
}

export default HeroDesktop