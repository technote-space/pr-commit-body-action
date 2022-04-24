"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-magic-numbers */
const path_1 = require("path");
const github_action_test_helper_1 = require("@technote-space/github-action-test-helper");
const vitest_1 = require("vitest");
const misc_1 = require("./misc");
const rootDir = (0, path_1.resolve)(__dirname, '../..');
(0, vitest_1.describe)('transform', () => {
    (0, vitest_1.it)('should transform content', () => {
        (0, vitest_1.expect)((0, misc_1.transform)('', '')).toBe('');
        (0, vitest_1.expect)((0, misc_1.transform)('<!-- START pr-commits -->\n<!-- END pr-commits -->', '* test1\n* test2')).toBe('<!-- START pr-commits   please keep comment here to allow auto update -->\n* test1\n* test2\n<!-- END pr-commits   please keep comment here to allow auto update -->');
        (0, vitest_1.expect)((0, misc_1.transform)('test1\n<!-- START pr-commits -->\ntest2\n<!-- END pr-commits -->\ntest3', '* test1\n* test2')).toBe('test1\n<!-- START pr-commits   please keep comment here to allow auto update -->\n* test1\n* test2\n<!-- END pr-commits   please keep comment here to allow auto update -->\ntest3');
        (0, vitest_1.expect)((0, misc_1.transform)('test1\n<!-- START pr-commits   please keep comment here to allow auto update -->\n* test1\n* test2\n<!-- END pr-commits   please keep comment here to allow auto update -->\ntest3', '* test1\n* test2')).toBe('test1\n<!-- START pr-commits   please keep comment here to allow auto update -->\n* test1\n* test2\n<!-- END pr-commits   please keep comment here to allow auto update -->\ntest3');
        (0, vitest_1.expect)((0, misc_1.transform)('test1\n<!-- START pr-commits -->\ntest2', '* test1\n* test2')).toBe('test1\n<!-- START pr-commits   please keep comment here to allow auto update -->\n* test1\n* test2\n<!-- END pr-commits   please keep comment here to allow auto update -->');
        (0, vitest_1.expect)((0, misc_1.transform)('test1\n<!-- END pr-commits -->\ntest2', '* test1\n* test2')).toBe('test1\n<!-- END pr-commits -->\ntest2');
        (0, vitest_1.expect)((0, misc_1.transform)('test1\ntest2', '* test1\n* test2')).toBe('test1\ntest2');
    });
});
(0, vitest_1.describe)('getCommitTypes', () => {
    (0, github_action_test_helper_1.testEnv)(rootDir);
    (0, vitest_1.it)('should get commit types', () => {
        process.env.INPUT_COMMIT_TYPES = 'test1, test2\n\ntest3';
        (0, vitest_1.expect)((0, misc_1.getCommitTypes)()).toEqual(['test1', 'test2', 'test3']);
    });
    (0, vitest_1.it)('should get default commit types', () => {
        (0, vitest_1.expect)((0, misc_1.getCommitTypes)()).toEqual(['feat', 'fix', 'build', 'ci', 'docs', 'style', 'perf', 'refactor', 'test', 'chore']);
    });
});
(0, vitest_1.describe)('getBodyTemplate', () => {
    (0, github_action_test_helper_1.testEnv)(rootDir);
    (0, vitest_1.it)('should get body template', () => {
        process.env.INPUT_TEMPLATE = '${MERGES}::${COMMITS}';
        (0, vitest_1.expect)((0, misc_1.getBodyTemplate)(false)).toBe('${MERGES}::${COMMITS}');
    });
    (0, vitest_1.it)('should get default body template', () => {
        (0, vitest_1.expect)((0, misc_1.getBodyTemplate)(false)).toBe('${MERGES}\n${COMMITS}\n${BREAKING_CHANGES}');
    });
    (0, vitest_1.it)('should return empty', () => {
        (0, vitest_1.expect)((0, misc_1.getBodyTemplate)(true)).toBe('');
    });
    (0, vitest_1.it)('should get no item', () => {
        process.env.INPUT_NO_ITEMS = '- no item';
        (0, vitest_1.expect)((0, misc_1.getBodyTemplate)(true)).toBe('- no item');
    });
    (0, vitest_1.it)('should get body template with title', () => {
        process.env.INPUT_TITLE = '## Changed';
        (0, vitest_1.expect)((0, misc_1.getBodyTemplate)(false)).toBe('## Changed\n\n${MERGES}\n${COMMITS}\n${BREAKING_CHANGES}');
    });
    (0, vitest_1.it)('should get body template with title, no item', () => {
        process.env.INPUT_TITLE = '## Changed';
        process.env.INPUT_NO_ITEMS = '- no item';
        (0, vitest_1.expect)((0, misc_1.getBodyTemplate)(true)).toBe('## Changed\n\n- no item');
    });
});
(0, vitest_1.describe)('getMergeTemplate', () => {
    (0, github_action_test_helper_1.testEnv)(rootDir);
    (0, vitest_1.it)('should get merge template', () => {
        process.env.INPUT_CHANGE_TEMPLATE = '- ${TITLE}::${NUMBER}::${AUTHOR}';
        (0, vitest_1.expect)((0, misc_1.getMergeTemplate)()).toBe('- ${TITLE}::${NUMBER}::${AUTHOR}');
    });
    (0, vitest_1.it)('should get default merge template', () => {
        (0, vitest_1.expect)((0, misc_1.getMergeTemplate)()).toBe('* ${TITLE} (#${NUMBER}) @${AUTHOR}');
    });
});
(0, vitest_1.describe)('getCommitTemplate', () => {
    (0, github_action_test_helper_1.testEnv)(rootDir);
    (0, vitest_1.it)('should get commit template', () => {
        process.env.INPUT_COMMIT_TEMPLATE = '- ${MESSAGE}::${COMMITS}';
        (0, vitest_1.expect)((0, misc_1.getCommitTemplate)()).toBe('- ${MESSAGE}::${COMMITS}');
    });
    (0, vitest_1.it)('should get default commit template', () => {
        (0, vitest_1.expect)((0, misc_1.getCommitTemplate)()).toBe('* ${MESSAGE} (${COMMITS})');
    });
});
(0, vitest_1.describe)('getMaxCommitNumber', () => {
    (0, github_action_test_helper_1.testEnv)(rootDir);
    (0, vitest_1.it)('should get max commit number', () => {
        process.env.INPUT_MAX_COMMITS = '100';
        (0, vitest_1.expect)((0, misc_1.getMaxCommitNumber)()).toBe(100);
    });
    (0, vitest_1.it)('should get default commit number', () => {
        (0, vitest_1.expect)((0, misc_1.getMaxCommitNumber)()).toBe(5);
    });
    (0, vitest_1.it)('should get default commit number', () => {
        process.env.INPUT_MAX_COMMITS = 'abc';
        (0, vitest_1.expect)((0, misc_1.getMaxCommitNumber)()).toBe(5);
    });
});
(0, vitest_1.describe)('getExcludeMessages', () => {
    (0, github_action_test_helper_1.testEnv)(rootDir);
    (0, vitest_1.it)('should get exclude messages', () => {
        process.env.INPUT_EXCLUDE_MESSAGES = 'trigger workflow';
        (0, vitest_1.expect)((0, misc_1.getExcludeMessages)()).toEqual(['trigger workflow']);
    });
    (0, vitest_1.it)('should return empty', () => {
        (0, vitest_1.expect)((0, misc_1.getExcludeMessages)()).toEqual([]);
    });
});
(0, vitest_1.describe)('addCloseAnnotation', () => {
    (0, github_action_test_helper_1.testEnv)(rootDir);
    (0, vitest_1.it)('should add close annotation 1', () => {
        (0, vitest_1.expect)((0, misc_1.addCloseAnnotation)('test message #123', 'closes')).toBe('test message closes #123');
    });
    (0, vitest_1.it)('should add close annotation 2', () => {
        (0, vitest_1.expect)((0, misc_1.addCloseAnnotation)('test message (#123)', 'closes')).toBe('test message (closes #123)');
    });
    (0, vitest_1.it)('should not add close annotation 1', () => {
        (0, vitest_1.expect)((0, misc_1.addCloseAnnotation)('test message #123', '')).toBe('test message #123');
    });
    (0, vitest_1.it)('should not add close annotation 2', () => {
        (0, vitest_1.expect)((0, misc_1.addCloseAnnotation)('test (closes #123)', 'fix')).toBe('test (closes #123)');
    });
});
(0, vitest_1.describe)('getLinkIssueKeyword', () => {
    (0, github_action_test_helper_1.testEnv)(rootDir);
    (0, vitest_1.it)('should get default keyword 1', () => {
        (0, vitest_1.expect)((0, misc_1.getLinkIssueKeyword)()).toBe('');
    });
    (0, vitest_1.it)('should get default keyword 2', () => {
        process.env.INPUT_LINK_ISSUE_KEYWORD = 'test';
        (0, vitest_1.expect)((0, misc_1.getLinkIssueKeyword)()).toBe('');
    });
    (0, vitest_1.it)('should get keyword', () => {
        process.env.INPUT_LINK_ISSUE_KEYWORD = 'close';
        (0, vitest_1.expect)((0, misc_1.getLinkIssueKeyword)()).toBe('close');
    });
});
