const { Sequelize } = require("sequelize");
const path = require("path");

const databaseUrl = process.env.DB_URL;

let sequelize;
if (databaseUrl && databaseUrl.trim().length > 0) {
	sequelize = new Sequelize(databaseUrl, {
		logging: false,
		dialect: "postgres",
	});
} else {
	const storagePath = path.join(__dirname, "../../civictrack.sqlite");
	sequelize = new Sequelize({
		dialect: "sqlite",
		storage: storagePath,
		logging: false,
	});
}

module.exports = { sequelize };
