import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link'

import { useAuthState } from 'react-firebase-hooks/auth'
import ReactLoading from 'react-loading'

import auth from '../../firebase/auth'
import Image from 'next/image'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { getProfilePictureUrl } from '../../service/FileService'
import customImageLoader from '../../util/customImageLoader'
import { getUserByUid, getUserDBRecord, mapDocToUser } from '../../service/UserService'
import DBUser from '../../domain/DBUser'
import TreeLogo from './TreeLogo'

interface NavProps {
  hideUser?: boolean;
  hideLogo?: boolean;
}

const NavBar: FC<NavProps> = (props) => {

  const [user, loading, error] = useAuthState(auth);
  const hideUser = props.hideUser ? true : false;
  const hideLogo = props.hideLogo ? true : false;

  const { height } = useWindowDimensions();

  const [profPicUrl, setProfPicUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [userInDB, setUserInDB] = useState<DBUser>(null);

  useEffect(() => {
    if (!user) {
      if (!loading) {
        setIsLoading(false)
      }
      return;
    }

    if (!profPicUrl) {
      getUserDBRecord(user?.uid)
        .then((u) => {
          setUserInDB(u)
          getProfilePictureUrl(user.uid)
            .then(data => {
              setFileName(data.fileName)
              setProfPicUrl(data.url)
            })
            .catch(console.error)
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }

  }, [user, profPicUrl, loading, isLoading]);

  return (
    <nav className="z-10 fixed bg-transparent flex justify-between flex-wrap px-4 pt-4 pb-2 items-center w-full">
      <div className='bg-green p-1 lg:p-3 pl-2 //border rounded //border-[#2bb32b]'>
        {!hideLogo &&
          <Link href="/" passHref>
            <div className="flex items-center flex-shrink-0  cursor-pointer pr-4">
              <TreeLogo />
              {/* <span className="text-xl tracking-tight px-2 py-4 rounded bg-green">Plantantica</span> */}
            </div>
          </Link>
        }
      </div>
      {!hideUser &&
        loading || isLoading ?
        <ReactLoading type='cylon' color="#fff" />
        :
        user && userInDB ?
          <Link href="/profile" passHref>
            <div className='cursor-pointer lg:pr-8'>
              {userInDB.profilePicture ?
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
                <div className="inline-block text-xs lg:text-xs px-4 py-2 leading-none border rounded border-stone-100 text-stone-100 hover:border-transparent hover:text-green hover:bg-stone-100 mt-4 lg:mt-0">
                  {userInDB.username ? `@${userInDB.username}` : user.email}
                </div>
              }
            </div>
          </Link>
          :
          <Link href="/auth" passHref
            className="inline-block text-xs lg:text-sm px-4 py-2 leading-none border rounded border-stone-100 text-stone-100 border-yello hover:border-transparent hover:text-green hover:bg-stone-100 mt-4 lg:mt-0"
          >
            Login / Sign up
          </Link>
      }
    </nav>
  )
}

export default NavBar