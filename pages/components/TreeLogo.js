import React from 'react';
import Image from 'next/image'
import logo from '../../public/tree-logo-with-text.png';

const TreeLogo = () => {
    return (
        <div>
            <Image src={logo} alt="tree logo"/>
        </div>
    )
}

export default TreeLogo;