const { sequelize } = require("../config/db");
const buildUser = require("./User");
const buildDepartment = require("./Department");
const buildIssue = require("./Issue");

const User = buildUser(sequelize);
const Department = buildDepartment(sequelize);
const Issue = buildIssue(sequelize);

// Associations
User.hasMany(Issue, { foreignKey: "reportedByUserId", as: "reportedIssues" });
Issue.belongsTo(User, { foreignKey: "reportedByUserId", as: "reporter" });

User.hasMany(Issue, { foreignKey: "assignedToUserId", as: "assignedIssues" });
Issue.belongsTo(User, { foreignKey: "assignedToUserId", as: "assignee" });

module.exports = { sequelize, User, Department, Issue };
