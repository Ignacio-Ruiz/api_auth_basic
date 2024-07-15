import db from '../dist/db/models/index.js';

const isValidUserById = async (req, res, next) => {
    const id = req.params.id;
    const response = db.User.findOne({
        where: {
            id: id,
            status: true,
        }
    });
    if (!response) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    next();
};

const hasPermissions = async (req, res, next) => {
    const token = req.headers.token;
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
    if(!payload.roles.includes('admin')){
        if(payload.id !== +req.params.id){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
    }
    next();
}

const validateDeletedQueryParam = (req, res, next) => {
    const { deleted } = req.query;

    if (deleted !== undefined && deleted !== 'true' && deleted !== 'false') {
        return res.status(400).json({
            code: 400,
            message: "Parámetro de consulta 'deleted' no válido. Debe ser 'true' o 'false'."
        });
    }

    next();
};

const validateDateQueryParams = (req, res, next) => {
    const { loginBefore, loginAfter } = req.query;
    const dateFormatRegex = /^(\d{4})(-)(0?[1-9]|1[0-2])\2(3[01]|[12][0-9]|0?[1-9])$/; // Formato YYYY-MM-DD expresines regulares

    // Validar loginBefore si está presente
    if (loginBefore && !dateFormatRegex.test(loginBefore)) {
        return res.status(400).json({
            code: 400,
            message: `El parámetro de consulta 'loginBefore' no es válido. Debe tener el formato 'AAAA-MM-DD'.`
        });
    }

    // Validar loginAfter si está presente
    if (loginAfter && !dateFormatRegex.test(loginAfter)) {
        return res.status(400).json({
            code: 400,
            message: `Parámetro de consulta 'loginAfter' no válido. Debe tener el formato 'AAAA-MM-DD'.`
        });
    }

    next();
};

export default {
    isValidUserById,
    hasPermissions,
    validateDeletedQueryParam,
    validateDateQueryParams,
};