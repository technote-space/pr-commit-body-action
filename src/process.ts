import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import { Logger } from '@technote-space/github-action-helper';
import { getCommitItems } from './utils/commit';
import { getBodyTemplate, getCommitTemplate, getMergeTemplate, replaceVariables, transform, addCloseAnnotation, getLinkIssueKeyword } from './utils/misc';
import { getMergedPulls } from './utils/pulls';

export const execute = async(logger: Logger, octokit: Octokit, context: Context): Promise<boolean> => {
	const prBody = context.payload.pull_request?.body ?? '';
	if ('' === prBody) {
		return false;
	}

	const pulls      = await getMergedPulls(octokit, context);
	const commits    = await getCommitItems(octokit, context);
	const pullTitles = pulls.map(item => item.title);
	const keyword    = getLinkIssueKeyword();

	logger.startProcess('Pull Requests');
	console.log(pulls);
	logger.startProcess('Commits');
	console.log(commits);

	const pullsTemplate  = pulls.map(pull => replaceVariables(getMergeTemplate(), [
		{key: 'TITLE', value: addCloseAnnotation(pull.title, keyword)},
		{key: 'NUMBER', value: String(pull.number)},
		{key: 'AUTHOR', value: pull.author},
	])).join('\n');
	const commitTemplate = commits.filter(commit => !pullTitles.includes(commit.raw)).map(commit => replaceVariables(getCommitTemplate(), [
		{key: 'MESSAGE', value: addCloseAnnotation(commit.message, keyword)},
		{key: 'COMMITS', value: commit.commits},
	])).join('\n');
	const template       = replaceVariables(getBodyTemplate(!(pulls.length + commits.length)), [
		{key: 'MERGES', value: pullsTemplate},
		{key: 'COMMITS', value: commitTemplate},
	]);

	logger.startProcess('Templates');
	console.log(pullsTemplate);
	console.log(commitTemplate);
	console.log(template);
	logger.endProcess();

	const newBody = transform(prBody, template);
	if (newBody === prBody) {
		logger.info('There is no diff.');
		return true;
	}

	await octokit.pulls.update({
		...context.repo,
		'pull_number': context.payload.number,
		body: newBody,
	});
	logger.info('Updated.');

	return true;
};