import React from 'react'
import { IoHome } from '@react-icons/all-files/io5/IoHome'
import { IoHomeOutline } from '@react-icons/all-files/io5/IoHomeOutline'
import { IoLeaf } from '@react-icons/all-files/io5/IoLeaf'
import { IoLeafOutline } from '@react-icons/all-files/io5/IoLeafOutline'
import { IoPerson } from '@react-icons/all-files/io5/IoPerson'
import { IoPersonOutline } from '@react-icons/all-files/io5/IoPersonOutline'
// import { IoSearchOutline } from '@react-icons/all-files/io5/IoSearchOutline'
import Link from 'next/link'
import useWindowDimensions from '../../../hooks/useWindowDimensions'
import { useRouter } from 'next/router'
// const ProfilePicture = React.lazy(() => import('./ProfilePicture'));

const MobileBottomNavBar = () => {

    const { width } = useWindowDimensions()
    // const { profPicUrl } = useProfilePicture()
    const router = useRouter()
    const path = router.pathname;
    console.log(path)

    return width <= 650 && (
        <nav id='mobile_bottom_nav_bar'
            className={`fixed bottom-0 w-screen bg-primary //bg-[#31392c] dark:bg-[#151B11] text-gray-100 text-opacity-90 z-50`}
        >
            <div className={`flex justify-around items-center text-2xl py-6 `}>
                <Link href="/" passHref>
                    {path === "/" ?
                        <IoHome />
                        :
                        <IoHomeOutline />
                    }
                </Link>
                <Link href="/Tracking" passHref>
                    {path === "/Tracking" ?
                        <IoLeaf />
                        :
                        <IoLeafOutline />
                    }
                </Link>
                {/* <Link href="/social" passHref>
                    <IoSearchOutline />
                </Link> */}
                <Link href="/profile" passHref>
                    {path === "/profile" ?
                        <IoPerson />
                        :
                        <IoPersonOutline />
                    }
                    {/* <Suspense fallback={<IoPersonOutline />}>
                        <ProfilePicture />
                    </Suspense> */}
                </Link>
            </div>
        </nav>
    )
}

export default MobileBottomNavBar