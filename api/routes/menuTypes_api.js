import express from "express";
const router = express.Router();

import * as menuTypes from "../controllers/menuType_api.js";
import { isAuth, isAdmin, isModerator } from "../controllers/auth_api.js";

router.use(isModerator);

// meniu tipų sąrašas
router.get("/", menuTypes.index);

// meniu tipo įrašas pagal id
router.get("/:id", menuTypes.idParamValidator(), menuTypes.show);

// meniu tipo įrašo pridėjimas
router.post("/", menuTypes.storeValidator(), menuTypes.store);

// meniu tipo įrašo keitimas
router.put("/:id", menuTypes.updateValidator(), menuTypes.update);

// meniu tipo įrašo trynimas
router.delete("/:id", menuTypes.idParamValidator(), menuTypes.destroy);

export default router;
