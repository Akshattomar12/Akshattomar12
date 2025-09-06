const { Issue, Department } = require("../models");

function pickDepartmentByRules(text) {
	if (!text) return null;
	const map = [
		{ dep: "Public Works", keys: ["pothole", "road", "street", "asphalt"] },
		{ dep: "Sanitation", keys: ["garbage", "trash", "waste", "collection"] },
		{ dep: "Lighting", keys: ["light", "streetlight", "lamp"] },
		{ dep: "Water", keys: ["leak", "water", "sewage"] },
	];
	const lower = text.toLowerCase();
	for (const rule of map) {
		if (rule.keys.some((k) => lower.includes(k))) return rule.dep;
	}
	return null;
}

async function ensureSeedDepartments() {
	const names = ["Public Works", "Sanitation", "Lighting", "Water", "Parks"];
	for (const name of names) {
		await Department.findOrCreate({ where: { name } });
	}
}

async function createIssue({ title, description, latitude, longitude, mediaUrl, urgency, reporterId }) {
	await ensureSeedDepartments();
	const categoryGuess = pickDepartmentByRules(`${title} ${description}`);
	const issue = await Issue.create({
		title,
		description,
		latitude,
		longitude,
		mediaUrl,
		urgency,
		category: categoryGuess || null,
		reportedByUserId: reporterId,
	});
	return issue;
}

async function listIssues(filter = {}) {
	const where = {};
	if (filter.status) where.status = filter.status;
	if (filter.category) where.category = filter.category;
	const issues = await Issue.findAll({ where, order: [["createdAt", "DESC"]] });
	return issues;
}

async function updateIssueStatus(issueId, status, assignedToUserId) {
	const issue = await Issue.findByPk(issueId);
	if (!issue) throw new Error("Issue not found");
	issue.status = status || issue.status;
	if (assignedToUserId !== undefined) issue.assignedToUserId = assignedToUserId;
	await issue.save();
	return issue;
}

module.exports = { createIssue, listIssues, updateIssueStatus };
