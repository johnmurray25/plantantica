import { User } from "firebase/auth";
import { collection, doc, DocumentData, getDoc, getDocs, query, QueryDocumentSnapshot, setDoc, where } from "firebase/firestore"
import Plant from "../../domain/Plant";
import db from "../firebase/db"
import { getPlants, migratePlantData } from "./PlantService"

export interface DBUser {
    plantTrackingDetails?: Plant[];
    profilePicture: string;
    email: string;
    username?: string;
    displayName?: string
}

// Should delete after data is merged
export const getUserByEmailDeprecated = async (email: string) => {
    let docRef = doc(db, "users", email)
    let docSnap = await getDoc(docRef)
    // check if result exists or not using docSnap.exists()
    return docSnap
}

export const getUserByUid = async (user: User) => {
    let uidRef = doc(db, "users", user.uid)
    let docSnap = await getDoc(uidRef)
    let emailDoc = await getUserByEmailDeprecated(user.email)
    // initialize/migrate user data
    if (!docSnap.exists()) {
        await initializeUser(user)
        if (emailDoc.exists()) {
            let data = await mapDocToUserForMigration(emailDoc)
            await setDoc(uidRef, data, { merge: true })
            console.log('migrated user data')
            // migrate plant data
            await migratePlantData(user)
        }
    }
    return getDoc(uidRef)
}

export const initializeUser = async (user: User) => {
    let userDoc = doc(db, 'users', user.uid)
    let userData = {
        email: user.email,
        displayName: user.displayName,
    }
    try {
        await setDoc(userDoc, userData, { merge: true })
        console.log('initialized user in DB for email ' + user.email)
        await migratePlantData(user)
        console.log('migrated plant data')
    } catch (e) {
        console.error(e)
        return false
    }
    return true
}

export const getUserByUsername = async (username: string) => {
    let usersRef = collection(db, 'users')
    let q = query(usersRef, where('username', '==', username))
    try {
        let result = await getDocs(q)
        if (result && result.docs && result.docs.length > 0) {
            return result.docs[0]
        }
    } catch (e) {
        console.error(e)
    }
    return null
}

export const getUserByUidString = async (uid: string) => {
    let uidRef = doc(db, "users", uid)
    let docSnap = await getDoc(uidRef)
    // check if result exists or not using docSnap.exists()
    return docSnap
}

export const mapDocToUser = async (docSnap: QueryDocumentSnapshot<DocumentData>): Promise<DBUser> => {
    let plants: Plant[] = null
    try {
        plants = await getPlants(docSnap.id)
    } catch (e) {
        console.error(e)
    }

    let email = docSnap.get('email')

    return {
        plantTrackingDetails: plants ? plants : [],
        profilePicture: docSnap.get('profilePicture'),
        email:  email ? email : docSnap.id,
        username: docSnap.get('username'),
        displayName: docSnap.get('displayName')
    }
}

export const mapDocToUserForMigration = async (docSnap: QueryDocumentSnapshot<DocumentData>): Promise<DBUser> => {
    let uname = docSnap.get('username')
    let profPic = docSnap.get('profilePicture')
    let dname = docSnap.get('displayName')
    return {
        profilePicture: profPic ? profPic : '',
        email: docSnap.id,
        username:  uname ? uname : '',
        displayName: dname ? dname : '',
    }
}

export const existsByUsername = async (uname: string): Promise<boolean> => {
    let usersRef = collection(db, 'users')
    let q = query(usersRef, where('username', '==', uname))
    try {
        let result = await getDocs(q)
        if (result && result.docs && result.docs.length > 0) {
            console.log('doc => ' + result.docs[0].id)
            return true;
        }
    } catch (e) {
        console.error(e)
        return false
    }
}

export const saveUsername = async (username: string, user: User): Promise<string> => {
    if (await existsByUsername(username)) {
        return 'username';
    }

    let userDoc = await getUserByUid(user)
    if (!userDoc.exists()) {
        return 'uid';
    }

    let docRef = userDoc.ref
    console.log(`existing saved username: ${userDoc.get('username')}`)
    try {
        await setDoc(docRef,
            { username },
            { merge: true })
        return 'ok'
    } catch (e) {
        console.error(e)
        return 'error'
    }

}

export const getUserDBRecord = async (uid: string) => {
    try {
        let result = await mapDocToUser(await getUserByUidString(uid))
        return result
    } catch (e) {
        console.log(e)
        return null
    }
}

export const saveDisplayName = async (uid: string, displayName: string) => {
    let docRef = doc(db, 'users', uid)
    return setDoc(docRef, { displayName }, { merge: true })
        .catch(console.error)
}
