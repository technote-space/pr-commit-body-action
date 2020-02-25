"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const github_action_helper_1 = require("@technote-space/github-action-helper");
exports.TARGET_EVENTS = {
    'pull_request': [
        'opened',
        'reopened',
        'synchronize',
        'rerequested',
    ],
};
exports.START = '<!-- START pr-commits   please keep comment here to allow auto update -->';
exports.END = '<!-- END pr-commits   please keep comment here to allow auto update -->';
exports.MATCH_START = github_action_helper_1.Utils.getRegExp('<!-- START pr-commits ');
exports.MATCH_END = github_action_helper_1.Utils.getRegExp('<!-- END pr-commits ');
exports.LINK_ISSUE_KEYWORDS = [
    'closes',
    'close',
    'closed',
    'fix',
    'fixes',
    'fixed',
    'resolve',
    'resolves',
    'resolved',
];
// <type>(<scope>): <subject>
// @see https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716#semantic-commit-messages
exports.SEMANTIC_MESSAGE = /^(.+?)!?\s*(\(.+?\)\s*)?:\s*(.+?)$/;
