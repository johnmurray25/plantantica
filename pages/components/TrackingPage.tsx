import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import Plant from '../../domain/Plant'
import { deletePlant, feedPlantInDB, waterPlantInDB } from '../../service/PlantService';
import TextField from './TextField';
import TrackingCard from './TrackingCard';
import gridStyles from '../../styles/grid.module.css';

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

    const plantToCard = useCallback((p: Plant): JSX.Element => {
        return (
            <TrackingCard
                key={p.id}
                plant={p}
                userID={uid}
                updates={p.updates}
            />
        )
    }, [uid])

    const filterPlants = useCallback(() => {
        console.log('filterPlants')
        let filteredResults =
            (searchText ?
                plants.filter(plant => {
                    return plant.species.toLowerCase().includes(searchText.toLowerCase())
                })
                :
                { ...plants }
            ).sort((a, b) => {
                if (a.dateToWaterNext > b.dateToWaterNext) return 1
                else if (a.dateToWaterNext < b.dateToWaterNext) return -1
                return a.species < b.species ? -1 : 1
            })

        // map results to TrackingCard[]
        let filteredCards = filteredResults.map(plantToCard)
        setTrackingCards(filteredCards)
        filteredResults.map(p => p.species).forEach(console.log)
        // if (searchText) setFilterActive(true)
    }, [plantToCard, plants, searchText])
    // end filterPlants

    useEffect(() => {
        // on first render
        if (!trackingCards.length && plants && plants.length) {
            console.log('setting tracking cards')
            setTrackingCards(
                plants.sort((a, b) => {
                    if (a.dateToWaterNext > b.dateToWaterNext) return 1
                    else if (a.dateToWaterNext < b.dateToWaterNext) return -1
                    return a.species < b.species ? -1 : 1
                }).map(plantToCard))
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
                {trackingCards}
            </div>
        </div>
    )
}

export default TrackingPage