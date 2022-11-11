const customImageLoader = ({src, width, height}) => {
    return `${src}&w=${width}$height=${height}`
}
export default customImageLoader;