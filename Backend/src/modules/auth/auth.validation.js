
import Joi from 'joi';

const registerSchema = Joi.object({
    company_name: Joi.string().required(),
    admin_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(6).required()
});

export const validateRegisterCompany = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
};


const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

                

export const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);       

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
};

