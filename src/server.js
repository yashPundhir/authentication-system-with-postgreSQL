import express from "express";

import dotenv from "dotenv";

import cors from "cors";

import cookieParser from "cookie-parser";

// custom routes
import authRouter from "./routes/auth.routes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(
	cors({
		origin: [
			"http://localhost:5173",
			`http://localhost:${port}`,
			`${process.env.BASE_URL}:${port}`,
		],
		credentials: true,
		methods: ["GET", "POST", "DELETE", "OPTIONS"], // methods mentioned here are not case sensitive
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use(express.json());

app.use(
	express.urlencoded({
		extended: true,
	})
);

app.use(cookieParser());

app.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: "test route checked",
	});
});

app.use("/api/v1/users", authRouter);

app.listen(port, () => {
	console.log(`Backend is listening at port: ${port}`);
});
