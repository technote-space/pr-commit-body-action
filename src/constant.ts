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
