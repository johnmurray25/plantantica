import React, { FC } from 'react'
import Link from 'next/link'

import { useAuthState } from 'react-firebase-hooks/auth'
import ReactLoading from 'react-loading'

import auth from '../../firebase/auth'
import Image from 'next/image'
import logo from '../../public/tree-logo.png'
import useWindowDimensions from '../../hooks/useWindowDimensions'

interface NavProps {
  hideUser?: boolean;
}

const NavBar: FC<NavProps> = (props) => {

  const [user, loading, error] = useAuthState(auth);
  const hideUser = props.hideUser ? true : false;
  const { width } = useWindowDimensions();

  return (
    <nav className={"flex justify-between flex-wrap py-5 items-center " + (width > 650 ? "px-4 " : "px-1")}>
      <Link href="/" passHref>
        <div className="flex items-center flex-shrink-0  cursor-pointer">
          <Image src={logo} alt='Tree logo' width={55} height={55}/>
          <span className="font-semibold text-xl tracking-tight pl-3">Plantantica</span>
        </div>
      </Link>
      {!hideUser &&
        (
          loading ?
            <div className='flex w-full pr-16 justify-end absolute'>
              <ReactLoading type='cylon' color="#fff" />
            </div>
            :
            (
              user ?
                <Link href="profile" passHref>
                  <a className="inline-block text-sm px-4 py-2 leading-none border rounded border-yellow text-yellow hover:border-transparent hover:text-green hover:bg-yellow mt-4 lg:mt-0">
                    {user.email}
                  </a>
                </Link>
                :
                <Link href="/auth" passHref>
                  <a className="inline-block text-sm px-4 py-2 leading-none border rounded border-yellow text-yellow border-yello hover:border-transparent hover:text-green hover:bg-yellow mt-4 lg:mt-0">
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