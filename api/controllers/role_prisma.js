import { body, param, validationResult } from "express-validator";
import prisma from "../db/client.js";

const handleValidation = (req, res) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		res
			.status(400)
			.json({ message: "Validation error", errors: result.array() });
		return false;
	}
	return true;
};

export const idParamValidator = () => param("id").toInt().isInt();

export const index = async (req, res) => {
	const roles = await prisma.role.findMany();
	res.json(roles);
};

export const show = async (req, res) => {
	if (!handleValidation(req, res)) return;
	const { id } = req.params;
	const role = await prisma.role.findUnique({ where: { id: Number(id) } });
	if (!role) return res.status(404).json({ error: "Role not found" });
	res.json(role);
};

export const storeValidator = () => [
	body("name").trim().notEmpty(),
	body("title").trim().notEmpty(),
];

export const store = async (req, res) => {
	if (!handleValidation(req, res)) return;
	const { name, title } = req.body;
	const created = await prisma.role.create({ data: { name, title } });
	res.json({
		status: "success",
		message: "Role created",
		id: created.id,
	});
};

export const updateValidator = () => [
	param("id").toInt().isInt(),
	body("name").trim().optional().notEmpty(),
	body("title").trim().optional().notEmpty(),
];

export const update = async (req, res) => {
	if (!handleValidation(req, res)) return;
	const id = Number(req.params.id);
	const exists = await prisma.role.findUnique({ where: { id } });
	if (!exists) return res.status(404).json({ error: "Role not found" });

	const data = {};
	if (req.body.name !== undefined) data.name = req.body.name;
	if (req.body.title !== undefined) data.title = req.body.title;

	await prisma.role.update({ where: { id }, data });
	res.json({ status: "success", message: "Role updated" });
};

export const destroy = async (req, res) => {
	if (!handleValidation(req, res)) return;
	const id = Number(req.params.id);
	const exists = await prisma.role.findUnique({ where: { id } });
	if (!exists) return res.status(404).json({ error: "Role not found" });

	await prisma.role.delete({ where: { id } });
	res.json({ status: "success", message: "Role deleted" });
};
