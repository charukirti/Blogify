import { account, ID, avatar } from "./appwrite";

export class AuthService {
    async createNewAccount(email, password, name) {
        try {
            const userAccount = await account.create(ID.unique(), email, password, name);
            if (userAccount) {
                const session = await this.login(email, password);
                const userData = await this.getCurrentUser();
                return { session, userData };
            }
        } catch (error) {
            console.error("Create account failed:", error);
            throw error;
        }
    }

    async login(email, password) {
        try {
            const session = await account.createEmailPasswordSession(email, password);
            const userData = await this.getCurrentUser();
            return { session, userData };
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }

    }

    async getCurrentUser() {
        try {
            const userData = await account.get();
            return userData;
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