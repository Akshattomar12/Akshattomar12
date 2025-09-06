const express = require("express");
const { Issue } = require("../models");
const { authMiddleware } = require("../utils/middleware");

const router = express.Router();

router.get("/summary", authMiddleware, async (req, res) => {
	const total = await Issue.count();
	const byStatus = Object.fromEntries(
		await Promise.all(["received", "in_progress", "resolved"].map(async (s) => [s, await Issue.count({ where: { status: s } })]))
	);
	res.json({ total, byStatus });
});

module.exports = router;
