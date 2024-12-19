import { account, ID, avatar } from "./appwrite";

async function createAccount({ email, password, name }) {
    try {
        const userAccount = await account.create(ID.unique(), email, password, name);

        if (userAccount) return await signIn({ email, password });
        else return userAccount;
    } catch (error) {
        console.error("Appwrite service :: createAccount error:", error);
        throw error;
    }
}

async function signIn({ email, password }) {
    try {
        const userAccount = await account.createEmailPasswordSession(email, password);
        return userAccount;
    } catch (error) {
        console.error("Appwrite service :: loginUser error:", error);
        throw error;
    }
}

async function getCurrentUser() {
    try {
        const userAccount = await account.get();
        return userAccount;
    } catch (error) {
        console.error("Appwrite service :: getCurrentUser error:", error);
        throw error;
    }
}

const getAvatarInitials = (name = "") => {
    try {
       const response = avatar.getInitials(name);
       return response.href;
    } catch (error) {
       console.log("Appwrite service :: getAvatarInitials :: error", error);
       throw error;
    }
 };

async function signOut() {
    try {
        const userAccount = await account.deleteSession();
        return userAccount;
    } catch (error) {
        console.error("Appwrite service :: logOutUser error:", error);
        throw error;
    }
}

export { createAccount, signIn, getCurrentUser, signOut, getAvatarInitials };