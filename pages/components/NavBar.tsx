import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ReactLoading from 'react-loading'

import useWindowDimensions from '../../hooks/useWindowDimensions'
import TreeLogo from './TreeLogo'
import hamburger from '../../public/vector/hamburger.svg'
import Image from 'next/image'
import useAuth from '../../hooks/useAuth'

const NavBar: React.FC<{ hideSidebar?: boolean; }> = (props) => {

    const { width } = useWindowDimensions()
    const { user, dBUser, loading, initialized } = useAuth()

    const [isLoading, setIsLoading] = useState(true)
    const [profPicUrl, setProfPicUrl] = useState("")
    const [showSidebar, setShowSidebar] = useState(false)

    useEffect(() => {
        if (dBUser) {
            if (dBUser.profPicUrl) {
                setProfPicUrl(dBUser.profPicUrl)
            }
            setIsLoading(false)
        }
        if (!loading) {
            setIsLoading(false)
        }
    }, [dBUser, loading])

    return (
        <div className='futura flex justify-between text-primary text-opacity-90 items-center px-4 py-4'>
            {/* Left */}
            <Link href="/" passHref>
                <div className="futura font-bold text-gray-50 hover:text-lime-300 transition-colors text-3xl flex items-center flex-shrink-0  cursor-pointer med:pr-4 py-1 px-2 ">
                    <TreeLogo width={80} height={80} />
                    Plantantica
                </div>
            </Link>

            {/* Right */}
            {width >= 800 ?
                <div className="flex justify-evenly items-center">
                    <Link href="/" className='px-4'>
                        Home
                    </Link>
                    <Link href="/Tracking" className='px-4'>
                        My plants
                    </Link>
                    {/* <Link href="/Contact" className='px-4'>
                        Contact
                    </Link> */}
                    <Link href="/About" className='px-4'>
                        About
                    </Link>
                    {isLoading || !initialized ?
                        <div className="w-20 h-20 ml-[68px]">
                            <ReactLoading type='cylon' color="#FFF7ED" />
                        </div>
                        :
                        dBUser ?
                            <Link href="/profile" passHref>
                                <div className='ml-8 text-gray-100 text-opacity-80 font-bold uppercase transition-colors hover:bg-green-700 hover:bg-opacity-20 flex items-center rounded-full justify-between cursor-pointer lg:mr-8 border border-gray-100 bg-opacity-70 //shadow-md p-0'>
                                    {
                                        profPicUrl ?
                                            <div className='relative w-20 h-20 rounded-full'>
                                                <Image
                                                    src={profPicUrl}
                                                    sizes="15vw"
                                                    alt='Profile'
                                                    fill
                                                    className='object-cover rounded-full'
                                                />
                                            </div>
                                            :
                                            <div className="flex items-center justify-between px-4 py-4 leading-none transition-colors hover:border-transparent ">
                                                {dBUser.username ? `@${dBUser.username}` : user.email}
                                            </div>
                                    }
                                </div>
                            </Link>
                            :
                            <>
                                <Link href="/auth" className='px-4'>
                                    Sign in
                                </Link>
                                <Link href="/auth"
                                    className='font-bold border-2 ml-6 border-primary rounded-full 
                    py-2 px-4 hover:bg-primary hover:text-gray-50 transition-colors'
                                >
                                    Join now
                                </Link>
                            </>
                    }
                </div>
                : !props.hideSidebar &&
                <div>
                    <button onClick={() => setShowSidebar(!showSidebar)}>
                        <Image
                            src={hamburger}
                            alt="menu"
                            width={40}
                            height={40}
                        />
                    </button>
                    {/* Sidebar */}
                    <div id='sidebar'
                        className={`fixed h-full min-h-screen w-3/5 top-0 right-0 z-50 text-xl px-8 pt-6
                        ${showSidebar ? 'translate-x-0' : 'translate-x-full'} ease-in-out duration-200 bg-primary bg-opacity-90 backdrop-blur-lg text-gray-100 text-opacity-70`}>
                        <div className="flex w-full justify-end">
                            <button
                                className='text-[40px]'
                                onClick={() => setShowSidebar(!showSidebar)}
                            >
                                x
                            </button>
                        </div>
                        <div className="text-center text-[28px] pt-8">
                            <section>
                                {user ?
                                    <div className='flex justify-center'>
                                        <Link href="/profile" passHref>
                                            <div className='w-fit ml-8 text-gray-100 text-opacity-80 transition-colors hover:bg-green-700 rounded-full justify-between cursor-pointer lg:mr-8 bg-gray-100 bg-opacity-70 shadow-md p-0.5'>
                                                {
                                                    profPicUrl ?
                                                        <div className='relative w-20 h-20 rounded-full'>
                                                            <Image
                                                                src={profPicUrl}
                                                                sizes="15vw"
                                                                alt='Profile'
                                                                fill
                                                                className='object-cover rounded-full'
                                                            />
                                                        </div>
                                                        :
                                                        <div className="flex items-center justify-between px-4 py-4 leading-none transition-colors hover:border-transparent ">
                                                            {dBUser?.username ? `@${dBUser.username}` : user?.email}
                                                        </div>
                                                }
                                            </div>
                                        </Link>
                                    </div>
                                    :
                                    <>
                                        <Link href="/auth" className='py-6 mb-6 leading-loose'>
                                            Sign in
                                        </Link>
                                        <div className='w-full border-t border-gray-100 border-opacity-50 my-4'></div>
                                        <Link href="/auth" className='py-6 mb-6 leading-loose text-green-500'>
                                            Join now
                                        </Link>
                                    </>
                                }
                            </section>
                            <div className='w-full border-t border-gray-100 border-opacity-50 my-4'></div>
                            <section>
                                <Link href="/" className='py-6 mb-6 leading-loose'>
                                    Home
                                </Link>
                            </section>
                            <div className='w-full border-t border-gray-100 border-opacity-50 my-4'></div>
                            <section>
                                <Link href="/Tracking" className='py-6 mb-6 leading-loose'>
                                    My plants
                                </Link>
                            </section>
                            {/* <div className='w-full border-t border-gray-100 border-opacity-50 my-4'></div> */}
                            {/* <Link href="/About" className='py-6 mb-6 leading-loose'>
                                About
                            </Link> */}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default NavBar