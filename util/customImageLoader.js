const customImageLoader = ({src, width, height}) => {
    return `${src}&w=${width||48}$height=${height||48}`
}
export default customImageLoader;