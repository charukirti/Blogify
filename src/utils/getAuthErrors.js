import { AuthService } from "../services/auth";

export const getErrorMessage = (error) => {
    if (!error.code) return 'an unexpected error occurred';

    switch (error.code) {
        case AuthService.ERROR_CODES.LOGIN_FAILED:
            return 'Invalid email or password';

        case AuthService.ERROR_CODES.ACCOUNT_CREATE_FAILED:
            if (error.message.includes('already exists')) {
                return 'This email is already used';
            }
            return 'Failed to create account, please try again';

        case AuthService.ERROR_CODES.USER_NOT_FOUND:
            return 'User account not found';

        case AuthService.ERROR_CODES.SESSION_ERROR:
            return 'Session error, Please try again later';

        case AuthService.ERROR_CODES.LOGOUT_ERROR:
            return 'Failed to log out. Please try again';

        default:
            return 'An unexpected error occourred';

    }
};
