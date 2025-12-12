import db from "../db/mysql.js";

/**
 * Gauna visą grupiu sąrašą
 * @returns array|null
 */
export const selectAll = async () => {
	// paimame grupiu duomenis iš DB
	try {
		const [rows, fields] = await db.query("SELECT * FROM MenuGroup;");
		return rows;
	} catch (err) {
		console.log(err);
		return null;
	}
};

/**
 * Gauna grupe pagal pateiktą id
 * @param {*} id
 * @returns [object]|null
 */
export const selectById = async (id) => {
	try {
		const [rows, fields] = await db.query(
			"SELECT * FROM MenuGroup WHERE id = ?;",
			[id]
		);
		if (rows.length) {
			return rows;
		} else {
			return null;
		}
	} catch (err) {
		console.log(err);
		return null;
	}
};

/**
 * Įterpiama nauja grupe
 * @param {*} data {name, title}
 * @returns int|null įterpto elemento id
 */
export const insert = async (data) => {
	try {
		const [result] = await db.query(
			"INSERT INTO MenuGroup (name, title) VALUES (?, ?);",
			[data.name, data.title]
		);

		if (result.insertId) {
			return result.insertId;
		} else {
			return null;
		}
	} catch (err) {
		console.log(err);
		return null;
	}
};

/**
 * Keičia grupes duomenis
 * @param {*} id
 * @param {*} data {name, title}
 * @returns object|null
 */
export const update = async (id, data) => {
	try {
		const [result] = await db.query(
			"UPDATE MenuGroup SET name=?, title=? WHERE id=?;",
			[data.name, data.title, id]
		);

		return result;
	} catch (err) {
		console.log(err);
		return null;
	}
};

/**
 * Ištrina grupe
 * @param {*} id
 * @returns object|null
 */
export const destroy = async (id) => {
	try {
		const [result] = await db.query("DELETE FROM MenuGroup WHERE id=?;", [id]);
		return result;
	} catch (err) {
		console.log(err);
		return null;
	}
};
