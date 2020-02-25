"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_action_helper_1 = require("@technote-space/github-action-helper");
const update_section_1 = __importDefault(require("update-section"));
const constant_1 = require("../constant");
const getRawInput = (name) => process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
exports.getCommitTypes = () => github_action_helper_1.Utils.getArrayInput('COMMIT_TYPES', true);
exports.getTitle = () => getRawInput('TITLE');
exports.getNoItems = () => getRawInput('NO_ITEMS');
exports.getTemplate = (isEmpty) => isEmpty ? exports.getNoItems() : core_1.getInput('TEMPLATE', { required: true });
exports.getBodyTemplate = (isEmpty) => {
    const template = exports.getTemplate(isEmpty);
    if ('' === template) {
        return '';
    }
    const title = exports.getTitle();
    if (title) {
        return `${title}\n\n${template}`;
    }
    return template;
};
exports.getMergeTemplate = () => getRawInput('CHANGE_TEMPLATE');
exports.getCommitTemplate = () => getRawInput('COMMIT_TEMPLATE');
exports.getChildCommitTemplate = () => getRawInput('CHILD_COMMIT_TEMPLATE');
exports.getMaxCommitNumber = () => /^\d+$/.test(core_1.getInput('MAX_COMMITS')) ? Number(core_1.getInput('MAX_COMMITS')) : 5; // eslint-disable-line no-magic-numbers
exports.getExcludeMessages = () => github_action_helper_1.Utils.getArrayInput('EXCLUDE_MESSAGES').map(item => item.toLowerCase());
exports.replaceVariables = (string, variables) => variables.reduce((acc, variable) => github_action_helper_1.Utils.replaceAll(acc, `\${${variable.key}}`, variable.value), string);
exports.addCloseAnnotation = (message, keyword) => keyword ? message.replace(/(#\d+)/g, keyword + ' $1') : message;
const matchesStart = (line) => constant_1.MATCH_START.test(line);
const matchesEnd = (line) => constant_1.MATCH_END.test(line);
exports.transform = (content, template) => {
    const info = update_section_1.default.parse(content.split('\n'), matchesStart, matchesEnd);
    if (!info.hasStart) {
        return content;
    }
    return update_section_1.default(content, `${constant_1.START}\n${template}\n${constant_1.END}`, matchesStart, matchesEnd);
};
exports.getLinkIssueKeyword = () => {
    const keyword = core_1.getInput('LINK_ISSUE_KEYWORD');
    if (constant_1.LINK_ISSUE_KEYWORDS.includes(keyword)) {
        return keyword;
    }
    return '';
};
exports.isFilterPulls = () => github_action_helper_1.Utils.getBoolValue(core_1.getInput('FILTER_PR'));
