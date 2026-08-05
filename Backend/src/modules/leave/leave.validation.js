import Joi from "joi";

const applyLeaveSchema = Joi.object({

    leave_type_id: Joi.number()
        .integer()
        .positive()
        .required(),

    start_date: Joi.date()
        .iso()
        .required(),

    end_date: Joi.date()
        .iso()
        .min(Joi.ref("start_date"))
        .required(),

    duration_type: Joi.string()
        .valid("FULL_DAY", "HALF_DAY")
        .required(),

    reason: Joi.string()
        .trim()
        .min(3)
        .max(1000)
        .required()
});


export const validateApplyLeave = (req, res, next) => {

    const { error } = applyLeaveSchema.validate(
        req.body,
        {
            abortEarly: false
        }
    );

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: error.details.map(
                detail => detail.message
            )
        });
    }

    next();
};

const rejectLeaveSchema = Joi.object({

    rejection_reason: Joi.string()
        .trim()
        .min(3)
        .max(1000)
        .required()

});


export const validateRejectLeave = (req, res, next) => {

    const { error } = rejectLeaveSchema.validate(
        req.body,
        {
            abortEarly: false
        }
    );

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: error.details.map(
                detail => detail.message
            )
        });
    }

    next();
};