import Joi from "joi";

const acceptInvitationSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required(),

    phone: Joi.string()
        .min(10)
        .max(20)
        .optional(),

    password: Joi.string()
        .min(6)
        .required()
});

export const validateAcceptInvitation = (req, res, next) => {

    const { error } = acceptInvitationSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
};