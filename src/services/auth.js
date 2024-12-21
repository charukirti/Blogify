import { account, ID, avatar } from "./appwrite";

export class AuthService {
    async createNewAccount(email, password, name) {
        try {
            const userAccount = await account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return await this.login(email, password);
            }
        } catch (error) {
            console.error("Create account failed:", error);
            throw error;
        }
    }

    async login(email, password) {
        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }

    }

    async getCurrentUser() {
        try {
            return await account.get();
        } catch (error) {
            console.error("Get user failed:", error);
            throw error;
        }
    }

    async logOut() {
        try {
            await account.deleteSessions();
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    }
}



const authservice = new AuthService();

export default authservice;