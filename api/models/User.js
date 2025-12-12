export const selectAll = async () => {
	// paimame vartotojų duomenis iš DB
	try {
		const [rows, fields] = await db.query("SELECT * FROM User;");
		return rows;
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const selectAllWithRole = async () => {
	// paimame vartotojų duomenis iš DB su rolėmis
	try {
		const [rows, fields] = await db.query(
			"SELECT User.*, Role.name AS roleName, Role.title AS roleTitle FROM User JOIN Role ON User.roleId = Role.id;"
		);
		return rows;
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const selectById = async (id) => {
	try {
		const [rows, fields] = await db.query("SELECT * FROM User WHERE id = ?;", [
			id,
		]);
		if (rows.length) {
			return rows[0];
		} else {
			return null;
		}
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const selectByIdWithRole = async (id) => {
	try {
		const [rows, fields] = await db.query(
			"SELECT User.*, Role.name AS roleName, Role.title AS roleTitle FROM User JOIN Role ON User.roleId = Role.id WHERE User.id = ?;",
			[id]
		);
		if (rows.length) {
			return rows[0];
		} else {
			return null;
		}
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const selectByEmail = async (email) => {
	try {
		const [rows, fields] = await db.query(
			"SELECT * FROM User WHERE email = ?;",
			[email]
		);
		if (rows.length) {
			return rows[0];
		} else {
			return null;
		}
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const selectByEmailWithRole = async (email) => {
	try {
		const [rows, fields] = await db.query(
			"SELECT User.*, Role.name AS roleName, Role.title AS roleTitle FROM User JOIN Role ON User.roleId = Role.id WHERE User.email = ?;",
			[email]
		);
		if (rows.length) {
			return rows[0];
		} else {
			return null;
		}
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const selectByUserName = async (userName) => {
	try {
		const [rows, fields] = await db.query(
			"SELECT * FROM User WHERE userName = ?;",
			[userName]
		);
		if (rows.length) {
			return rows[0];
		} else {
			return null;
		}
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const insert = async (data) => {
	try {
		const [result] = await db.query(
			"INSERT INTO User (userName, email, password, roleId) VALUES (?, ?, ?, ?);",
			[data.userName, data.email, data.password, data.roleId]
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

export const update = async (id, data) => {
	try {
		const [result] = await db.query(
			"UPDATE User SET userName=?, email=?, password=?, WHERE id=?;",
			[data.userName, data.email, data.password, id]
		);
		return result;
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const updatePassword = async (id, hashedPassword) => {
	try {
		const [result] = await db.query("UPDATE User SET password=? WHERE id=?;", [
			hashedPassword,
			id,
		]);
		return result;
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const updateRole = async (id, roleId) => {
	try {
		const [result] = await db.query("UPDATE User SET roleId=? WHERE id=?;", [
			roleId,
			id,
		]);
		return result;
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const updateStatus = async (id, status) => {
	try {
		const [result] = await db.query("UPDATE User SET status=? WHERE id=?;", [
			status,
			id,
		]);
		return result;
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const destroy = async (id) => {
	try {
		const [result] = await db.query("DELETE FROM User WHERE id=?;", [id]);
		return result;
	} catch (err) {
		console.log(err);
		return null;
	}
};
