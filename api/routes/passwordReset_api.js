import express from "express";
const router = express.Router();

import {
  request,
  confirm,
  confirmValidator,
  requestValidator,
} from "../controllers/passwordReset_api.js";

router.post("/", requestValidator(), request);
router.post("/confirm", confirmValidator(), confirm);

export default router;
