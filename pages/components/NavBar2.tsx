import Link from 'next/link'
import React from 'react'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import TreeLogo from './TreeLogo'

const NavBar2 = () => {

    const { width } = useWindowDimensions()

    return (
        <div className='futura flex justify-between items-center px-4 py-4'>
            {/* Left */}
            <Link href="/" passHref>
                <div className="futura font-bold text-gray-50 text-3xl flex items-center flex-shrink-0  cursor-pointer med:pr-4 py-1 px-2 ">
                    <TreeLogo width={80} height={80} />
                    {width && width >= 420 && 'Plantantica'}
                </div>
            </Link>

            {/* Right */}
            <div className="flex justify-evenly items-center">
                <Link href="/Contact" className='px-4'>
                    Contact
                </Link>
                <Link href="/About" className='px-4'>
                    About
                </Link>
                <Link href="/auth" className='px-4'>
                    Sign in
                </Link>
                <Link href="/auth"
                    className='font-bold border-2 ml-6 border-primary rounded-full 
                    py-2 px-4 hover:bg-primary hover:text-gray-50 transition-colors'
                >
                    Join now
                </Link>
            </div>
        </div>
    )
}

export default NavBar2