import Image from 'next/image';
import React from 'react'
import logo from '../../public/vector/Tree-only.svg';

interface Props {
    width?: number;
    height?: number;
}

const TreeLogo = (props: Props) => {
    const width = props.width || 200;
    const height = props.height || 60;

    return (
        <Image
            src={logo}
            alt='Plantantica'
            {...{ width }}
            {...{ height }}
            className="text-green-100"
        />
    )
}

export default TreeLogo