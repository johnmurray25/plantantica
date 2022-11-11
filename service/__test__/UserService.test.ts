import { DBUser, getUserByUid, mapDocToUser, subscribeToDailyEmails, unsubscribeFromDailyEmails } from "../UserService";

describe("unsubscribeFromDailyEmails", () => {

    let user: DBUser;

    const getTestUser = async (): Promise<DBUser> => {
        user = {
            dailyEmails: null,
            profilePicture: 'tree-logo.png',
            email: 'test@test.test',
        }
        return user; 
    }

    beforeAll(getTestUser)

    test.skip("Should subscribe then unsubscribe from emails", async () => {
        await subscribeToDailyEmails("test");
        expect((await getTestUser()).dailyEmails).toEqual(true);

        await unsubscribeFromDailyEmails("test");
        expect((await getTestUser()).dailyEmails).toEqual(false);
    });
})
