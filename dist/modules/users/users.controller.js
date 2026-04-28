import { getAllUsers, deleteUser } from './users.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
export const list = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        return sendSuccess(res, users, 'Users fetched successfully');
    }
    catch (err) {
        next(err);
    }
};
export const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return sendError(res, 'User ID is required', 400);
        }
        await deleteUser(id);
        return sendSuccess(res, null, 'User deleted successfully');
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=users.controller.js.map