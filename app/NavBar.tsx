"use client"
import React, { FC, useContext } from 'react'
import Link from 'next/link'

import Image from 'next/image'
import logo from '../public/tree-logo.png'
import useWindowDimensions from '../hooks/useWindowDimensions'
import customImageLoader from '../util/customImageLoader'
import UserContext from './context/UserContext'
import DBUserContext from './context/DBUserContext'
import ProfPicUrlContext from './context/ProfPicUrlContext'

interface NavProps {
  hideUser?: boolean;
}

const logoImageLoader = ({ src, width }) => {
  return src
}

const NavBar: FC<NavProps> = (props) => {

  const user = useContext(UserContext)
  const userInDB = useContext(DBUserContext)
  const profPicUrl = useContext(ProfPicUrlContext)

  console.log("NAVBAR:: user: " + user?.email)
  const hideUser = props.hideUser ? true : false;

  const { height } = useWindowDimensions();

  console.log("NAVBAR:: userInDB: " + userInDB?.email)

  const logoSize = height ? height / 17 : 40;

  return (
    <nav className="z-10 fixed bg-transparent flex justify-between flex-wrap px-4 pt-4 pb-2 items-center w-full">
      <div className='bg-green p-1 lg:p-3 pl-2 border rounded border-[#29bc29]'>
        <Link href="/" passHref>
          <div className="flex items-center flex-shrink-0  cursor-pointer">
            <Image
              src={logo}
              alt='Tree logo'
              loader={logoImageLoader}
              width={logoSize}
              height={logoSize}
            />
            <span className="text-xl tracking-tight px-2 py-4 rounded bg-green">Plantantica</span>
          </div>
        </Link>
      </div>
      {!hideUser &&
        (
          user && userInDB ?
            <Link href="/profile" passHref>
              <div className='cursor-pointer lg:pr-8'>
                {userInDB.profilePicture ?
                  // User has saved profile picture
                  <Image
                    src={profPicUrl}
                    loader={customImageLoader}
                    // alt='Profile picture'
                    alt=''
                    width={height ? height / 14 : 40}
                    height={height ? height / 13 : 40}
                    className='rounded-3xl'
                  />
                  :
                  <p className="inline-block text-xs lg:text-xs px-4 py-2 leading-none border rounded border-yellow text-yellow hover:border-transparent hover:text-green hover:bg-yellow mt-4 lg:mt-0">
                    {userInDB.username ? `@${userInDB.username}` : user.email}
                  </p>
                }
              </div>
            </Link>
            :
            <Link href="/Auth" passHref>
              <p className="inline-block text-xs lg:text-sm px-4 py-2 leading-none border rounded border-yellow text-yellow border-yello hover:border-transparent hover:text-green hover:bg-yellow mt-4 lg:mt-0">
                Login / Sign up
              </p>
            </Link>
        )
      }
    </nav>
  )
}

export default NavBar