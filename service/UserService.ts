import { User } from "firebase/auth";
import { collection, deleteDoc, doc, DocumentData, DocumentSnapshot, getDoc, getDocs, query, QueryDocumentSnapshot, setDoc, where } from "firebase/firestore"
import DBUser from "../domain/DBUser";
import Plant from "../domain/Plant";
import db from "../firebase/db"
import { getPlants, migratePlantData } from "./PlantService"
import { docToUser } from "./DBMappings";
import { getDownloadURL, ref } from "firebase/storage";
import storage from "../firebase/storage";

// Should delete after data is merged
export const getUserByEmailDeprecated = async (email: string) => {
    let docRef = doc(db, "users", email)
    let docSnap = await getDoc(docRef)
    // check if result exists or not using docSnap.exists()
    return docSnap
}

export const getUser = async (user: User) => {
    let uidRef = doc(db, "users", user.uid)
    let docSnap = await getDoc(uidRef)
    let emailDoc = user.email ? await getUserByEmailDeprecated(user.email) : { exists: () => false };
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

export const initializeUser = async (user: User, username?: string) => {
    let userDoc = doc(db, 'users', user.uid)
    let userData = {
        email: user.email,
        displayName: user.displayName,
        dailyEmails: true,
        username: username || ""
    }
    try {
        await setDoc(userDoc, userData, { merge: true })
        console.log('initialized user in DB for email ' + user.email)
    } catch (e) {
        console.error(e)
        return false
    }
    try {
        await migratePlantData(user)
        console.log('migrated plant data')
    } catch (e) {
        console.error(e)
    }
    return true
}

export const getUserByUsername = async (username: string) => {
    let usersRef = collection(db, 'users')
    let q = query(usersRef, where('username', '==', username.toLowerCase()))
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

export const getUserByUid = async (uid: string) => {
    let uidRef = doc(db, "users", uid)
    let docSnap = await getDoc(uidRef)
    // check if result exists or not using docSnap.exists()
    return docSnap
}

export const getUserByEmail = async (email: string) => {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', email))
    const result = await getDocs(q)
    if (result?.docs?.length > 0) {
        return result.docs.at(0);
    } else {
        return null;
    }
}

export const mapDocToUserForMigration = async (docSnap: QueryDocumentSnapshot<DocumentData>): Promise<DBUser> => {
    const data = docSnap.data()
    let uname = data.username
    let profPic = data.profilePicture
    let dname = data.displayName
    return {
        profilePicture: profPic ? profPic : '',
        email: docSnap.id,
        username: uname ? uname : '',
        displayName: dname ? dname : '',
    }
}

export const existsByUsername = async (uname: string): Promise<boolean> => {
    try {
        let usersRef = collection(db, 'users')
        let q = query(usersRef, where('username', '==', uname))
        let result = await getDocs(q)
        if (result && result.docs && result.docs.length > 0) {
            console.log('doc => ' + result.docs[0].id)
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.error(e)
        return false
    }
}

export const saveUsername = async (username: string, user: User): Promise<string> => {
    let uname = username.toLowerCase()
    if (await existsByUsername(uname)) {
        return 'username';
    }

    let userDoc = await getUser(user)
    if (!userDoc.exists()) {
        return 'uid';
    }

    let docRef = userDoc.ref
    const data = userDoc.data()
    console.log(`existing saved username: ${data.username}`)
    try {
        await setDoc(docRef,
            { username: uname },
            { merge: true })
        return 'ok'
    } catch (e) {
        console.error(e)
        return 'error'
    }

}

export const getUserDBRecord = async (uid: string) => {
    let userDoc: DocumentSnapshot = null;
    try {
        userDoc = await getDoc(doc(db, "users", uid))
    } catch (e) {
        console.log(e)
        return null
    }
    if (!userDoc || !userDoc.exists()) {
        return null;
    } 
    const user = docToUser(userDoc)
    if (user.profilePicture && !user.profPicUrl) {
        try {
            const url = getDownloadURL(ref(storage, `users/${user.profilePicture}`))
            user.profPicUrl = url
            setDoc(doc(db, `users/${uid}`),
                { profPicUrl: url },
                { merge: true })
                .then(() => console.log("Saved profPicUrl to DB"))
                .catch(console.error)
        } catch (e) {
            console.error(e)
            console.error("Failed to get downloadUrl for profile picture")
        }
    }
    return user
}

export const saveDisplayName = async (uid: string, displayName: string) => {
    let docRef = doc(db, 'users', uid)
    return setDoc(docRef, { displayName }, { merge: true })
        .catch(console.error)
}

export const getAllUsers = async () => {
    let usersRef = collection(db, 'users')
    let userDocs = await getDocs(usersRef)
    let results = userDocs.docs.map(docToUser)
    return results
}

export const subscribeToDailyEmails = async (uid: string): Promise<boolean> => {
    try {
        let userDoc = await getUserByUid(uid)
        await setDoc(userDoc.ref, { dailyEmails: true }, { merge: true })
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export const unsubscribeFromDailyEmails = async (uid: string): Promise<boolean> => {
    try {
        let userDoc = await getUserByUid(uid)
        await setDoc(userDoc.ref, { dailyEmails: false }, { merge: true })
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}

export const deleteUser = async (u: User) => {
    let userDoc = await getUserByUid(u.uid);
    deleteDoc(userDoc.ref)
        .then(() => u.delete())
        .catch(console.error);
    // TODO delete images in storage
}

export const getAllUserData = async (uid: string): Promise<DBUser> => {
    let user = await getUserDBRecord(uid);



    return null;
}

export const getFollowingList = async (uid: string): Promise<DBUser[]> => {
    const user = await getUserDBRecord(uid)

    if (!user.following || !user.following.length) {
        return []
    }

    console.log('following:')
    console.log(user.following)

    const results = await getDocs(
        query(
            collection(db, 'users'),
            where('__name__', 'in', user.following)
        )
    )

    return results.docs.map(docToUser);
}

export const deleteProfilePictureInDB = (uid: string) => {
    setDoc(
        doc(db, 'users', uid),
        { profilePicture: '', profPicurl: '' },
        { merge: true }
    )
}