import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import { Utils } from '@technote-space/github-action-helper';
import { Commit } from '@technote-space/github-action-version-helper';
import { Commit as CommitType } from '@technote-space/github-action-version-helper/dist/types';
import { getCommitTypes, getMaxCommitNumber, getExcludeMessages } from './misc';
import { CommitItemInfo } from '../types';

export const getCommitItems = async(octokit: Octokit, context: Context): Promise<Array<CommitItemInfo>> => {
	const types     = getCommitTypes();
	const exclude   = getExcludeMessages();
	const maxNumber = getMaxCommitNumber();

	return (await Commit.getCommits(types, exclude, [], octokit, context))
		.map(item => item as Required<CommitType>)
		.sort((item1, item2) => types.indexOf(item1.type) - types.indexOf(item2.type))
		.reduce((acc, item) => {
			const target = acc.find(element => element.type === item.type && element.message === item.message);
			if (target) {
				target.commits.push(item.sha);
				target.children.push(...item.children);
			} else {
				acc.push({
					...item,
					commits: [item.sha],
					children: item.children,
				});
			}
			return acc;
		}, [] as Array<{ type?: string; message?: string; commits: Array<string>; original: string; children: Array<{ normalized: string; original: string }> }>)
		.reduce((acc, item) => {
			acc.push({
				...item,
				message: `${item.type}: ${item.message}`,
				isChild: false,
			});
			acc.push(...Utils.uniqueArray(item.children).map(child => ({
				message: child.normalized,
				original: child.original,
				isChild: true,
				commits: item.commits,
			})));

			return acc;
		}, [] as Array<{ message: string; original: string; commits: Array<string>; isChild: boolean }>)
		.map(item => ({
			message: item.message,
			commits: item.commits.slice(0, maxNumber).join(', ') + `${item.commits.length > maxNumber ? ', ...' : ''}`, // eslint-disable-line no-magic-numbers
			original: item.original,
			isChild: item.isChild,
		}));
};
