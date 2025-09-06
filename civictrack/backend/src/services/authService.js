const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function registerUser({ name, email, phone, password, role = "citizen" }) {
	const existing = await User.findOne({ where: { email } });
	if (existing) {
		throw new Error("Email already registered");
	}
	const passwordHash = await bcrypt.hash(password, 10);
	const user = await User.create({ name, email, phone, passwordHash, role });
	return user;
}

async function authenticateUser({ email, password }) {
	const user = await User.findOne({ where: { email } });
	if (!user) throw new Error("Invalid credentials");
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) throw new Error("Invalid credentials");
	const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
	return { user, token };
}

module.exports = { registerUser, authenticateUser };
