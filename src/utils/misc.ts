import { getInput } from '@actions/core';
import { Utils } from '@technote-space/github-action-helper';
import updateSection from 'update-section';
import { START, END, MATCH_START, MATCH_END } from '../constant';

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
export const addCloseAnnotation = (message: string): string => message.replace(/(#\d+)/g, 'closes $1');

const matchesStart     = (line: string): boolean => MATCH_START.test(line);
const matchesEnd       = (line: string): boolean => MATCH_END.test(line);
export const transform = (content: string, template: string): string => {
	const info = updateSection.parse(content.split('\n'), matchesStart, matchesEnd);
	if (!info.hasStart) {
		return content;
	}

	return updateSection(content, `${START}\n${template}\n${END}`, matchesStart, matchesEnd);
};
