import React, { useCallback, useEffect, useState } from 'react'
import Update from '../domain/Update'
import { getUpdatesForPlant } from '../service/PlantService'


const useUpdates = ({ uid, plantId }) => {
    const [updates, setUpdates] = useState<Update[]>([])

    const loadUpdates = useCallback(async () => {
        return await getUpdatesForPlant(uid, plantId)
    }, [plantId, uid])

    useEffect(() => {
        loadUpdates().then(setUpdates)
    }, [loadUpdates])

    return {
        updates
    }
}

export default useUpdates