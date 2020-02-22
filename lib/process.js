"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commit_1 = require("./utils/commit");
const misc_1 = require("./utils/misc");
const pulls_1 = require("./utils/pulls");
exports.execute = (logger, octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const prBody = (_b = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.body) !== null && _b !== void 0 ? _b : '';
    if ('' === prBody) {
        return false;
    }
    const pulls = yield pulls_1.getMergedPulls(octokit, context);
    const commits = yield commit_1.getCommitItems(octokit, context);
    const pullTitles = pulls.map(item => item.title);
    const keyword = misc_1.getLinkIssueKeyword();
    logger.startProcess('Pull Requests');
    console.log(pulls);
    logger.startProcess('Commits');
    console.log(commits);
    const pullsTemplate = pulls.map(pull => misc_1.replaceVariables(misc_1.getMergeTemplate(), [
        { key: 'TITLE', value: misc_1.addCloseAnnotation(pull.title, keyword) },
        { key: 'NUMBER', value: String(pull.number) },
        { key: 'AUTHOR', value: pull.author },
    ])).join('\n');
    const commitTemplate = commits.filter(commit => !pullTitles.includes(commit.raw)).map(commit => misc_1.replaceVariables(misc_1.getCommitTemplate(), [
        { key: 'MESSAGE', value: misc_1.addCloseAnnotation(commit.message, keyword) },
        { key: 'COMMITS', value: commit.commits },
    ])).join('\n');
    const template = misc_1.replaceVariables(misc_1.getBodyTemplate(!(pulls.length + commits.length)), [
        { key: 'MERGES', value: pullsTemplate },
        { key: 'COMMITS', value: commitTemplate },
    ]);
    logger.startProcess('Templates');
    console.log(pullsTemplate);
    console.log(commitTemplate);
    console.log(template);
    logger.endProcess();
    const newBody = misc_1.transform(prBody, template);
    if (newBody === prBody) {
        logger.info('There is no diff.');
        return true;
    }
    yield octokit.pulls.update(Object.assign(Object.assign({}, context.repo), { 'pull_number': context.payload.number, body: newBody }));
    logger.info('Updated.');
    return true;
});
