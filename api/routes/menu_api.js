import express from "express";
const router = express.Router();

import * as menus from "../controllers/menu_api.js";
import { isAuth, isAdmin, isModerator } from "../controllers/auth_api.js";

// meniu grupių sąrašas
router.get("/", menus.index);

// meniu grupių sąrašas su meniu punktais
router.get("/all", menus.allMenuWithGroupAndType);

// meniu punkto eiliškumo keitimas
router.put("/order", /* isModerator, */ menus.changeMenuItemOrderValidator(), menus.changeMenuItemOrder);

// meniu grupės įrašas pagal id
router.get("/:id", /* isModerator, */ menus.idParamValidator(), menus.show);

// meniu grupės įrašo pridėjimas
router.post("/", /* isModerator, */ menus.storeValidator(), menus.store);

// meniu grupės įrašo keitimas
router.put("/:id", /* isModerator, */ menus.updateValidator(), menus.update);

// meniu grupės įrašo trynimas
router.delete("/:id", /* isModerator, */ menus.idParamValidator(), menus.destroy);

export default router;
