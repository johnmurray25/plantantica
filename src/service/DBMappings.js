export const docToPlant = (doc) => {
    let data = doc.data();
    return {
        id: doc.id,
        species: data.species,
        dateObtained: new Date(data.dateObtained),
        daysBetweenWatering: data.daysBetweenWatering,
        dateLastWatered: new Date(data.dateLastWatered),
        dateToWaterNext: new Date(data.dateToWaterNext),
        dateLastFed: data.dateLastFed ? data.dateLastFed : null,
        dateToFeedNext: data.dateToFeedNext ? data.dateToFeedNext : null,
        lightRequired: data.lightRequired,
        dateCreated: new Date(data.dateCreated),
        picture: data.picture,
        careInstructions: data.careInstructions,
    }
}

export const docToUpdate = (doc) => {
    console.log(doc)
    const data = doc.data()
    console.log(data)
    return {
        image: data.image,
        title: data.title,
        description: data.description,
        dateCreated: new Date(data.dateCreated),
        id: doc.id,
    }
}

export const docToUser = (docSnap) => {
    const data = docSnap.data()
    return {
        profilePicture: data.profilePicture,
        email: data.email ? data.email : docSnap.id,
        username: data.username,
        displayName: data.displayName,
        dailyEmails: data.dailyEmails
    }
}