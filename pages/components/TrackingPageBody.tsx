import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import Plant from '../../domain/Plant'
import TextField from './TextField';
import TrackingCard from './TrackingCard';
import gridStyles from '../../styles/grid.module.css';
import { AnimatePresence, motion } from "framer-motion";

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

const TrackingPage: React.FC<Props> = (props) => {
    console.log('rendering TrackingPage')
    console.log(props.plants)

    const uid = props.uid || "";
    const [plants, setPlants] = useState(props.plants)

    const [searchText, setSearchText] = useState('')
    // const [filterActive, setFilterActive] = useState(false)
    const [trackingCards, setTrackingCards] = useState<JSX.Element[]>([])

    const plantToCard = useCallback((p: Plant, index: number): JSX.Element => {
        // console.log("i = " + index)
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
    }, [uid])

    const filterPlants = useCallback(() => {
        let filteredResults =
            searchText ?
                plants.filter(p => p.species.toLowerCase().includes(searchText.toLowerCase()))
                :
                { ...plants }
                    .sort(byDateToWaterNext)
        // map results to TrackingCard[]
        setTrackingCards(filteredResults.map((p, i) => plantToCard(p, i)))
    }, [plantToCard, plants, searchText])
    // end filterPlants

    useEffect(() => {
        // on first render
        if (!trackingCards.length && plants && plants.length) {
            console.log('setting tracking cards')
            setTrackingCards(
                plants.sort(byDateToWaterNext)
                    .map((p, i) => plantToCard(p, i)))
        }
    }, [plantToCard, plants, trackingCards])
    // end useEffect

    useEffect(() => {
        console.log('filterPlants useEffect')
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
        <div className="relative">
            <div
                className="absolute top-0 right-2 pb-3 pt-3 px-4 bg-[#145914] w-fit hover:text-green hover:bg-yellow"
                style={{
                    borderRadius: '0 222px'
                }}
            >
                <Link href="/AddPlantTrackingDetails" passHref className='cursor-pointer p-2 m-2'>
                    Add a plant +
                </Link>
            </div>
            <div className="flex justify-between items-center pr-2 pl-2 pb-1 pt-16">
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
            <div className={gridStyles.container}>
                {/* <AnimatePresence> */}
                    {trackingCards}
                {/* </AnimatePresence> */}
            </div>
        </div>
    )
}

export default TrackingPage