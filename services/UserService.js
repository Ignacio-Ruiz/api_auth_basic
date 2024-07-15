import db from '../dist/db/models/index.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

const createUser = async (req) => {
    const {
        name,
        email,
        password,
        password_second,
        cellphone
    } = req.body;
    if (password !== password_second) {
        return {
            code: 400,
            message: 'Passwords do not match'
        };
    }
    const user = await db.User.findOne({
        where: {
            email: email
        }
    });
    if (user) {
        return {
            code: 400,
            message: 'User already exists'
        };
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.create({
        name,
        email,
        password: encryptedPassword,
        cellphone,
        status: true
    });
    return {
        code: 200,
        message: 'User created successfully with ID: ' + newUser.id,
    }
};

const getUserById = async (id) => {
    return {
        code: 200,
        message: await db.User.findOne({
            where: {
                id: id,
                status: true,
            }
        })
    };
}

const updateUser = async (req) => {
    const user = await db.User.findOne({
        where: {
            id: req.params.id,
            status: true,
        }
    });
    const payload = {};
    payload.name = req.body.name ?? user.name;
    payload.password = req.body.password ? await bcrypt.hash(req.body.password, 10) : user.password;
    payload.cellphone = req.body.cellphone ?? user.cellphone;
    await db.User.update(payload, {
        where: {
            id: req.params.id
        }
    });
    return {
        code: 200,
        message: 'User updated successfully'
    };
}

const deleteUser = async (id) => {
    await db.User.update({
        status: false
    }, {
        where: {
            id: id
        }
    });
    return {
        code: 200,
        message: 'User deleted successfully'
    };
}

//Método getAllUsers
const getAllActiveUsers = async () => {
    const users = await db.User.findAll({
        where: {
            status: true
        }
    });
    return {
        code: 200,
        message: users
    };
}

//Método finUsers
const findUsers = async (req) => {
    const {
        name,
        deleted,
        loginBefore,
        loginAfter
    } = req.query; 

    // Construir el objeto de condiciones dinámicamente
    const userConditions = {
        ...(name && { name: { [Op.like]: `%${name}%` } }),
        ...(deleted !== undefined && { status: deleted === 'true' ? false : true })
    };

    // Obtener todos los usuarios que cumplan con las condiciones básicas
    const users = await db.User.findAll({
        where: userConditions
    });

    // Si no se proporcionan fechas, retornar todos los usuarios obtenidos
    if (!loginBefore && !loginAfter) {
        return {
            code: 200,
            message: users
        };
    }

    // Filtrar usuarios según sus sesiones en un rango de fechas
    const filteredUsers = await Promise.all(users.map(async (user) => {
        const sessionConditions = {
            id_user: user.id,
            ...(loginBefore && { createdAt: { [Op.lte]: new Date(loginBefore) } }),
            ...(loginAfter && { createdAt: { [Op.gte]: new Date(loginAfter) } })
        };

        // Ajustar la condición de fecha para manejar ambos parámetros de fecha
        if (loginBefore && loginAfter) {
            sessionConditions.createdAt = {
                [Op.between]: [new Date(loginAfter), new Date(loginBefore)]
            };
        }

        const sessions = await db.Session.findAll({
            where: sessionConditions
        });

        return sessions.length > 0 ? user : null;
    }));

    const validUsers = filteredUsers.filter(user => user !== null);

    return {
        code: 200,
        message: validUsers
    };
};

//Función validar usuario
const validateUser = (user) => {
    const { name, password, email, cellphone } = user;
    if (!name || !password || !email || !cellphone) {
        return false;
    }
    return true;
};

//Método bulkcreate
const bulkCreateUsers = async (users) => {
    let successCount = 0;
    let failureCount = 0;

    for (const user of users) {
        if (validateUser(user)) {
            try {
                const userExist = await db.User.findOne({
                    where: {
                        email: user.email
                    }
                });
                if (userExist) {
                    failureCount++;
                    continue; 
                }
            
                const encryptedPassword = await bcrypt.hash(user.password, 10);
                const newUser = await db.User.create({
                    name: user.name,
                    email: user.email,
                    password: encryptedPassword,
                    cellphone: user.cellphone,
                    status: true
                });
                if(newUser){
                    successCount++;
                }
            } catch (error) {
                console.error('Error creating user:', error);
                failureCount++;
            }
        } else {
            console.log("Validation error for user:", user);
            failureCount++;
        }
    }

    return {
        code: 200,
        message: {
            successCount,
            failureCount
        }
    };
};


export default {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getAllActiveUsers,
    findUsers,
    bulkCreateUsers
}