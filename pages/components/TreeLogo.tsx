import Image from 'next/image';
import React from 'react'
import logo from '../../public/vector/default-monochrome.svg';

const customImageLoader = ({src, width, height}) => {
    let dimensions = `${width} x ${height}`
    return src;
}

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
            loader={customImageLoader}
            {...{width}}
            {...{height}}
        />
    )
}

export default TreeLogo