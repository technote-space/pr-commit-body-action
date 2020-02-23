/* eslint-disable no-magic-numbers */
import { Context } from '@actions/github/lib/context';
import nock from 'nock';
import { resolve } from 'path';
import { Logger } from '@technote-space/github-action-helper';
import {
	testEnv,
	generateContext,
	disableNetConnect,
	getApiFixture,
	spyOnStdout,
	getOctokit,
	stdoutCalledWith,
} from '@technote-space/github-action-test-helper';
import { execute } from '../src/process';

const rootDir        = resolve(__dirname, '..');
const fixtureRootDir = resolve(__dirname, 'fixtures');
const octokit        = getOctokit();
const context        = (body?: string): Context => generateContext({owner: 'hello', repo: 'world', ref: 'refs/pull/123/merge'}, {
	payload: {
		number: 123,
		'pull_request': {
			head: {
				ref: 'feature/change',
			},
			body,
		},
	},
});
beforeEach(() => {
	Logger.resetForTesting();
});

describe('execute', () => {
	testEnv(rootDir);
	disableNetConnect(nock);

	it('should return false', async() => {
		expect(await execute(new Logger(), octokit, generateContext({}))).toBe(false);
		expect(await execute(new Logger(), octokit, context())).toBe(false);
	});

	it('should return true 1', async() => {
		const mockStdout = spyOnStdout();
		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/pulls/123/commits')
			.reply(200, () => getApiFixture(fixtureRootDir, 'commit.list2'))
			.get('/repos/hello/world/pulls?base=feature%2Fchange&state=closed')
			.reply(200, () => getApiFixture(fixtureRootDir, 'pulls.list'));

		expect(await execute(new Logger(), octokit, context('test body'))).toBe(true);

		stdoutCalledWith(mockStdout, [
			'::group::Pull Requests',
			JSON.stringify([
				{
					author: 'octocat',
					title: 'Amazing new feature (#456)',
					number: 1347,
				},
				{
					author: 'octocat',
					title: 'feat: add new feature1 (#123, #234)',
					number: 1348,
				},
			], null, '\t'),
			'::endgroup::',
			'::group::Commits',
			JSON.stringify([
				{
					'message': 'feat: add new features',
					'commits': '3dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'feat: add new features',
					'indent': false,
				},
				{
					'message': 'feat: add new feature1 (#123)',
					'commits': '3dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'feat: add new feature1 (#123)',
					'indent': true,
				},
				{
					'message': 'feat: add new feature2 (#234)',
					'commits': '3dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'feat: add new feature2 (#234)',
					'indent': true,
				},
				{
					'message': 'chore: tweaks (#345, #456)',
					'commits': '3dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'chore: tweaks (#345, #456)',
					'indent': true,
				},
				{
					'message': 'feat: add new feature3',
					'commits': '4dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'feat :  add new feature3',
					'indent': false,
				},
				{
					'message': 'fix: Fix all the bugs',
					'commits': '1dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'fix: Fix all the bugs',
					'indent': false,
				},
				{
					'message': 'style: tweaks',
					'commits': '7dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'style: tweaks',
					'indent': false,
				},
				{
					'message': 'refactor: refactoring',
					'commits': '8dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'refactor: refactoring',
					'indent': false,
				},
				{
					'message': 'chore: tweaks',
					'commits': '2dcb09b5b57875f334f61aebed695e2e4193db5e, 5dcb09b5b57875f334f61aebed695e2e4193db5e, 9dcb09b5b57875f334f61aebed695e2e4193db5e, 0dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'chore: tweaks',
					'indent': false,
				},
				{
					'message': 'chore: trigger workflow',
					'commits': '000b09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'chore: trigger workflow',
					'indent': false,
				},
			], null, '\t'),
			'::endgroup::',
			'::group::Templates',
			'"* Amazing new feature (closes #456) (#1347) @octocat\\n* feat: add new feature1 (closes #123, closes #234) (#1348) @octocat"',
			'"* feat: add new features (3dcb09b5b57875f334f61aebed695e2e4193db5e)\\n  * feat: add new feature1 (closes #123)\\n  * feat: add new feature2 (closes #234)\\n  * chore: tweaks (closes #345, closes #456)\\n* feat: add new feature3 (4dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* fix: Fix all the bugs (1dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* style: tweaks (7dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* refactor: refactoring (8dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* chore: tweaks (2dcb09b5b57875f334f61aebed695e2e4193db5e, 5dcb09b5b57875f334f61aebed695e2e4193db5e, 9dcb09b5b57875f334f61aebed695e2e4193db5e, 0dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* chore: trigger workflow (000b09b5b57875f334f61aebed695e2e4193db5e)"',
			'"* Amazing new feature (closes #456) (#1347) @octocat\\n* feat: add new feature1 (closes #123, closes #234) (#1348) @octocat\\n* feat: add new features (3dcb09b5b57875f334f61aebed695e2e4193db5e)\\n  * feat: add new feature1 (closes #123)\\n  * feat: add new feature2 (closes #234)\\n  * chore: tweaks (closes #345, closes #456)\\n* feat: add new feature3 (4dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* fix: Fix all the bugs (1dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* style: tweaks (7dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* refactor: refactoring (8dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* chore: tweaks (2dcb09b5b57875f334f61aebed695e2e4193db5e, 5dcb09b5b57875f334f61aebed695e2e4193db5e, 9dcb09b5b57875f334f61aebed695e2e4193db5e, 0dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* chore: trigger workflow (000b09b5b57875f334f61aebed695e2e4193db5e)"',
			'::endgroup::',
			'> There is no diff.',
		]);
	});

	it('should return true 2', async() => {
		process.env.INPUT_MAX_COMMITS        = '3';
		process.env.INPUT_LINK_ISSUE_KEYWORD = 'fix';
		const mockStdout                     = spyOnStdout();
		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/pulls/123/commits')
			.reply(200, () => getApiFixture(fixtureRootDir, 'commit.list2'))
			.get('/repos/hello/world/pulls?base=feature%2Fchange&state=closed')
			.reply(200, () => getApiFixture(fixtureRootDir, 'pulls.list'))
			.patch('/repos/hello/world/pulls/123')
			.reply(200, () => getApiFixture(fixtureRootDir, 'pulls.update'));

		expect(await execute(new Logger(), octokit, context('test1\n<!-- START pr-commits -->\ntest2\n<!-- END pr-commits -->\ntest3'))).toBe(true);

		stdoutCalledWith(mockStdout, [
			'::group::Pull Requests',
			JSON.stringify([
				{
					author: 'octocat',
					title: 'Amazing new feature (#456)',
					number: 1347,
				},
				{
					author: 'octocat',
					title: 'feat: add new feature1 (#123, #234)',
					number: 1348,
				},
			], null, '\t'),
			'::endgroup::',
			'::group::Commits',
			JSON.stringify([
				{
					'message': 'feat: add new features',
					'commits': '3dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'feat: add new features',
					'indent': false,
				},
				{
					'message': 'feat: add new feature1 (#123)',
					'commits': '3dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'feat: add new feature1 (#123)',
					'indent': true,
				},
				{
					'message': 'feat: add new feature2 (#234)',
					'commits': '3dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'feat: add new feature2 (#234)',
					'indent': true,
				},
				{
					'message': 'chore: tweaks (#345, #456)',
					'commits': '3dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'chore: tweaks (#345, #456)',
					'indent': true,
				},
				{
					'message': 'feat: add new feature3',
					'commits': '4dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'feat :  add new feature3',
					'indent': false,
				},
				{
					'message': 'fix: Fix all the bugs',
					'commits': '1dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'fix: Fix all the bugs',
					'indent': false,
				},
				{
					'message': 'style: tweaks',
					'commits': '7dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'style: tweaks',
					'indent': false,
				},
				{
					'message': 'refactor: refactoring',
					'commits': '8dcb09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'refactor: refactoring',
					'indent': false,
				},
				{
					'message': 'chore: tweaks',
					'commits': '2dcb09b5b57875f334f61aebed695e2e4193db5e, 5dcb09b5b57875f334f61aebed695e2e4193db5e, 9dcb09b5b57875f334f61aebed695e2e4193db5e, ...',
					'raw': 'chore: tweaks',
					'indent': false,
				},
				{
					'message': 'chore: trigger workflow',
					'commits': '000b09b5b57875f334f61aebed695e2e4193db5e',
					'raw': 'chore: trigger workflow',
					'indent': false,
				},
			], null, '\t'),
			'::endgroup::',
			'::group::Templates',
			'"* Amazing new feature (fix #456) (#1347) @octocat\\n* feat: add new feature1 (fix #123, fix #234) (#1348) @octocat"',
			'"* feat: add new features (3dcb09b5b57875f334f61aebed695e2e4193db5e)\\n  * feat: add new feature1 (fix #123)\\n  * feat: add new feature2 (fix #234)\\n  * chore: tweaks (fix #345, fix #456)\\n* feat: add new feature3 (4dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* fix: Fix all the bugs (1dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* style: tweaks (7dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* refactor: refactoring (8dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* chore: tweaks (2dcb09b5b57875f334f61aebed695e2e4193db5e, 5dcb09b5b57875f334f61aebed695e2e4193db5e, 9dcb09b5b57875f334f61aebed695e2e4193db5e, ...)\\n* chore: trigger workflow (000b09b5b57875f334f61aebed695e2e4193db5e)"',
			'"* Amazing new feature (fix #456) (#1347) @octocat\\n* feat: add new feature1 (fix #123, fix #234) (#1348) @octocat\\n* feat: add new features (3dcb09b5b57875f334f61aebed695e2e4193db5e)\\n  * feat: add new feature1 (fix #123)\\n  * feat: add new feature2 (fix #234)\\n  * chore: tweaks (fix #345, fix #456)\\n* feat: add new feature3 (4dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* fix: Fix all the bugs (1dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* style: tweaks (7dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* refactor: refactoring (8dcb09b5b57875f334f61aebed695e2e4193db5e)\\n* chore: tweaks (2dcb09b5b57875f334f61aebed695e2e4193db5e, 5dcb09b5b57875f334f61aebed695e2e4193db5e, 9dcb09b5b57875f334f61aebed695e2e4193db5e, ...)\\n* chore: trigger workflow (000b09b5b57875f334f61aebed695e2e4193db5e)"',
			'::endgroup::',
			'> Updated.',
		]);
	});
});
