import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import { Utils } from '@technote-space/github-action-helper';
import { PullsInfo } from '../types';

export const getMergedPulls = async(octokit: Octokit, context: Context): Promise<Array<PullsInfo>> => (await octokit.paginate(octokit.pulls.list.endpoint.merge({
	...context.repo,
	base: Utils.getPrBranch(context),
}))).map((item: Octokit.PullsListResponseItem): PullsInfo => ({
	author: item.user.login,
	title: item.title,
	number: item.number,
}));
