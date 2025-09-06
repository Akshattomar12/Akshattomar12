const { DataTypes, Model } = require("sequelize");

class Department extends Model {}

module.exports = (sequelize) => {
	Department.init(
		{
			id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
			name: { type: DataTypes.STRING, allowNull: false, unique: true },
			keywords: { type: DataTypes.TEXT, allowNull: true }, // comma-separated
		},
		{ sequelize, modelName: "Department" }
	);
	return Department;
};
