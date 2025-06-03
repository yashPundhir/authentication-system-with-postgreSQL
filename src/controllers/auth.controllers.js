import bcrypt from "bcryptjs";

import crypto from "crypto";

import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
	const { name, email, password, phoneNum } = req.body;

	if (!name || !email || !password || !phoneNum) {
		console.log("data is missing");

		return res.status(400).json({
			success: false,
			message: "All fields are required",
		});
	}

	try {
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			console.log("user already exists");

			return res.status(400).json({
				success: false,
				message: "user already exists",
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		const verificationToken = crypto.randomBytes(32).toString("hex");

		const newUser = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				phoneNumber: phoneNum,
				verificationToken: verificationToken,
			},
		});

		// Send mail - TODO
	} catch (error) {
		return res.status(500).json({
			success: false,
			error,
			message: "Registration Failed",
		});
	}
};

export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			success: false,
			message: "All fields are required",
		});
	}

	try {
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (!existingUser) {
			return res.status(400).json({
				success: false,
				message: "invalid email or password",
			});
		}

		const isPasswordValid = await bcrypt.compare(
			password,
			existingUser.password
		);

		if (!isPasswordValid) {
			return res.status(400).json({
				success: false,
				message: "invalid email or password",
			});
		}

		const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRY_TIME,
		});

		const cookieOptions = {
			maxAge: 24 * 60 * 60 * 1000,
			httpOnly: true,
			secure: true,
		};

		res.cookie("token", token, cookieOptions);

		res.status(201).json({
			success: true,
			message: "user logged in successfully",
			token,
			user: {
				id: existingUser.id,
				name: existingUser.name,
				role: existingUser.role,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error,
			message: "Login Process Failed",
		});
	}
};
