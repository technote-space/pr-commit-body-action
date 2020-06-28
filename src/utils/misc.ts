import {getInput} from '@actions/core';
import {Utils} from '@technote-space/github-action-helper';
import updateSection from 'update-section';
import {START, END, MATCH_START, MATCH_END, LINK_ISSUE_KEYWORDS} from '../constant';

const getRawInput                      = (name: string): string => process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
export const getCommitTypes            = (): Array<string> => Utils.getArrayInput('COMMIT_TYPES', true);
export const getTitle                  = (): string => getRawInput('TITLE');
export const getNoItems                = (): string => getRawInput('NO_ITEMS');
export const getTemplate               = (isEmpty: boolean): string => isEmpty ? getNoItems() : getInput('TEMPLATE', {required: true});
export const getBodyTemplate           = (isEmpty: boolean): string => {
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
export const getMergeTemplate          = (): string => getRawInput('CHANGE_TEMPLATE');
export const getCommitTemplate         = (): string => getRawInput('COMMIT_TEMPLATE');
export const getChildCommitTemplate    = (): string => getRawInput('CHILD_COMMIT_TEMPLATE');
export const getBreakingChangeTemplate = (): string => getRawInput('BREAKING_CHANGE_TEMPLATE');
export const getMaxCommitNumber        = (): number => /^\d+$/.test(getInput('MAX_COMMITS')) ? Number(getInput('MAX_COMMITS')) : 5; // eslint-disable-line no-magic-numbers
export const getExcludeMessages        = (): Array<string> => Utils.getArrayInput('EXCLUDE_MESSAGES').map(item => item.toLowerCase());
export const getBreakingChangeNotes    = (): Array<string> => Utils.getArrayInput('BREAKING_CHANGE_NOTES');
export const addCloseAnnotation        = (message: string, keyword: string): string => {
  if (!keyword) {
    return message;
  }

  return message.replace(new RegExp(`${LINK_ISSUE_KEYWORDS.map(item => `(?<!${Utils.escapeRegExp(item)}\\s)`).join('')}(#\\d+)`, 'g'), `${keyword} $&`);
};

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
export const isFilterPulls       = (): boolean => Utils.getBoolValue(getInput('FILTER_PR'));
