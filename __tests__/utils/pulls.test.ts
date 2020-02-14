/* eslint-disable no-magic-numbers */
import nock from 'nock';
import { resolve } from 'path';
import {
	generateContext,
	disableNetConnect,
	getApiFixture,
	getOctokit,
} from '@technote-space/github-action-test-helper';
import { getMergedPulls } from '../../src/utils/pulls';

const fixtureRootDir = resolve(__dirname, '..', 'fixtures');
const octokit        = getOctokit();
const context        = generateContext({owner: 'hello', repo: 'world', ref: 'refs/pull/123/merge'}, {
	payload: {
		'pull_request': {
			head: {
				ref: 'feature/change',
			},
		},
	},
});

describe('getMergedPulls', () => {
	disableNetConnect(nock);

	it('should get merged pull request', async() => {
		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/pulls?base=feature%2Fchange&state=closed')
			.reply(200, () => getApiFixture(fixtureRootDir, 'pulls.list'));

		expect(await getMergedPulls(octokit, context)).toEqual([
			{author: 'octocat', number: 1347, title: 'Amazing new feature (closes #456)'},
			{author: 'octocat', number: 1348, title: 'Amazing new feature'},
		]);
	});
});
