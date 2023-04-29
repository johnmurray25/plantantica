import Image from 'next/image'
import React, { useState } from 'react'

const ImageWithZoom: React.FC<{
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  width?: number;
  height?: number;
}> = (props) => {

  const { src, alt, sizes, className, width, height } = props;

  const [zoomed, setZoomed] = useState(false);

  if (!src) {
    return <></>
  }

  return <>
    {width && height ?
      <Image
        {...{ src }}
        {...{ alt }}
        {...{ width }}
        {...{ height }}
        loading="lazy"
        className={className ? `${className} cursor-pointer` : "object-cover cursor-pointer"}
        onClick={() => setZoomed(true)}
      />
      :
      <Image
        {...{ src }}
        {...{ alt }}
        {...{ sizes }}
        loading="lazy"
        fill
        className={className ? `${className} cursor-pointer` : "object-cover cursor-pointer"}
        onClick={() => setZoomed(true)}
      />
    }
    {zoomed &&
      <div
        className="w-screen h-screen fixed -top-0 -left-0 bg-gray-900 bg-opacity-75 z-50 transition-all"
        onClick={() => setZoomed(false)}
      >
        {/* <h1 className='bg-secondary bg-opacity-50 text-white px-12 py-20 w-full sm:w-fit '>Click/tap anywhere to exit</h1> */}
        <div className='w-3/5 h-3/5'>
          <Image
            {...{ src }}
            {...{ alt }}
            sizes="70vw"
            loading="lazy"
            fill
            className="object-contain cursor-pointer"
            onClick={() => setZoomed(true)}
          />
        </div>
      </div>
    }
  </>
}

export default ImageWithZoom