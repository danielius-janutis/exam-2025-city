import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

// In-memory mock store for events (non-persistent)
const events = [];

const eventValidator = [
	body("title").trim().notEmpty(),
	body("date").trim().notEmpty(),
	body("time").trim().notEmpty(),
	body("city").trim().notEmpty(),
	body("location").trim().notEmpty(),
	body("category").trim().notEmpty(),
	body("summary").trim().notEmpty(),
];

router.get("/", (req, res) => {
	res.json({ events, count: events.length });
});

router.post("/", eventValidator, (req, res) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ message: "Validation error", errors: result.array() });
	}

	const newEvent = {
		id: events.length ? events[events.length - 1].id + 1 : 1,
		...req.body,
		createdAt: new Date().toISOString(),
	};
	events.push(newEvent);
	res.status(201).json({ status: "success", event: newEvent });
});

export default router;
