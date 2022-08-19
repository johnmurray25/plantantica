import React from 'react';
import Image from 'next/image'
import logo from '../../public/tree-logo-with-text.png';

const imageLoader = ({src}) => {
    return src;
}

const TreeLogo = () => {
    return (
        <div>
            <Image src={logo} alt="tree logo" loader={imageLoader} className='cursor-pointer'/>
        </div>
    )
}

export default TreeLogo;