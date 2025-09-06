require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { sequelize } = require("./models");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
	cors: { origin: process.env.FRONTEND_ORIGIN || "*" },
});
app.set("io", io);

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/issues", require("./routes/issues"));
app.use("/api/analytics", require("./routes/analytics"));

async function start() {
	await sequelize.sync();
	const port = process.env.PORT || 4000;
	server.listen(port, () => console.log(`API listening on :${port}`));
}

start().catch((e) => {
	console.error(e);
	process.exit(1);
});
