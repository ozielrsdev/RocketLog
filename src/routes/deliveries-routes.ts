import { DeliveriesController } from "@/controllers/deliveries-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyAuthorization } from "@/middlewares/verify-authorization";
import { DeliveriesStatusController } from "@/controllers/deliveries-status-controller"; 
import { Router } from "express";

export const deliveriesRoutes = Router()
const deliveriesController = new DeliveriesController()
const deliveriesStatusController = new DeliveriesStatusController()

deliveriesRoutes.use(ensureAuthenticated, verifyAuthorization(["sale"]))

deliveriesRoutes.post("/", deliveriesController.create)
deliveriesRoutes.get("/", deliveriesController.index)
deliveriesRoutes.patch("/:id/status", deliveriesStatusController.update)