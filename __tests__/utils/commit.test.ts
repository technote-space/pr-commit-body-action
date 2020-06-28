/* eslint-disable no-magic-numbers */
import nock from 'nock';
import {resolve} from 'path';
import {
  testEnv,
  generateContext,
  disableNetConnect,
  getApiFixture,
  getOctokit,
} from '@technote-space/github-action-test-helper';
import {getCommitItems} from '../../src/utils/commit';

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
