const { DataTypes, Model } = require("sequelize");

class User extends Model {}

module.exports = (sequelize) => {
	User.init(
		{
			id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
			name: { type: DataTypes.STRING, allowNull: false },
			email: { type: DataTypes.STRING, unique: true, allowNull: false },
			phone: { type: DataTypes.STRING },
			passwordHash: { type: DataTypes.STRING, allowNull: false },
			role: { type: DataTypes.ENUM("citizen", "staff", "admin"), defaultValue: "citizen" },
		},
		{ sequelize, modelName: "User" }
	);
	return User;
};
