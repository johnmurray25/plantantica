const customImageLoader = ({src, width, height}) => {
    return `${src.replace('https://plantantica.web.app/_next/image?url=', '')}?w=${width}&h=${height}`
}
export default customImageLoader;