const { Types } = require("mongoose");
const { Toys } = require("../model/toys.model");
const Joi = require("joi");

const joiSchema = {
    createToy: Joi.object().keys({
        name: Joi.string().required(),
        info: Joi.string().required(),
        category: Joi.string().required(),
        img_url: Joi.string(),
        price: Joi.number().required(),
        date_created: Joi.date()
    }),
    update: Joi.object().keys({
        name: Joi.string(),
        info: Joi.string(),
        category: Joi.string(),
        img_url: Joi.string(),
        price: Joi.number(),
        date_created: Joi.date()
    })
}

exports.getAllToys = async (req, res, next) => {
    try {
        const perPage = 10;
        const page = req.query.page || 1;
        const skip = (page - 1) * perPage;
        const toys = await Toys.find({}).skip(skip).limit(perPage).populate('user_id');
        res.send(toys);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

exports.getSearch = async (req, res, next) => {
    try {
        const perPage = 10;
        const page = req.query.page || 1;
        const skip = (page - 1) * perPage;
        const { s } = req.query;
        if (s) {
            const toys = await Toys.find({ $or: [{ name: s }, { info: s }] })
                .skip(skip).limit(perPage).populate('user_id');
            res.send(toys)
        }
        else {
            const toys = await Toys.find()
                .skip(skip).limit(perPage).populate('user_id');
            res.send(toys)
        }
    }
    catch {
        console.log(error);
        res.sendStatus(400);
    }
}

exports.getByCategory = async (req, res, next) => {
    try {
        const category = req.params.catname;

        const perPage = 10;
        const page = req.query.page || 1;
        const skip = (page - 1) * perPage;
        const toys = await Toys.find({ category: category }).skip(skip).limit(perPage).populate('user_id');
        res.send(toys);
    }


    catch {
        console.log(error);
        res.sendStatus(400);
    }
}

exports.getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const perPage = 10;
        const page = req.query.page || 1;
        const skip = (page - 1) * perPage;
        const toys = await Toys.find({ _id: id }).skip(skip).limit(perPage).populate('user_id');
        res.send(toys);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

exports.createToys = async (req, res, next) => {
    const body = req.body;
    const userId = res.locals.user_id;
    try {
        const validate = joiSchema.createToy.validate(body);
        if (validate.error)
            throw Error(validate.error);
        const newToys = new Toys(body);
        newToys.user_id = new Types.ObjectId(userId);
        // newToys.id = newToys._id;
        await newToys.save();
        res.status(201).send(newToys);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};




exports.deleteToy = async (req, res, next) => {
    const { delId } = req.params;
    const userId = res.locals.user_id;
    try {
        let toy = await Toys.findOne({ _id: delId })
        if (String(toy.user_id) !== String(userId)) {
            throw new Error("you are not auther")
        }
        toy = await Toys.findByIdAndDelete(delId);
        res.send(toy);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

exports.updateToy = async (req, res, next) => {
    const { editId } = req.params;
    const update = req.body;
    const userId = res.locals.user_id;
    try {

        const validate = joiSchema.update.validate(update);
        if (validate.error)
            throw Error(validate.error);

        let toy = await Toys.findOne({ _id: editId });

        if (!toy) {
            console.log("miri");
            return res.status(404).send({ msg: "Toy not found" });
        }

        if (String(toy.user_id) !== String(userId))
            return res.status(404).send({ msg: "You cannot update this toy" });
        toy = await Toys.findByIdAndUpdate(editId, update, { new: true });
        res.send(toy);

    }
    catch (error) {
        next(error);
    }
};


