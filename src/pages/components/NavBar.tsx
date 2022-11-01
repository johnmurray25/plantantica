import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link'

import { useAuthState } from 'react-firebase-hooks/auth'
import ReactLoading from 'react-loading'

import auth from '../../firebase/auth'
import Image from 'next/image'
import logo from '../../public/tree-logo.png'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { getProfilePictureUrl } from '../../service/FileService'
import customImageLoader from '../../util/customImageLoader'
import { getUserByUid, mapDocToUser } from '../../service/UserService'
import DBUser from '../../domain/DBUser'

interface NavProps {
  hideUser?: boolean;
}

const logoImageLoader = ({ src, width }) => {
  return src
}

const NavBar: FC<NavProps> = (props) => {

  const [user, loading, error] = useAuthState(auth);
  const hideUser = props.hideUser ? true : false;

  const { width, height } = useWindowDimensions();

  const [profPicUrl, setProfPicUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [isProfPicLoading, setIsProfPicLoading] = useState(false);
  const [userInDB, setUserInDB] = useState<DBUser>(null);

  useEffect(() => {
    if (!user) {
      return
    }

    if (!profPicUrl) {
      setIsProfPicLoading(true);
      getProfilePictureUrl(user.uid)
        .then(data => {
          setFileName(data.fileName)
          setProfPicUrl(data.url)
        })
        .catch(console.error)
        .finally(() => setIsProfPicLoading(false))
      getUserByUid(user.uid)
        .then(mapDocToUser)
        .then(setUserInDB)
        .catch(console.error);
    }

  }, [user, profPicUrl]);

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
          loading ?
            <div className='flex w-full pr-16 justify-end absolute'>
              <ReactLoading type='cylon' color="#fff" />
            </div>
            :
            (
              user && userInDB ?
                <Link href="/profile" passHref>
                  <div className='cursor-pointer lg:pr-8'>
                    {userInDB.profilePicture ?
                      // User has saved profile picture
                      isProfPicLoading ?
                        <ReactLoading type='spinningBubbles' color="#fff" />
                        :
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
                      <a className="inline-block text-xs lg:text-xs px-4 py-2 leading-none border rounded border-yellow text-yellow hover:border-transparent hover:text-green hover:bg-yellow mt-4 lg:mt-0">
                        {userInDB.username ? `@${userInDB.username}` : user.email}
                      </a>
                    }
                  </div>
                </Link>
                :
                <Link href="/auth" passHref>
                  <a className="inline-block text-xs lg:text-sm px-4 py-2 leading-none border rounded border-yellow text-yellow border-yello hover:border-transparent hover:text-green hover:bg-yellow mt-4 lg:mt-0">
                    Login / Sign up
                  </a>
                </Link>
            )
        )
      }
    </nav>
  )
}

export default NavBar