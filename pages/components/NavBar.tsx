import { useEffect, useState } from 'react'
import Link from 'next/link'

import ReactLoading from 'react-loading'

import Image from 'next/image'
import TreeLogo from './TreeLogo'
import useAuth from '../../hooks/useAuth'
import useWindowDimensions from '../../hooks/useWindowDimensions'

interface NavProps {
  hideUser?: boolean;
  hideLogo?: boolean;
}

const NavBar = (props: NavProps) => {

  const { width } = useWindowDimensions()

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
    <nav className=" z-10 fixed flex justify-between flex-wrap px-4 pt-4 pb-2 items-center w-full">
      <div className='bg-tertiary rounded'>
        {!hideLogo &&
          <Link href="/" passHref>
            <div className="text-primary text-opacity-80 text-2xl flex items-center flex-shrink-0  cursor-pointer med:pr-4 py-1 px-2 ">
              <TreeLogo width={80} height={80} />
              {width && width >= 420 && 'Plantantica  '}
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
            <div className='text-gray-100 text-opacity-80 transition-colors hover:bg-opacity-40 //hover:bg-gradient-to-tr //hover:from-green-50s flex items-center rounded-3xl justify-between cursor-pointer lg:mr-8 bg-primary shadow-md p-0.5'>
              {
                profPicUrl ?
                  <>
                    <Image
                      src={profPicUrl}
                      sizes="15vw"
                      alt='Profile'
                      width={80}
                      height={80}
                      className='rounded-full'
                    />
                    {/* &nbsp; */}
                    {/* <IoChevronDown /> */}
                  </>
                  :
                  <div className="flex items-center justify-between px-4 py-4 leading-none transition-colors hover:border-transparent ">
                    {dBUser.username ? `@${dBUser.username}` : user.email} 
                    {/* &nbsp;
                    <IoChevronForward /> */}
                  </div>
              }
            </div>
          </Link>
          :
          <Link href="/auth" passHref
            className="text-primary border-primary inline-block  px-4 py-2 leading-none border-2 font-semibold rounded transition-colors border-yello hover:border-transparent  hover:bg-stone-100 hover:bg-opacity-60 mt-4 lg:mt-0"
          >
            Login / Sign up
          </Link>
      }
    </nav >
  )
}

export default NavBar