import express from "express";
const router = express.Router();

import * as user from "../controllers/user_api.js";
import { isAuth, isAdmin } from "../controllers/auth_api.js";

// router.use(isAuth); // disable auth requirement for now

// vartotojų sąrašas
router.get("/", /* isAdmin, */ user.index);

// vartotojo įrašas pagal id
router.get("/:id", user.idParamValidator(), user.show);

// vartotojo įrašo pridėjimas
router.post("/", /* isAdmin, */ user.storeValidator(), user.store);

// vartotojo įrašo keitimas
router.put("/:id", user.updateValidator(), user.update);

// vartotojo rolės keitimas
router.patch("/:id/role", /* isAdmin, */ user.updateRoleValidator(), user.updateRole);

// vartotojo slaptažodžio keitimas
router.patch(
	"/:id/password",
	user.changePasswordValidator(),
	user.changePassword
);

// vartotojo būsenos keitimas
router.patch("/:id/status", /* isAdmin, */ user.updateStatusValidator(), user.updateStatus);

// vartotojo įrašo trynimas
router.delete("/:id", /* isAdmin, */ user.idParamValidator(), user.destroy);

export default router;
