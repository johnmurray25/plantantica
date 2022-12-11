import { useEffect, useState } from 'react'
import Link from 'next/link'

import ReactLoading from 'react-loading'

import Image from 'next/image'
import TreeLogo from './TreeLogo'
import useAuth from '../../hooks/useAuth'

interface NavProps {
  hideUser?: boolean;
  hideLogo?: boolean;
}

const NavBar = (props: NavProps) => {

  const hideUser = props.hideUser ? true : false;
  const hideLogo = props.hideLogo ? true : false;

  const [isLoading, setIsLoading] = useState(true)
  const [profPicUrl, setProfPicUrl] = useState("")

  const { user, dBUser, loading } = useAuth()

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
    <nav className="z-10 fixed bg-transparent flex justify-between flex-wrap px-4 pt-4 pb-2 items-center w-full">
      <div className='bg-brandGreen p-1 lg:p-3 pl-2 //border rounded //border-[#2bb32b]'>
        {!hideLogo &&
          <Link href="/" passHref>
            <div className="flex items-center flex-shrink-0  cursor-pointer pr-4 py-3">
              <TreeLogo width={200} height={120} />
            </div>
          </Link>
        }
      </div>
      {!hideUser &&
        (isLoading) ?
        <ReactLoading type='cylon' color="#FFF7ED" />
        :
        dBUser ?
          <Link href="/profile" passHref>
            <div className='cursor-pointer lg:pr-8'>
              {
                profPicUrl ?
                  <Image
                    src={profPicUrl}
                    sizes="15vw"
                    alt='Profile'
                    width={60}
                    height={60}
                    className='rounded-full'
                  />
                  :
                  <div className="inline-block text-xs lg:text-xs px-4 py-2 leading-none border rounded border-stone-100 text-stone-100 hover:border-transparent hover:text-brandGreen hover:bg-stone-100 mt-4 lg:mt-0">
                    {dBUser.username ? `@${dBUser.username}` : user.email}
                  </div>
              }
            </div>
          </Link>
          :
          <Link href="/auth" passHref
            className="inline-block text-xs lg:text-sm px-4 py-2 leading-none border rounded border-stone-100 text-stone-100 border-yello hover:border-transparent hover:text-brandGreen hover:bg-stone-100 mt-4 lg:mt-0"
          >
            Login / Sign up
          </Link>
      }
    </nav>
  )
}

export default NavBar