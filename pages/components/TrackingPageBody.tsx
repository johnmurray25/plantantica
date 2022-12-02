import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import Plant from '../../domain/Plant'
import TextField from './TextField';
import TrackingCard from './TrackingCard';
import MiniTrackingCard from './MiniTrackingCard';
import gridStyles from '../../styles/grid.module.css';
import { IoList } from '@react-icons/all-files/io5/IoList';
import { IoGrid } from '@react-icons/all-files/io5/IoGrid';
import useWindowDimensions from '../../hooks/useWindowDimensions';
// import { AnimatePresence, motion } from "framer-motion";

const byDateToWaterNext = (a: Plant, b: Plant) => {
    if (a.dateToWaterNext > b.dateToWaterNext) {
        return 1
    }
    else if (a.dateToWaterNext < b.dateToWaterNext) {
        return -1
    }
    return a.species < b.species ? -1 : 1
}

interface Props {
    plants: Plant[];
    uid: string;
}

const TrackingPageBody: React.FC<Props> = (props) => {

    const { width } = useWindowDimensions()

    const uid = props.uid || "";
    const [plants, setPlants] = useState(props.plants)

    const [searchText, setSearchText] = useState('')
    const [trackingCards, setTrackingCards] = useState<JSX.Element[]>([])

    const [columns, setColumns] = useState(2);

    const plantToCard = useCallback((p: Plant, index: number): JSX.Element => {
        // console.log("i = " + index)
        if (columns === 1 || width > 650) {
            return (
                // <motion.div
                //     variants={{
                //         hidden: (i) => ({
                //             opacity: 0,
                //             y: -50 * i,
                //         }),
                //         visible: (i) => ({
                //             opacity: 1,
                //             y: 0,
                //             transition: {
                //                 delay: i * 0.025,
                //             }
                //         }),
                //         removed: {
                //             opacity: 0,
                //         },
                //     }}
                //     initial={
                //         plants?.length > 0 ? "visible" : "hidden"
                //     }
                //     animate="visible"
                //     exit="removed"
                //     custom={index}
                // >
                <TrackingCard
                    key={p.id}
                    plant={p}
                    userID={uid}
                    updates={p.updates}
                />
                // </motion.div>
            )
        } else {
            return (
                <MiniTrackingCard
                    key={p.id}
                    plant={p}
                    userID={uid}
                />
            )
        }
    }, [columns, uid, width])

    const filterPlants = useCallback(() => {
        let filteredResults =
            searchText ?
                plants.filter(p => p.species.toLowerCase().includes(searchText.toLowerCase()))
                :
                { ...plants }
                    .sort(byDateToWaterNext)
        setTrackingCards(filteredResults.map((p, i) => plantToCard(p, i)))
    }, [plantToCard, plants, searchText])
    // end filterPlants

    useEffect(() => {
        if (plants?.length) {
            setTrackingCards(
                plants.sort(byDateToWaterNext)
                    .map((p, i) => plantToCard(p, i)))
        }
    }, [plantToCard, plants])
    // end useEffect

    useEffect(() => {
        if (searchText) {
            filterPlants()
        } else {
            if (props.plants && plants &&
                props.plants.length > plants.length) {
                setPlants(props.plants)
            }
        }
    }, [filterPlants, plants, props.plants, searchText])

    return (
        <div >
            <div className={`flex px-2 items-center
                    ${width <= 650 ? 'justify-between' : 'justify-end'}`}
            >
                {width <= 650 &&
                    <div className="flex">
                        <button className={`border p-3 m-2 hover:bg-stone-700 hover:text-stone-200 border-stone-700 cursor-pointer
                                ${columns === 1 && 'bg-stone-700 text-stone-200'}`}
                            onClick={() => setColumns(1)}
                        >
                            <IoList />
                        </button>
                        <button className={`border p-3 m-2 hover:bg-stone-700 hover:text-stone-200 border-stone-700 cursor-pointer
                                ${columns > 1 && 'bg-stone-700 text-stone-200'}`}
                            onClick={() => setColumns(2)}
                        >
                            <IoGrid />
                        </button>
                    </div>
                }
                <div className="py-3 px-6 bg-[#145914]  hover:text-green hover:bg-stone-100"
                    style={{ borderRadius: '0 222px' }}>
                    <Link href="/AddPlantTrackingDetails" passHref className='cursor-pointer p-2 m-2 '>
                        Add a plant +
                    </Link>
                </div>
            </div>
            <div className="flex justify-between items-center pr-2 pl-2 pb-1 pt-6 text-stone-200">
                <p>
                    You are tracking {plants?.length} plants
                </p>
                <div className='flex justify-end'>
                    <TextField
                        name="search"
                        type="text"
                        value={searchText}
                        onChange={setSearchText}
                        placeholder="Search..."
                        width={24}
                    />
                </div>
            </div>
            {width <= 650 ?
                <div className={`grid grid-cols-${columns} gap-1`} style={{ width: '100vw' }}>
                    {trackingCards}
                </div>
                :
                <div className={gridStyles.container}>
                    {trackingCards}
                </div>
            }
        </div>
    )
}

export default TrackingPageBody