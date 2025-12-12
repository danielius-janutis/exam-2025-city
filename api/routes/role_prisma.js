import express from "express";
import {
	index,
	show,
	store,
	update,
	destroy,
	idParamValidator,
	storeValidator,
	updateValidator,
} from "../controllers/role_prisma.js";
import { isAdmin } from "../controllers/auth_api.js";

const router = express.Router();

// router.use(isAdmin); // admin gate disabled for now

router.get("/", index);
router.get("/:id", idParamValidator(), show);
router.post("/", storeValidator(), store);
router.put("/:id", updateValidator(), update);
router.delete("/:id", idParamValidator(), destroy);

export default router;
