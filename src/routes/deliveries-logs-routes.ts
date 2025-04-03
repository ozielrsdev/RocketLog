import { DeliveriesLogs } from "@/controllers/deliveries-logs-controller";
import { Router } from "express";
import { verifyAuthorization } from "@/middlewares/verify-authorization";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

export const deliveriesLogsRoutes = Router();
const deliveriesLogs = new DeliveriesLogs();

deliveriesLogsRoutes.post(
	"/",
	ensureAuthenticated,
	verifyAuthorization(["sale"]),
	deliveriesLogs.create,
);
deliveriesLogsRoutes.get(
	"/:delivery_id/show",
	ensureAuthenticated,
	verifyAuthorization(["sale", "customer"]),
	deliveriesLogs.show
);
