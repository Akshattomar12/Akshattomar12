const express = require("express");
const { body, validationResult } = require("express-validator");
const { registerUser, authenticateUser } = require("../services/authService");

const router = express.Router();

router.post(
	"/register",
	body("name").notEmpty(),
	body("email").isEmail(),
	body("password").isLength({ min: 6 }),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		try {
			const user = await registerUser(req.body);
			res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
		} catch (e) {
			res.status(400).json({ error: e.message });
		}
	}
);

router.post("/login", body("email").isEmail(), body("password").notEmpty(), async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	try {
		const { user, token } = await authenticateUser(req.body);
		res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
	} catch (e) {
		res.status(401).json({ error: e.message });
	}
});

module.exports = router;
