import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import { Logger, Utils } from '@technote-space/github-action-helper';
import { getCommitItems } from './utils/commit';
import {
	getBodyTemplate,
	getCommitTemplate,
	getChildCommitTemplate,
	getMergeTemplate,
	getBreakingChangeTemplate,
	transform,
	addCloseAnnotation,
	getLinkIssueKeyword,
} from './utils/misc';
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

	const pullsTemplate  = (await Promise.all(pulls.map(async pull => await Utils.replaceVariables(getMergeTemplate(), [
		{key: 'TITLE', replace: addCloseAnnotation(pull.title, keyword)},
		{key: 'NUMBER', replace: String(pull.number)},
		{key: 'AUTHOR', replace: pull.author},
	])))).filter(item => item).join('\n');
	const commitTemplate = (await Promise.all(commits.filter(commit => !pullTitles.includes(commit.original) && !commit.isNotes).map(async commit => await Utils.replaceVariables(commit.isChild ? getChildCommitTemplate() : getCommitTemplate(), [
		{key: 'MESSAGE', replace: addCloseAnnotation(commit.message, keyword)},
		{key: 'COMMITS', replace: commit.commits},
	])))).filter(item => item).join('\n');
	const notesTemplate  = (await Promise.all(commits.filter(commit => commit.isNotes).map(async commit => await Utils.replaceVariables(getBreakingChangeTemplate(), [
		{key: 'MESSAGE', replace: addCloseAnnotation(commit.message, keyword)},
		{key: 'COMMITS', replace: commit.commits},
	])))).join('\n');
	const template       = await Utils.replaceVariables(getBodyTemplate(!(pulls.length + commits.length)), [
		{key: 'MERGES', replace: pullsTemplate},
		{key: 'COMMITS', replace: commitTemplate},
		{key: 'BREAKING_CHANGES', replace: notesTemplate},
	]);

	logger.startProcess('Templates');
	console.log(pullsTemplate);
	console.log(commitTemplate);
	console.log(notesTemplate);
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
