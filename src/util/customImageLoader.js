const customImageLoader = ({src}) => {
    return src.replace('https://plantantica.web.app/_next/image?url=', '')
}
export default customImageLoader;