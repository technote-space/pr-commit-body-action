/* eslint-disable no-magic-numbers */
import { testEnv } from '@technote-space/github-action-test-helper';
import { resolve } from 'path';
import { replaceVariables, transform } from '../../src/utils/misc';
import { getCommitTypes, getBodyTemplate, getMergeTemplate, getCommitTemplate, getMaxCommitNumber } from '../../src/utils/misc';

const rootDir = resolve(__dirname, '../..');

describe('replaceVariables', () => {
	it('should replace variables', () => {
		expect(replaceVariables('', [])).toBe('');
		expect(replaceVariables('replace test: ${ABC}', [])).toBe('replace test: ${ABC}');
		expect(replaceVariables('replace test: ${ABC}', [
			{key: 'ABC', value: 'replaced'},
		])).toBe('replace test: replaced');
		expect(replaceVariables('replace test: ${ABC}\nmultiple: ${ABC}\nanother: ${XYZ}', [
			{key: 'ABC', value: 'replaced1'},
			{key: 'XYZ', value: 'replaced2'},
			{key: 'TEST', value: 'replaced3'},
		])).toBe('replace test: replaced1\nmultiple: replaced1\nanother: replaced2');
	});
});

describe('transform', () => {
	it('should transform content', () => {
		expect(transform('', '')).toBe('');
		expect(transform('<!-- START pr-commits -->\n<!-- END pr-commits -->', '* test1\n* test2')).toBe('<!-- START pr-commits   please keep comment here to allow auto update -->\n* test1\n* test2\n<!-- END pr-commits   please keep comment here to allow auto update -->');
		expect(transform('test1\n<!-- START pr-commits -->\ntest2\n<!-- END pr-commits -->\ntest3', '* test1\n* test2')).toBe('test1\n<!-- START pr-commits   please keep comment here to allow auto update -->\n* test1\n* test2\n<!-- END pr-commits   please keep comment here to allow auto update -->\ntest3');
		expect(transform('test1\n<!-- START pr-commits   please keep comment here to allow auto update -->\n* test1\n* test2\n<!-- END pr-commits   please keep comment here to allow auto update -->\ntest3', '* test1\n* test2')).toBe('test1\n<!-- START pr-commits   please keep comment here to allow auto update -->\n* test1\n* test2\n<!-- END pr-commits   please keep comment here to allow auto update -->\ntest3');
		expect(transform('test1\n<!-- START pr-commits -->\ntest2', '* test1\n* test2')).toBe('test1\n<!-- START pr-commits   please keep comment here to allow auto update -->\n* test1\n* test2\n<!-- END pr-commits   please keep comment here to allow auto update -->');
		expect(transform('test1\n<!-- END pr-commits -->\ntest2', '* test1\n* test2')).toBe('test1\n<!-- END pr-commits -->\ntest2');
		expect(transform('test1\ntest2', '* test1\n* test2')).toBe('test1\ntest2');
	});
});

describe('getCommitTypes', () => {
	testEnv(rootDir);

	it('should get commit types', () => {
		process.env.INPUT_COMMIT_TYPES = 'test1, test2\n\ntest3';
		expect(getCommitTypes()).toEqual(['test1', 'test2', 'test3']);
	});

	it('should get default commit types', () => {
		expect(getCommitTypes()).toEqual(['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']);
	});
});

describe('getBodyTemplate', () => {
	testEnv(rootDir);

	it('should get body template', () => {
		process.env.INPUT_TEMPLATE = '${MERGES}::${COMMITS}';
		expect(getBodyTemplate()).toBe('${MERGES}::${COMMITS}');
	});

	it('should get default body template', () => {
		expect(getBodyTemplate()).toBe('${MERGES}\n${COMMITS}');
	});
});

describe('getMergeTemplate', () => {
	testEnv(rootDir);

	it('should get merge template', () => {
		process.env.INPUT_CHANGE_TEMPLATE = '- ${TITLE}::${NUMBER}::${AUTHOR}';
		expect(getMergeTemplate()).toBe('- ${TITLE}::${NUMBER}::${AUTHOR}');
	});

	it('should get default merge template', () => {
		expect(getMergeTemplate()).toBe('* ${TITLE} (#${NUMBER}) @${AUTHOR}');
	});
});

describe('getCommitTemplate', () => {
	testEnv(rootDir);

	it('should get commit template', () => {
		process.env.INPUT_COMMIT_TEMPLATE = '- ${MESSAGE}::${COMMITS}';
		expect(getCommitTemplate()).toBe('- ${MESSAGE}::${COMMITS}');
	});

	it('should get default commit template', () => {
		expect(getCommitTemplate()).toBe('* ${MESSAGE} (${COMMITS})');
	});
});

describe('getMaxCommitNumber', () => {
	testEnv(rootDir);

	it('should get max commit number', () => {
		process.env.INPUT_MAX_COMMITS = '100';
		expect(getMaxCommitNumber()).toBe(100);
	});

	it('should get default commit number', () => {
		expect(getMaxCommitNumber()).toBe(5);
	});

	it('should get default commit number', () => {
		process.env.INPUT_MAX_COMMITS = 'abc';
		expect(getMaxCommitNumber()).toBe(5);
	});
});
