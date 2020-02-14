import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import { getCommitTypes, getMaxCommitNumber } from './misc';
import { CommitInfo, CommitItemInfo } from '../types';

const MERGE_MESSAGE = /^Merge pull request #\d+ /;
// <type>(<scope>): <subject>
// @see https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716#semantic-commit-messages
const SEMANTIC_MESSAGE = /^(.+?)\s*(\(.+?\)\s*)?:\s*(.+?)$/;

const parseCommitMessage = (message: string, types: Array<string>): { type?: string; message?: string } => {
	const target  = message.trim().replace(/\r?\n|\r/g, ' ');
	const matches = target.match(SEMANTIC_MESSAGE);
	if (!matches || !types.includes(matches[1])) {
		return {};
	}

	return {
		type: matches[1],
		message: matches[3],
	};
};

export const getCommitMessages = async(octokit: Octokit, context: Context): Promise<Array<CommitInfo>> => {
	const types = getCommitTypes();
	return (await octokit.paginate(octokit.pulls.listCommits.endpoint.merge({
		...context.repo,
		'pull_number': context.payload.number,
	}))).filter((item: Octokit.PullsListCommitsResponseItem): boolean => !MERGE_MESSAGE.test(item.commit.message)).map((item: Octokit.PullsListCommitsResponseItem): CommitInfo => ({
		sha: item.sha,
		...parseCommitMessage(item.commit.message, types),
	}));
};

export const getCommitItems = async(octokit: Octokit, context: Context): Promise<Array<CommitItemInfo>> => {
	const types     = getCommitTypes();
	const maxNumber = getMaxCommitNumber();
	return (await getCommitMessages(octokit, context))
		.filter(item => item.type)
		.map(item => item as Required<CommitInfo>)
		.reduce((acc, item) => {
			const target = acc.find(element => element.type === item.type && element.message === item.message);
			if (target) {
				target.commits.push(item.sha);
			} else {
				acc.push({...item, commits: [item.sha]});
			}
			return acc;
		}, [] as Array<{ type: string; message: string; commits: Array<string> }>)
		.sort((item1, item2) => types.indexOf(item1.type) - types.indexOf(item2.type))
		.map(item => ({
			message: `${item.type}: ${item.message}`,
			commits: item.commits.slice(0, maxNumber).join(', ') + `${item.commits.length > maxNumber ? ', ...' : ''}`, // eslint-disable-line no-magic-numbers
		}));
};
