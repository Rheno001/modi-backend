import { validateRegister, validateLogin } from './auth.validation.js';
import { registerUser, loginUser, refreshAccessToken, logoutUser, getUserById } from './auth.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
export const register = async (req, res, next) => {
    try {
        const errors = validateRegister(req.body);
        if (errors.length > 0) {
            return sendError(res, errors[0], 400);
        }
        const user = await registerUser(req.body);
        return sendSuccess(res, user, 'Account created successfully', 201);
    }
    catch (err) {
        if (err.message === 'An account with this email already exists') {
            return sendError(res, err.message, 409);
        }
        next(err);
    }
};
export const login = async (req, res, next) => {
    try {
        const errors = validateLogin(req.body);
        if (errors.length > 0) {
            return sendError(res, errors[0], 400);
        }
        const { user, accessToken, refreshToken } = await loginUser(req.body);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return sendSuccess(res, { user, accessToken }, 'Login successful', 200);
    }
    catch (err) {
        if (err.message === 'Invalid email or password') {
            return sendError(res, err.message, 401);
        }
        next(err);
    }
};
export const refresh = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return sendError(res, 'No refresh token provided', 401);
        }
        const { accessToken } = await refreshAccessToken(token);
        return sendSuccess(res, { accessToken }, 'Token refreshed successfully', 200);
    }
    catch (err) {
        if (err.message === 'Invalid refresh token' ||
            err.message === 'Refresh token has expired, please login again' ||
            err.message === 'User no longer exists') {
            return sendError(res, err.message, 401);
        }
        next(err);
    }
};
export const logout = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        await logoutUser(token);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        return sendSuccess(res, null, 'Logged out successfully', 200);
    }
    catch (err) {
        next(err);
    }
};
export const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            return sendError(res, 'Not authenticated', 401);
        }
        const user = await getUserById(req.user.userId);
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        return sendSuccess(res, {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        }, 'Authenticated', 200);
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=auth.controller.js.map