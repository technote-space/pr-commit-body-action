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
const pulls_1 = require("./pulls");
const rootDir = (0, path_1.resolve)(__dirname, '../..');
const fixtureRootDir = (0, path_1.resolve)(__dirname, '..', 'fixtures');
const octokit = (0, github_action_test_helper_1.getOctokit)();
const context = (0, github_action_test_helper_1.generateContext)({ owner: 'hello', repo: 'world', ref: 'refs/pull/123/merge' }, {
    payload: {
        'pull_request': {
            head: {
                ref: 'feature/change',
            },
        },
    },
});
(0, vitest_1.describe)('getMergedPulls', () => {
    (0, github_action_test_helper_1.testEnv)(rootDir);
    (0, github_action_test_helper_1.disableNetConnect)(nock_1.default);
    (0, vitest_1.it)('should get merged pull request', async () => {
        (0, nock_1.default)('https://api.github.com')
            .persist()
            .get('/repos/hello/world/pulls?base=feature%2Fchange&state=closed')
            .reply(200, () => (0, github_action_test_helper_1.getApiFixture)(fixtureRootDir, 'pulls.list'));
        (0, vitest_1.expect)(await (0, pulls_1.getMergedPulls)(octokit, context)).toEqual([
            { author: 'octocat', number: 1347, title: 'Amazing new feature (#456)' },
            { author: 'octocat', number: 1348, title: 'chore: tweaks' },
            { author: 'octocat', number: 1350, title: 'feat: add new feature1 (#123, #234)' },
            { author: 'octocat', number: 1351, title: 'fix: typo' },
        ]);
    });
    (0, vitest_1.it)('should get filtered merged pull request', async () => {
        process.env.INPUT_FILTER_PR = 'true';
        (0, nock_1.default)('https://api.github.com')
            .persist()
            .get('/repos/hello/world/pulls?base=feature%2Fchange&state=closed')
            .reply(200, () => (0, github_action_test_helper_1.getApiFixture)(fixtureRootDir, 'pulls.list'));
        (0, vitest_1.expect)(await (0, pulls_1.getMergedPulls)(octokit, context)).toEqual([
            { author: 'octocat', number: 1350, title: 'feat: add new feature1 (#123, #234)' },
            { author: 'octocat', number: 1351, title: 'fix: typo' },
            { author: 'octocat', number: 1348, title: 'chore: tweaks' },
        ]);
    });
});
