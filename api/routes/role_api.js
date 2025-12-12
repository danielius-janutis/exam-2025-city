import express from "express";
const router = express.Router();

import * as role from "../controllers/role_api.js";
import { isAuth, isAdmin } from "../controllers/auth_api.js";

// router.use(isAdmin); // admin gate disabled for now

// rolės sąrašas
router.get("/", role.index);

// rolės įrašas pagal id
router.get("/:id", role.idParamValidator(), role.show);

// rolės įrašo pridėjimas
router.post("/", role.storeValidator(), role.store);

// rolės įrašo keitimas
router.put("/:id", role.updateValidator(), role.update);

// rolės įrašo trynimas
router.delete("/:id", role.idParamValidator(), role.destroy);

export default router;
