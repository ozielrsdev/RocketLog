import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

export class DeliveriesLogs {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      delivery_id: z.string().uuid(),
      description: z.string(),
    });

    const { delivery_id, description } = bodySchema.parse(request.body);

    const delivery = await prisma.delivery.findUnique({
      where: {
        id: delivery_id,
      },
    });

    if (!delivery) {
      throw new AppError("Delivery not found!");
    }

    if (delivery.status === "delivered") {
      throw new AppError("This order has already been delivered")
    }

    if (delivery.status === "processing") {
      throw new AppError("Chage delivery status to shipped first!");
    }

    await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery_id,
        description,
      },
    });

    return response.status(201).json({ message: "Log criado com sucesso!" });
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      delivery_id: z.string().uuid(),
    });

    const { delivery_id } = paramsSchema.parse(request.params);

    const delivery = await prisma.delivery.findUnique({
      where: {
        id: delivery_id,
      },
      include: {
        logs: true,

      }
    });

    if (request.user?.role === "customer" && request.user.id !== delivery?.userId) {
      throw new AppError("The user can only view their deliveries!", 401)
    }

    return response.json({ delivery })
  }
}
