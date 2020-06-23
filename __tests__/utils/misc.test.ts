/* eslint-disable no-magic-numbers */
import {testEnv} from '@technote-space/github-action-test-helper';
import {resolve} from 'path';
import {transform} from '../../src/utils/misc';
import {
  getCommitTypes,
  getBodyTemplate,
  getMergeTemplate,
  getCommitTemplate,
  getMaxCommitNumber,
  getExcludeMessages,
  addCloseAnnotation,
  getLinkIssueKeyword,
} from '../../src/utils/misc';

const rootDir = resolve(__dirname, '../..');

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
    expect(getCommitTypes()).toEqual(['feat', 'fix', 'build', 'ci', 'docs', 'style', 'perf', 'refactor', 'test', 'chore']);
  });
});

describe('getBodyTemplate', () => {
  testEnv(rootDir);

  it('should get body template', () => {
    process.env.INPUT_TEMPLATE = '${MERGES}::${COMMITS}';
    expect(getBodyTemplate(false)).toBe('${MERGES}::${COMMITS}');
  });

  it('should get default body template', () => {
    expect(getBodyTemplate(false)).toBe('${MERGES}\n${COMMITS}\n${BREAKING_CHANGES}');
  });

  it('should return empty', () => {
    expect(getBodyTemplate(true)).toBe('');
  });

  it('should get no item', () => {
    process.env.INPUT_NO_ITEMS = '- no item';
    expect(getBodyTemplate(true)).toBe('- no item');
  });

  it('should get body template with title', () => {
    process.env.INPUT_TITLE = '## Changed';
    expect(getBodyTemplate(false)).toBe('## Changed\n\n${MERGES}\n${COMMITS}\n${BREAKING_CHANGES}');
  });

  it('should get body template with title, no item', () => {
    process.env.INPUT_TITLE    = '## Changed';
    process.env.INPUT_NO_ITEMS = '- no item';
    expect(getBodyTemplate(true)).toBe('## Changed\n\n- no item');
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

describe('getExcludeMessages', () => {
  testEnv(rootDir);

  it('should get exclude messages', () => {
    process.env.INPUT_EXCLUDE_MESSAGES = 'trigger workflow';
    expect(getExcludeMessages()).toEqual(['trigger workflow']);
  });

  it('should return empty', () => {
    expect(getExcludeMessages()).toEqual([]);
  });
});

describe('addCloseAnnotation', () => {
  testEnv(rootDir);

  it('should add close annotation', () => {
    expect(addCloseAnnotation('test message #123', 'closes')).toBe('test message closes #123');
  });

  it('should not add close annotation', () => {
    expect(addCloseAnnotation('test message #123', '')).toBe('test message #123');
  });
});

describe('getLinkIssueKeyword', () => {
  testEnv(rootDir);

  it('should get default keyword 1', () => {
    expect(getLinkIssueKeyword()).toBe('');
  });

  it('should get default keyword 2', () => {
    process.env.INPUT_LINK_ISSUE_KEYWORD = 'test';

    expect(getLinkIssueKeyword()).toBe('');
  });

  it('should get keyword', () => {
    process.env.INPUT_LINK_ISSUE_KEYWORD = 'close';
    expect(getLinkIssueKeyword()).toBe('close');
  });
});
