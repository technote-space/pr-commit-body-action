import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import { Utils } from '@technote-space/github-action-helper';
import { getCommitTypes, getExcludeMessages, parseCommitMessage, isFilterPulls } from './misc';
import { PullsInfo } from '../types';

export const getMergedPulls = async(octokit: Octokit, context: Context): Promise<Array<PullsInfo>> => {
	const types    = getCommitTypes();
	const exclude  = getExcludeMessages();
	const isFilter = isFilterPulls();
	const pulls    = await octokit.paginate(octokit.pulls.list.endpoint.merge({
		...context.repo,
		base: Utils.getPrBranch(context),
		state: 'closed',
	}));
	return (isFilter ? pulls.map(item => ({...item, ...parseCommitMessage(item.title, types, exclude)})).filter(item => item.type) : pulls)
		.filter(item => !!item.merged_at)
		.map((item: Octokit.PullsListResponseItem): PullsInfo => ({
			author: item.user.login,
			title: item.title,
			number: item.number,
		}));
};