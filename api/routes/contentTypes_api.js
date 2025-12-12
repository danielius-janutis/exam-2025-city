import express from "express";
const router = express.Router();

import * as contentTypes from "../controllers/contentType_api.js";
import { isAuth, isAdmin, isModerator } from "../controllers/auth_api.js";

// router.use(isModerator); // admin/moderator gate disabled

// turinio tipų sąrašas
router.get("/", contentTypes.index);

// turinio tipo įrašas pagal id
router.get("/:id", contentTypes.idParamValidator(), contentTypes.show);

// turinio tipo įrašo pridėjimas
router.post("/", contentTypes.storeValidator(), contentTypes.store);

// turinio tipo įrašo keitimas
router.put("/:id", contentTypes.updateValidator(), contentTypes.update);

// turinio tipo įrašo trynimas
router.delete("/:id", contentTypes.idParamValidator(), contentTypes.destroy);

export default router;
