"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINK_ISSUE_KEYWORDS = exports.MATCH_END = exports.MATCH_START = exports.END = exports.START = exports.TARGET_EVENTS = void 0;
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
