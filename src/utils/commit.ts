import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import { Utils } from '@technote-space/github-action-helper';
import { getCommitTypes, getMaxCommitNumber, getExcludeMessages, parseCommitMessage } from './misc';
import { CommitInfo, CommitItemInfo } from '../types';

const MERGE_MESSAGE = /^Merge pull request #\d+ /;

export const getCommitMessages = async(types: Array<string>, exclude: Array<string>, octokit: Octokit, context: Context): Promise<Array<Array<CommitInfo>>> => (await octokit.paginate(
	octokit.pulls.listCommits.endpoint.merge({
		...context.repo,
		'pull_number': context.payload.number,
	}),
))
	.filter((item: Octokit.PullsListCommitsResponseItem): boolean => !MERGE_MESSAGE.test(item.commit.message))
	.map(
		(item: Octokit.PullsListCommitsResponseItem): Array<CommitInfo> => Utils.split(item.commit.message, /\r?\n|\r/)
			.filter(message => message)
			.map(message => ({
				sha: item.sha,
				...parseCommitMessage(message, types, exclude),
			}))
			.filter(item => item.type)
			.map(item => item as CommitInfo),
	)
	.filter(items => items.length);

export const getCommitItems = async(octokit: Octokit, context: Context): Promise<Array<CommitItemInfo>> => {
	const types     = getCommitTypes();
	const exclude   = getExcludeMessages();
	const maxNumber = getMaxCommitNumber();
	return (await getCommitMessages(types, exclude, octokit, context))
		.filter(item => item[0].type)
		.sort((item1, item2) => types.indexOf(item1[0].type) - types.indexOf(item2[0].type))
		.reduce((acc, items) => {
			return acc.concat(items.map(
				(item, index) => ({...item, indent: !!index}),
			));
		}, [] as Array<Required<CommitInfo>>)
		.reduce((acc, item) => {
			const target = acc.find(element => element.type === item.type && element.message === item.message);
			if (target) {
				target.commits.push(item.sha);
			} else {
				acc.push({...item, commits: [item.sha], indent: !!item.indent});
			}
			return acc;
		}, [] as Array<{ type: string; message: string; commits: Array<string>; raw: string; indent: boolean }>)
		.map(item => ({
			message: `${item.type}: ${item.message}`,
			commits: item.commits.slice(0, maxNumber).join(', ') + `${item.commits.length > maxNumber ? ', ...' : ''}`, // eslint-disable-line no-magic-numbers
			raw: item.raw,
			indent: item.indent,
		}));
};
