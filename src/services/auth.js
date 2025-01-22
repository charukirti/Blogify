import { account, ID, avatar } from "./appwrite";

class AuthError extends Error {
    constructor(code, message) {
        super(message);
        this.name = 'AuthError';
        this.code = code;
    }
}

export class AuthService {

    static ERROR_CODES = {
        ACCOUNT_CREATE_FAILED: 'auth/account-create-failed',
        LOGIN_FAILED: 'auth/login-failed',
        USER_NOT_FOUND: 'auth/user-not-found',
        SESSION_ERROR: 'auth/session-error',
        LOGOUT_ERROR: 'auth/logout-failed'
    };

    async createNewAccount(email, password, name) {
        try {
            if (!email || !password || !name) {
                throw new AuthError(AuthService.ERROR_CODES.ACCOUNT_CREATE_FAILED, 'Email, password, and name are required');
            }
            const userAccount = await account.create(ID.unique(), email, password, name);
            if (userAccount) {
                const session = await this.login(email, password);
                const userData = await this.getCurrentUser();
                return { session, userData };
            }
        } catch (error) {
            console.error("Create account failed:", error);
            throw new AuthError(AuthService.ERROR_CODES.ACCOUNT_CREATE_FAILED, 'Account with this email id already exists');
        }
    }

    async login(email, password) {
        try {
            if (!email || !password) {
                throw new AuthError(AuthService.ERROR_CODES.LOGIN_FAILED, 'Email and password required');
            }

            const session = await account.createEmailPasswordSession(email, password);

            if (!session.$id) {
                throw new AuthError(AuthService.ERROR_CODES.SESSION_ERROR, 'Session creation failed');
            }

            const userData = await this.getCurrentUser();

            return { session, userData };
        } catch (error) {
            console.error("Login failed:", error);
            if (error?.response?.code === 401) {
                throw new AuthError(AuthService.ERROR_CODES.LOGIN_FAILED, 'Invalid email or password');
            }
            throw new AuthError(AuthService.ERROR_CODES.LOGIN_FAILED, 'Invalid email and password');
        }

    }

    async createOAuthSession(provider) {
        try {
            if (!provider) {
                throw new AuthError(AuthService.ERROR_CODES.LOGIN_FAILED, 'Provider is required');
            }

            account.createOAuth2Session(
                provider,
                `${window.location.origin}/auth/callback`,
                `${window.location.origin}/auth/failure`,
                ['email', 'profile']
            );

        } catch (error) {
            console.log('OAuth login failed', error);
            throw new AuthError(AuthService.ERROR_CODES.LOGIN_FAILED, `${provider} authenticaion failed`);
        }
    }

    async logInWithGoogle() {
        try {
            return await this.createOAuthSession('google');

        } catch (error) {
            throw new AuthError(AuthService.ERROR_CODES.LOGIN_FAILED, 'Failed log in');
        }
    }

    async getCurrentUser() {
        try {
            const userData = await account.get();

            if (!userData) {
                throw new AuthError(AuthService.ERROR_CODES.USER_NOT_FOUND, 'User not found');
            }

            return userData;
        } catch (error) {


            console.error("Get user failed:", error);

            throw new AuthError(AuthService.ERROR_CODES.USER_NOT_FOUND, 'Failed to get user data');
        }
    }

    async logOut() {
        try {
            await account.deleteSessions();
        } catch (error) {
            console.error("Logout failed:", error);
            throw new AuthError(AuthService.ERROR_CODES.LOGOUT_ERROR, 'Failed to log out user');
        }
    }
}



const authservice = new AuthService();

export default authservice;