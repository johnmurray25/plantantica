import Link from 'next/link'
import React from 'react'

function NavBar() {
  return (
    <nav className="flex items-center justify-between flex-wrap p-6">
        <div className="flex items-center flex-shrink-0 mr-6">
          <span className="font-semibold text-xl tracking-tight">Plantantica</span>
        </div>
        <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 border rounded border-yellow">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Profile</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
          </button>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 hover:text-lighterYellow mr-4">
              Docs
            </a>
            <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 hover:text-lighterYellow mr-4">
              Examples
            </a>
            <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0  hover:text-lighterYellow">
              Blog
            </a>
          </div>
          <div>
            <Link href="auth">
              <a className="inline-block text-sm px-4 py-2 leading-none border rounded border-yellow text-yellow border-yello hover:border-transparent hover:text-green hover:bg-yellow mt-4 lg:mt-0">
                Login / Sign up
              </a>
            </Link>
          </div>
        </div>
      </nav>
  )
}

export default NavBar