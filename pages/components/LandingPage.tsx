import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import NavBar2 from './NavBar2'
import GithubLogo from "../../public/vector/github.svg";
import Container from './Container'

const LandingPage = () => {

    const { width } = useWindowDimensions()

    return (
        <Container>
            <NavBar2 />
            <h1 className={`text-center font-normal ${width>=800?'text-[60px]':'text-[50px]'} pb-8`}>
                Plant care made easy.
            </h1>
            <ul className={`list-disc bg-[#8A9889] text-white text-opacity-75 bg-opacity-50 w-screen py-3 font-medium text-justify 
            ${width>=800?'text-[24px] pl-[28vw]':'text-[20px] px-8'} `}>
                <li className='py-2'>
                    <span className='text-[32px] font-medium'>TRACK</span> your plants&apos; watering, care, & growth
                </li>
                <li className='py-2'>
                    <span className='text-[32px] font-medium'>GET</span> reminders when your plants are thirsty
                </li>
                <li className='py-2'>
                    <span className='text-[32px] font-medium'>SHARE</span> photos and tips with the growing community
                </li>
                <li className='py-2'>
                    <span className='text-[32px] font-medium'>LEARN</span> about your plants&apos; needs
                </li>
            </ul>
            <div className='flex justify-center text-center pb-0 pt-8 text-gray-100'>
                <Link href="/auth" passHref className='backdrop-blur-sm bg-primary bg-opacity-90 hover:bg-primary transition-colors text-[36px] w-fit px-12 py-4 rounded-full leading-none'>
                    Join now <span className='text-[20px] font-normal'>It&apos;s free</span>
                </Link>
            </div>
            <div className='mt-12 text-left flex justify-center w-full font-bold'>
                <div className={`py-2 px-4 bg-[#8A9889] bg-opacity-80 text-gray-100 text-opacity-50 font-bold text-[30px]
                ${width>=800 && 'w-2/5'}`}>
                    <h3>How does it work?</h3>
                    {/* <Image
                        src="/desktop-demo-screenshot.png"
                        alt="demo on desktop"
                        width={width ? width / 2 : 600}
                        height={384}
                    /> */}
                    <ul className='list-disc bg-[#8A9889] text-gray-100 text-opacity-80 bg-opacity-50 py-3 text-[24px] font-normal px-8'>
                        <li className='py-3'>
                            Enter some info about your plants
                        </li>
                        <li className='py-3'>
                            We&apos;ll remind you when it&apos;s time to water them!
                        </li>
                        <li className='py-3'>
                            Add updates/photos of your plants as they grow
                        </li>
                        <li className='py-3'>
                            Weather-based insights can help guide you in your plant care
                        </li>
                        <li className='py-3'>
                            Find or make friends and see their plants
                        </li>
                    </ul>
                    <p className='py-3 font-light text-[18px] text-gray-100 text-opacity-40'>
                        Always check the soil before watering. We recommend using a moisture meter for most plants.
                        Adjust the days between watering as much as needed!
                        It will always depend on amount of light, temperature, potting media, humidity, etc.
                    </p>
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
        </Container>
    )
}

export default LandingPage