const customImageLoader = ({src, width, height}) => {
    return `${src}&w=${width||250}$height=${height||250}`
}
export default customImageLoader;