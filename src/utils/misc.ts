import { getInput } from '@actions/core';
import { Utils } from '@technote-space/github-action-helper';
import updateSection from 'update-section';
import { START, END, MATCH_START, MATCH_END, LINK_ISSUE_KEYWORDS, SEMANTIC_MESSAGE } from '../constant';

export const getCommitTypes     = (): Array<string> => Utils.getArrayInput('COMMIT_TYPES', true);
export const getTitle           = (): string => getInput('TITLE');
export const getNoItems         = (): string => getInput('NO_ITEMS');
export const getTemplate        = (isEmpty: boolean): string => isEmpty ? getNoItems() : getInput('TEMPLATE', {required: true});
export const getBodyTemplate    = (isEmpty: boolean): string => {
	const template = getTemplate(isEmpty);
	if ('' === template) {
		return '';
	}

	const title = getTitle();
	if (title) {
		return `${title}\n\n${template}`;
	}
	return template;
};
export const getMergeTemplate   = (): string => getInput('CHANGE_TEMPLATE', {required: true});
export const getCommitTemplate  = (): string => getInput('COMMIT_TEMPLATE', {required: true});
export const getMaxCommitNumber = (): number => /^\d+$/.test(getInput('MAX_COMMITS')) ? Number(getInput('MAX_COMMITS')) : 5; // eslint-disable-line no-magic-numbers
export const getExcludeMessages = (): Array<string> => Utils.getArrayInput('EXCLUDE_MESSAGES').map(item => item.toLowerCase());
export const replaceVariables   = (string: string, variables: Array<{ key: string; value: string }>): string => variables.reduce((acc, variable) => Utils.replaceAll(acc, `\${${variable.key}}`, variable.value), string);
export const addCloseAnnotation = (message: string, keyword: string): string => keyword ? message.replace(/(#\d+)/g, keyword + ' $1') : message;

const matchesStart               = (line: string): boolean => MATCH_START.test(line);
const matchesEnd                 = (line: string): boolean => MATCH_END.test(line);
export const transform           = (content: string, template: string): string => {
	const info = updateSection.parse(content.split('\n'), matchesStart, matchesEnd);
	if (!info.hasStart) {
		return content;
	}

	return updateSection(content, `${START}\n${template}\n${END}`, matchesStart, matchesEnd);
};
export const getLinkIssueKeyword = (): string => {
	const keyword = getInput('LINK_ISSUE_KEYWORD');
	if (LINK_ISSUE_KEYWORDS.includes(keyword)) {
		return keyword;
	}

	return '';
};
export const parseCommitMessage  = (message: string, types: Array<string>, exclude: Array<string>): { type?: string; message?: string; raw?: string } => {
	const target  = message.trim().replace(/\r?\n|\r/g, ' ');
	const matches = target.match(SEMANTIC_MESSAGE);
	if (!matches || !types.includes(matches[1]) || exclude.includes(matches[3].toLowerCase())) {
		return {};
	}

	return {
		type: matches[1],
		message: matches[3],
		raw: message,
	};
};
export const isFilterPulls       = (): boolean => Utils.getBoolValue(getInput('FILTER_PR'));
