import type { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { authConfig } from "@/configs/auth";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

export class SessionsController {
	async create(request: Request, response: Response) {
		const bodySchema = z.object({
			email: z.string().email(),
			password: z.string().min(6),
		});

		const { email, password } = bodySchema.parse(request.body);

		const user = await prisma.user.findFirst({ where: { email } });
		if (!user) {
			throw new AppError("Invalid email or password", 401);
		}

		const passwordMatched = await compare(password, user.password);

		if (!passwordMatched) {
			throw new AppError("Invalid email or password", 401);
		}

		const { secret, expiresIn } = authConfig.jwt;

		
		const token = sign({role: user.role ?? "customer"}, secret,{
			expiresIn,
			subject: user.id,
		});
		
		const {password:hashedPassword, ...userWithoutPassord} = user

		response.json({token, user: userWithoutPassord});
	}
}
