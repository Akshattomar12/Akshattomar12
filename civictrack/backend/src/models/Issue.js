const { DataTypes, Model } = require("sequelize");

class Issue extends Model {}

module.exports = (sequelize) => {
	Issue.init(
		{
			id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
			title: { type: DataTypes.STRING, allowNull: false },
			description: { type: DataTypes.TEXT, allowNull: false },
			status: { type: DataTypes.ENUM("received", "in_progress", "resolved"), defaultValue: "received" },
			latitude: { type: DataTypes.FLOAT, allowNull: true },
			longitude: { type: DataTypes.FLOAT, allowNull: true },
			mediaUrl: { type: DataTypes.STRING, allowNull: true },
			urgency: { type: DataTypes.ENUM("low", "medium", "high"), defaultValue: "medium" },
			category: { type: DataTypes.STRING, allowNull: true },
			assignedToUserId: { type: DataTypes.UUID, allowNull: true },
		},
		{ sequelize, modelName: "Issue" }
	);
	return Issue;
};
