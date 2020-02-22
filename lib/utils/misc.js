"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_action_helper_1 = require("@technote-space/github-action-helper");
const update_section_1 = __importDefault(require("update-section"));
const constant_1 = require("../constant");
exports.getCommitTypes = () => github_action_helper_1.Utils.getArrayInput('COMMIT_TYPES', true);
exports.getTitle = () => core_1.getInput('TITLE');
exports.getNoItems = () => core_1.getInput('NO_ITEMS');
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
exports.getMergeTemplate = () => core_1.getInput('CHANGE_TEMPLATE', { required: true });
exports.getCommitTemplate = () => core_1.getInput('COMMIT_TEMPLATE', { required: true });
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
exports.parseCommitMessage = (message, types, exclude) => {
    const target = message.trim().replace(/\r?\n|\r/g, ' ');
    const matches = target.match(constant_1.SEMANTIC_MESSAGE);
    if (!matches || !types.includes(matches[1]) || exclude.includes(matches[3].toLowerCase())) {
        return {};
    }
    return {
        type: matches[1],
        message: matches[3],
        raw: message,
    };
};
exports.isFilterPulls = () => github_action_helper_1.Utils.getBoolValue(core_1.getInput('FILTER_PR'));
