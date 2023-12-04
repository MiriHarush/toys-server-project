const bcrypt = require("bcryptjs");
const Joi = require("joi");
const { User } = require("../model/user.model");
const { generateToken } = require("../utils/jwt");


const userJoiSchema = {
    createUser: Joi.object().keys({
        name: Joi.string().required(),
        password: Joi.string().max(20).required(),
        email:Joi.string().email({ tlds: { allow: ['com'] } }).error(() => Error('Email is not valid')).required(),
        date_created: Joi.date(),
        role:Joi.string().valid('User','Admin')
    }),
    login: Joi.object().keys({
        password: Joi.string(),
        email: Joi.string().email({ tlds: { allow: ['com'] } }).error(() => Error('Email is not valid')),
    })
}


exports.createUser = async (req, res, next) => {
    const body = req.body;
    try {
        const validate = userJoiSchema.createUser.validate(body);
        if (validate.error)
            throw Error(validate.error);

        if (await checkIfUserExsist(body.email)) {
            throw new Error("This email alredy in this system")
        }

        const hash = await bcrypt.hash(body.password, 10);
        body.password = hash;
        const newUser = new User(body);
        newUser.id = newUser._id;
        await newUser.save()
        return res.status(201).send(newUser);
    }
    catch (err) {
        next(err);
    }
}

const checkIfUserExsist = async (email) => {
    const user = await User.findOne({ email })
    if (user)
        return true;
    return false;
}


exports.login = async (req, res, next) => {
    try {
        const body = req.body;
        const validate = userJoiSchema.login.validate(body);
        if (validate.error)
            throw Error(validate.error);
        if (!await checkIfUserExsist(body.email))
            throw new Error("This email is't in the system");
        const user = await User.findOne({ email: body.email })
        if (!await bcrypt.compare(body.password, user.password))
            throw new Error("password is incorrect");

        // res.status(200).send(user)
        const token = generateToken(user);
        return res.send({ user, token })
    }
    catch (err) {
        next(err);
    }
}

