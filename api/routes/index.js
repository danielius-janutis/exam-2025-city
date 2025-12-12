import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/api/", function (req, res, next) {
	res.json({ title: "TVS API" });
});

// import authAPIRouter from "./auth_api.js";
// router.use("/api/", authAPIRouter);

// import passwordResetAPIRouter from "./passwordReset_api.js";
// router.use("/api/password-reset", passwordResetAPIRouter);

import roleAPIRouter from "./role_api.js";
router.use("/api/roles", roleAPIRouter);

import mockEventsRouter from "./events_mock.js";
router.use("/api/events", mockEventsRouter);

// import menuGroupsAPIRouter from "./menuGroups_api.js";
// router.use("/api/menugroups", menuGroupsAPIRouter);

// import menuTypesAPIRouter from "./menuTypes_api.js";
// router.use("/api/menutypes", menuTypesAPIRouter);

// import contentTypesAPIRouter from "./contentTypes_api.js";
// router.use("/api/contenttypes", contentTypesAPIRouter);

// import menuAPIRouter from "./menu_api.js";
// router.use("/api/menu", menuAPIRouter);

// import userAPIRouter from "./user_api.js";
// router.use("/api/users", userAPIRouter);

// import rolePrismaRouter from "./role_prisma.js";
// router.use("/api/roles", rolePrismaRouter);

export default router;
