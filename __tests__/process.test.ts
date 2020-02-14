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
	stdoutContains,
	getOctokit,
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

		stdoutContains(mockStdout, [
			'::group::Pull Requests',
			'::group::Commits',
			'::group::Templates',
			'> There is no diff.',
		]);
	});

	it('should return true 2', async() => {
		process.env.INPUT_MAX_COMMITS = '3';
		const mockStdout              = spyOnStdout();
		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/pulls/123/commits')
			.reply(200, () => getApiFixture(fixtureRootDir, 'commit.list2'))
			.get('/repos/hello/world/pulls?base=feature%2Fchange&state=closed')
			.reply(200, () => getApiFixture(fixtureRootDir, 'pulls.list'))
			.patch('/repos/hello/world/pulls/123')
			.reply(200, () => getApiFixture(fixtureRootDir, 'pulls.update'));

		expect(await execute(new Logger(), octokit, context('test1\n<!-- START pr-commits -->\ntest2\n<!-- END pr-commits -->\ntest3'))).toBe(true);

		stdoutContains(mockStdout, [
			'::group::Pull Requests',
			'::group::Commits',
			'::group::Templates',
			'> Updated.',
		]);
	});
});
