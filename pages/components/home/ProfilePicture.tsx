import Image from 'next/image'
import React from 'react'
import useProfilePicture from '../../../hooks/useProfilePicture'

const ProfilePicture = () => {

    const { profPicUrl } = useProfilePicture()

    return (
        <div className='transition-colors hover:bg-green-700 hover:bg-opacity-20 flex items-center rounded-full cursor-pointer border border-gray-400 bg-opacity-70 '>
            {
                profPicUrl &&
                    <div className='relative w-16 h-16 rounded-full'>
                        <Image
                            src={profPicUrl}
                            sizes="15vw"
                            alt='Profile'
                            fill
                            className='object-cover rounded-full'
                        />
                    </div>
            }
        </div>
    )
}

export default ProfilePicture