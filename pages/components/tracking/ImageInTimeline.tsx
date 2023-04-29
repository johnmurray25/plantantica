import Image from 'next/image'
import ImageWithZoom from '../util/ImageWithZoom';

interface Props {
    src: string;
    species: string;
    width: number;
    height: number;
}

const ImageInTimeline = (props: Props) => {

    // const [zoomImage, setZoomImage] = useState(false);
    // const toggleZoomImage = () => { setZoomImage(!zoomImage) }

    return (
        <div
            className=' flex justify-center items-center m-auto  '
        >
            {/* zoomed in image: */}
            {/* {zoomImage ?
                <div className="rounded-3xl m-auto p-2 w-full  cursor-pointer bg-stone-900"
                    onClick={toggleZoomImage}
                >
                    <button className='absolute top-16 z-50 right-12 text-stone-100 rounded-full bg-red-800 px-3 py-1'>
                        x
                    </button>
                    <Image
                        src={props.src}
                        width={400} height={300}
                        alt={props.species}
                        className='cursor-pointer object-cover object-center rounded-3xl '
                    />
                </div>
                : */}
            {props.src &&
                <ImageWithZoom
                    src={props.src}
                    alt={`photo of ${props.species}`}
                    width={350}
                    height={400}
                    // sizes="350px"
                    className='rounded-3xl object-cover object-center mb-4 h-64'
                />
            }
        </div>
    )
}

export default ImageInTimeline