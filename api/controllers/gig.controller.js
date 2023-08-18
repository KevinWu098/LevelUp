import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

export const createGig = async (req, res, next) => {
    if (!req.isSeller) {
        return next(createError(403, "Only sellers can create a gig!"));
    }

    const newGig = new Gig({
        userId: req.useId,
        ...req.body,
    });

    try {
        const savedGig = await newGig.save();

        res.status(201).json(savedGig);
    } catch (error) {
        next(error);
    }
};

export const deleteGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (gig.userId !== req.userId) {
            return next(createError(403, "You can only delete your own gig!"));
        }

        await Gig.findByIdAndDelete(req.params.id);

        res.status(200).send("Gig has been deleted!");
    } catch (error) {
        next(error);
    }
};

export const getGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            next(createError(404, "Gig not found!"));
        }

        res.status(200).send(gig);
    } catch (error) {
        next(err);
    }
};

export const getGigs = async (req, res, next) => {
    const query = req.query;

    const filters = {
        ...(query.userId && { userId: query.userId }),
        ...(query.cat && { cat: query.cat }),
        ...((query.min || query.max) && {
            price: {
                ...(query.min && { $gt: query.min }),
                ...(query.max && { $lt: query.max }),
            },
        }),
        ...(query.search && { title: { $regex: query.search, $options: "i" } }),
    };

    try {
        const gigs = await Gig.find(filters).sort({ [query.sort]: -1 });

        res.status(200).send(gigs);
    } catch (error) {
        next(error);
    }
};
