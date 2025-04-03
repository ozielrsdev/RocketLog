import { AppError } from "@/utils/AppError";
import type { Request, Response, NextFunction } from "express";

export function verifyAuthorization(role: string[]) {
	return (request: Request, response: Response, next: NextFunction) => {
		if (!request.user) {
			throw new AppError("Unauthorized", 401);
		}
		if (!role.includes(request.user.role)) {
			throw new AppError("Unauthorized", 401);
		}
		return next();
	};
}
