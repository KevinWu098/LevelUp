import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "../api/routes/auth.route.js";
import userRoute from "../api/routes/user.route.js";
import gigRoute from "../api/routes/gig.route.js";
import orderRoute from "../api/routes/order.route.js";
import conversationRoute from "../api/routes/conversation.route.js";
import messageRoute from "../api/routes/message.route.js";
import reviewRoute from "../api/routes/review.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

dotenv.config();
const port = 8080 || process.env.PORT;
mongoose.set("strictQuery", false);

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB!");
    } catch (error) {
        handleError(error);
    }
};

app.use(
    cors({
        origin: "http://localhost:5173",
        credential: true,
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";

    return res.status(errorStatus).send(errorMessage);
});

app.listen(port, () => {
    connect();
    console.log(`Listening on port 8080`);
});
