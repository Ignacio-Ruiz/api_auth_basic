import { Router } from 'express';
import UserService from '../services/UserService.js';
import NumberMiddleware from '../middlewares/number.middleware.js';
import UserMiddleware from '../middlewares/user.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

// Create user route
router.post('/create', AuthMiddleware.validateToken, async (req, res) => {
    const response = await UserService.createUser(req);
    res.status(response.code).json(response.message);
});

// Ruta Get all users
router.get('/getAllUsers', AuthMiddleware.validateToken, async (req, res) => {
    const response = await UserService.getAllActiveUsers();
    res.status(response.code).json(response.message);
});

// Ruta Find users with filters 
router.get('/findUsers', [UserMiddleware.validateDateQueryParams, UserMiddleware.validateDeletedQueryParam, AuthMiddleware.validateToken], async (req, res) => {
    const response = await UserService.findUsers(req);
    res.status(response.code).json(response.message);
});

// Ruta bulkCreate users
router.post('/bulkCreate', AuthMiddleware.validateToken, async (req, res) => {
    const response = await UserService.bulkCreateUsers(req.body.Users);
    res.status(response.code).json(response.message);
});

// Ruta Get user by ID
router.get(
    '/:id',
    [
        NumberMiddleware.isNumber,
        UserMiddleware.isValidUserById,
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions
    ],
    async (req, res) => {
        const response = await UserService.getUserById(req.params.id);
        res.status(response.code).json(response.message);
    }
);

// Ruta Update user 
router.put(
    '/:id',
    [
        NumberMiddleware.isNumber,
        UserMiddleware.isValidUserById,
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions,
    ],
    async (req, res) => {
        const response = await UserService.updateUser(req);
        res.status(response.code).json(response.message);
    }
);

// Ruta Delete user
router.delete(
    '/:id',
    [
        NumberMiddleware.isNumber,
        UserMiddleware.isValidUserById,
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions,
    ],
    async (req, res) => {
        const response = await UserService.deleteUser(req.params.id);
        res.status(response.code).json(response.message);
    }
);

export default router;