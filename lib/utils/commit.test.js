"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-magic-numbers */
const path_1 = require("path");
const github_action_test_helper_1 = require("@technote-space/github-action-test-helper");
const nock_1 = __importDefault(require("nock"));
const vitest_1 = require("vitest");
const commit_1 = require("./commit");
const rootDir = (0, path_1.resolve)(__dirname, '../..');
const fixtureRootDir = (0, path_1.resolve)(__dirname, '..', 'fixtures');
const octokit = (0, github_action_test_helper_1.getOctokit)();
const context = (0, github_action_test_helper_1.generateContext)({ owner: 'hello', repo: 'world', ref: 'refs/pull/123/merge' }, {
    payload: {
        number: 123,
        'pull_request': {
            head: {
                ref: 'feature/change',
            },
        },
    },
});
(0, vitest_1.describe)('getCommitItems', () => {
    (0, github_action_test_helper_1.testEnv)(rootDir);
    (0, github_action_test_helper_1.disableNetConnect)(nock_1.default);
    (0, vitest_1.it)('should get commit messages', async () => {
        process.env.INPUT_MAX_COMMITS = '3';
        process.env.INPUT_EXCLUDE_MESSAGES = 'trigger workflow';
        (0, nock_1.default)('https://api.github.com')
            .persist()
            .get('/repos/hello/world/pulls/123/commits')
            .reply(200, () => (0, github_action_test_helper_1.getApiFixture)(fixtureRootDir, 'commit.list2'));
        (0, vitest_1.expect)(await (0, commit_1.getCommitItems)(octokit, context)).toEqual([
            {
                message: 'feat: add new features',
                commits: '3dcb09b5b57875f334f61aebed695e2e4193db5e',
                'original': 'feat!: add new features',
                'isChild': false,
                'isNotes': false,
            },
            {
                message: 'feat: add new feature1 (#123)',
                commits: '3dcb09b5b57875f334f61aebed695e2e4193db5e',
                'original': 'feat: add new feature1 (#123)',
                'isChild': true,
                'isNotes': false,
            },
            {
                message: 'feat: add new feature2 (#234)',
                commits: '3dcb09b5b57875f334f61aebed695e2e4193db5e',
                'original': 'feat: add new feature2 (#234)',
                'isChild': true,
                'isNotes': false,
            },
            {
                message: 'BREAKING CHANGE: changed',
                commits: '3dcb09b5b57875f334f61aebed695e2e4193db5e',
                'original': 'BREAKING CHANGE: changed',
                'isChild': false,
                'isNotes': true,
            },
            {
                message: 'feat: add new feature3',
                commits: '4dcb09b5b57875f334f61aebed695e2e4193db5e',
                'original': 'feat :  add new feature3',
                'isChild': false,
                'isNotes': false,
            },
            {
                message: 'fix: Fix all the bugs',
                commits: '1dcb09b5b57875f334f61aebed695e2e4193db5e',
                'original': 'fix: Fix all the bugs',
                'isChild': false,
                'isNotes': false,
            },
            {
                message: 'style: tweaks',
                commits: '7dcb09b5b57875f334f61aebed695e2e4193db5e',
                'original': 'style: tweaks',
                'isChild': false,
                'isNotes': false,
            },
            {
                message: 'refactor: refactoring',
                commits: '8dcb09b5b57875f334f61aebed695e2e4193db5e',
                'original': 'refactor: refactoring',
                'isChild': false,
                'isNotes': false,
            },
            {
                message: 'chore: tweaks',
                commits: '2dcb09b5b57875f334f61aebed695e2e4193db5e, 5dcb09b5b57875f334f61aebed695e2e4193db5e, 9dcb09b5b57875f334f61aebed695e2e4193db5e, ...',
                'original': 'chore: tweaks',
                'isChild': false,
                'isNotes': false,
            },
        ]);
    });
});
