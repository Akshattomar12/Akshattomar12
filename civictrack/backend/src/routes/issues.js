const express = require("express");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const { createIssue, listIssues, updateIssueStatus } = require("../services/issueService");
const { authMiddleware } = require("../utils/middleware");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/", async (req, res) => {
	const issues = await listIssues(req.query);
	res.json(issues);
});

router.post(
	"/",
	authMiddleware,
	upload.single("media"),
	body("title").notEmpty(),
	body("description").notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		try {
			const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;
			const issue = await createIssue({
				title: req.body.title,
				description: req.body.description,
				latitude: req.body.latitude ? parseFloat(req.body.latitude) : null,
				longitude: req.body.longitude ? parseFloat(req.body.longitude) : null,
				urgency: req.body.urgency || "medium",
				mediaUrl,
				reporterId: req.user.id,
			});
			req.app.get("io").emit("issue:new", issue);
			res.status(201).json(issue);
		} catch (e) {
			res.status(400).json({ error: e.message });
		}
	}
);

router.patch("/:id/status", authMiddleware, body("status").notEmpty(), async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	try {
		const updated = await updateIssueStatus(req.params.id, req.body.status, req.body.assignedToUserId);
		req.app.get("io").emit("issue:updated", updated);
		res.json(updated);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

module.exports = router;
