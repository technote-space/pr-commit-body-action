"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const github_action_helper_1 = require("@technote-space/github-action-helper");
const commit_1 = require("./utils/commit");
const misc_1 = require("./utils/misc");
const pulls_1 = require("./utils/pulls");
const execute = async (logger, octokit, context) => {
    var _a, _b;
    const prBody = (_b = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.body) !== null && _b !== void 0 ? _b : '';
    if ('' === prBody) {
        return false;
    }
    const pulls = await pulls_1.getMergedPulls(octokit, context);
    const commits = await commit_1.getCommitItems(octokit, context);
    const pullTitles = pulls.map(item => item.title);
    const keyword = misc_1.getLinkIssueKeyword();
    logger.startProcess('Pull Requests');
    console.log(pulls);
    logger.startProcess('Commits');
    console.log(commits);
    const pullsTemplate = (await Promise.all(pulls.map(async (pull) => await github_action_helper_1.Utils.replaceVariables(misc_1.getMergeTemplate(), [
        { key: 'TITLE', replace: misc_1.addCloseAnnotation(pull.title, keyword) },
        { key: 'NUMBER', replace: String(pull.number) },
        { key: 'AUTHOR', replace: pull.author },
    ])))).filter(item => item).join('\n');
    const commitTemplate = (await Promise.all(commits.filter(commit => !pullTitles.includes(commit.original) && !commit.isNotes).map(async (commit) => await github_action_helper_1.Utils.replaceVariables(commit.isChild ? misc_1.getChildCommitTemplate() : misc_1.getCommitTemplate(), [
        { key: 'MESSAGE', replace: misc_1.addCloseAnnotation(commit.message, keyword) },
        { key: 'COMMITS', replace: commit.commits },
    ])))).filter(item => item).join('\n');
    const notesTemplate = (await Promise.all(commits.filter(commit => commit.isNotes).map(async (commit) => await github_action_helper_1.Utils.replaceVariables(misc_1.getBreakingChangeTemplate(), [
        { key: 'MESSAGE', replace: misc_1.addCloseAnnotation(commit.message, keyword) },
        { key: 'COMMITS', replace: commit.commits },
    ])))).join('\n');
    const template = await github_action_helper_1.Utils.replaceVariables(misc_1.getBodyTemplate(!(pulls.length + commits.length)), [
        { key: 'MERGES', replace: pullsTemplate },
        { key: 'COMMITS', replace: commitTemplate },
        { key: 'BREAKING_CHANGES', replace: notesTemplate },
    ]);
    logger.startProcess('Templates');
    console.log(pullsTemplate);
    console.log(commitTemplate);
    console.log(notesTemplate);
    console.log(template);
    logger.endProcess();
    const newBody = misc_1.transform(prBody, template);
    if (newBody === prBody) {
        logger.info('There is no diff.');
        return true;
    }
    await octokit.rest.pulls.update({
        ...context.repo,
        'pull_number': context.payload.number,
        body: newBody,
    });
    logger.info('Updated.');
    return true;
};
exports.execute = execute;
