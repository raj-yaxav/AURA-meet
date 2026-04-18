import {RegistrationSchema , LoginSchema} from "./Joischema.js"

export const validateSingUp = async(req,res,next) => {
        const {error} = RegistrationSchema.validate(req.body);
if(error){
    return res.status(400).json({
        "message" : error.details[0].message,
    })
}
next();
}

export const validateLogin = async(req,res,next) => {
            const {error} = LoginSchema.validate(req.body);
if(error){
    return res.status(400).json({
        "message" : error.details[0].message,
    })
}
next();
}
