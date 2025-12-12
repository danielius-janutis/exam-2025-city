import express from "express";
const router = express.Router();

import * as informacija from "../controllers/informacija_api.js";

// informacijos sąrašas
router.get("/", informacija.index);

// informacijos įrašas pagal id
router.get("/:id", informacija.idParamValidator(), informacija.show);

// informacijos įrašo pridėjimas
router.post("/", informacija.storeValidator(), informacija.store);

// informacijos įrašo keitimas
router.put("/:id", informacija.updateValidator(), informacija.update);

// informacijos įrašo trynimas
router.delete("/:id", informacija.idParamValidator(), informacija.destroy);

export default router;
