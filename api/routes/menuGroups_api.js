import express from "express";
const router = express.Router();

import * as menuGroups from "../controllers/menuGroup_api.js";
import { isAuth, isAdmin, isModerator } from "../controllers/auth_api.js";

// meniu grupių sąrašas
router.get("/", menuGroups.index);

// meniu grupės įrašas pagal id
router.get("/:id", /* isModerator, */ menuGroups.idParamValidator(), menuGroups.show);

// meniu grupės įrašo pridėjimas
router.post("/", /* isModerator, */ menuGroups.storeValidator(), menuGroups.store);

// meniu grupės įrašo keitimas
router.put("/:id", /* isModerator, */ menuGroups.updateValidator(), menuGroups.update);

// meniu grupės įrašo trynimas
router.delete("/:id", /* isModerator, */ menuGroups.idParamValidator(), menuGroups.destroy);

export default router;
