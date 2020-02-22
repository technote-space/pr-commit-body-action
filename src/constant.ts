import { Utils } from '@technote-space/github-action-helper';

export const TARGET_EVENTS       = {
	'pull_request': [
		'opened',
		'reopened',
		'synchronize',
		'rerequested',
	],
};
export const START               = '<!-- START pr-commits   please keep comment here to allow auto update -->';
export const END                 = '<!-- END pr-commits   please keep comment here to allow auto update -->';
export const MATCH_START         = Utils.getRegExp('<!-- START pr-commits ');
export const MATCH_END           = Utils.getRegExp('<!-- END pr-commits ');
export const LINK_ISSUE_KEYWORDS = [
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
export const SEMANTIC_MESSAGE = /^(.+?)\s*(\(.+?\)\s*)?:\s*(.+?)$/;
