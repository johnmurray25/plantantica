import Link from 'next/link'
import React, { FC, useState } from 'react'
import firebase from '../../firebase/clientApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import DropDown from './DropDownMenu';

interface NavProps {
  hideUser?: boolean;
}

const NavBar: FC<NavProps> = (props) => {

  const [user, loading, error] = useAuthState(firebase.auth());
  const hideUser = props.hideUser ? true : false;

  return (
    <nav className="flex items-center justify-between flex-wrap px-8 py-5">
      <Link href="/" passHref>
        <div className="flex items-center flex-shrink-0 mr-6 cursor-pointer">
          <span className="font-semibold text-xl tracking-tight">Plantantica</span>
        </div>
      </Link>
      { !hideUser &&
        (
          (!loading && user) ?
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
      }
    </nav>
  )
}

export default NavBar