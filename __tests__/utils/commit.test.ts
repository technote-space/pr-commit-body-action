/* eslint-disable no-magic-numbers */
import nock from 'nock';
import { resolve } from 'path';
import {
	testEnv,
	generateContext,
	disableNetConnect,
	getApiFixture,
	getOctokit,
} from '@technote-space/github-action-test-helper';
import { getCommitMessages, getCommitItems } from '../../src/utils/commit';

const rootDir        = resolve(__dirname, '../..');
const fixtureRootDir = resolve(__dirname, '..', 'fixtures');
const octokit        = getOctokit();
const context        = generateContext({owner: 'hello', repo: 'world', ref: 'refs/pull/123/merge'}, {
	payload: {
		number: 123,
		'pull_request': {
			head: {
				ref: 'feature/change',
			},
		},
	},
});

describe('getCommitMessages', () => {
	testEnv(rootDir);
	disableNetConnect(nock);

	it('should get commit messages 1', async() => {
		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/pulls/123/commits')
			.reply(200, () => getApiFixture(fixtureRootDir, 'commit.list1'));

		expect(await getCommitMessages([], [], octokit, context)).toEqual([]);
	});

	it('should get commit messages 2', async() => {
		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/pulls/123/commits')
			.reply(200, () => getApiFixture(fixtureRootDir, 'commit.list2'));

		expect(await getCommitMessages(['fix'], [], octokit, context)).toEqual([
			[
				{
					'message': 'Fix all the bugs',
					'raw': 'fix: Fix all the bugs',
					'sha': '1dcb09b5b57875f334f61aebed695e2e4193db5e',
					'type': 'fix',
				},
			],
		]);
	});
});

describe('getCommitItems', () => {
	testEnv(rootDir);
	disableNetConnect(nock);

	it('should get commit messages', async() => {
		process.env.INPUT_MAX_COMMITS      = '3';
		process.env.INPUT_EXCLUDE_MESSAGES = 'trigger workflow';
		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/pulls/123/commits')
			.reply(200, () => getApiFixture(fixtureRootDir, 'commit.list2'));

		expect(await getCommitItems(octokit, context)).toEqual([
			{message: 'feat: add new features', commits: '3dcb09b5b57875f334f61aebed695e2e4193db5e', 'raw': 'feat!: add new features', 'indent': false},
			{message: 'feat: add new feature1 (#123)', commits: '3dcb09b5b57875f334f61aebed695e2e4193db5e', 'raw': 'feat: add new feature1 (#123)', 'indent': true},
			{message: 'feat: add new feature2 (#234)', commits: '3dcb09b5b57875f334f61aebed695e2e4193db5e', 'raw': 'feat: add new feature2 (#234)', 'indent': true},
			{message: 'chore: tweaks (#345, #456)', commits: '3dcb09b5b57875f334f61aebed695e2e4193db5e', 'raw': 'chore: tweaks (#345, #456)', 'indent': true},
			{message: 'feat: add new feature3', commits: '4dcb09b5b57875f334f61aebed695e2e4193db5e', 'raw': 'feat :  add new feature3', 'indent': false},
			{message: 'fix: Fix all the bugs', commits: '1dcb09b5b57875f334f61aebed695e2e4193db5e', 'raw': 'fix: Fix all the bugs', 'indent': false},
			{message: 'style: tweaks', commits: '7dcb09b5b57875f334f61aebed695e2e4193db5e', 'raw': 'style: tweaks', 'indent': false},
			{message: 'refactor: refactoring', commits: '8dcb09b5b57875f334f61aebed695e2e4193db5e', 'raw': 'refactor: refactoring', 'indent': false},
			{
				message: 'chore: tweaks',
				commits: '2dcb09b5b57875f334f61aebed695e2e4193db5e, 5dcb09b5b57875f334f61aebed695e2e4193db5e, 9dcb09b5b57875f334f61aebed695e2e4193db5e, ...',
				'raw': 'chore: tweaks',
				'indent': false,
			},
		]);
	});
});
