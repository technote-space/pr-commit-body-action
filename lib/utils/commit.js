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
const misc_1 = require("./misc");
const MERGE_MESSAGE = /^Merge pull request #\d+ /;
// <type>(<scope>): <subject>
// @see https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716#semantic-commit-messages
const SEMANTIC_MESSAGE = /^(.+?)\s*(\(.+?\)\s*)?:\s*(.+?)$/;
const parseCommitMessage = (message, types, exclude) => {
    const target = message.trim().replace(/\r?\n|\r/g, ' ');
    const matches = target.match(SEMANTIC_MESSAGE);
    if (!matches || !types.includes(matches[1]) || exclude.includes(matches[3].toLowerCase())) {
        return {};
    }
    return {
        type: matches[1],
        message: matches[3],
        raw: message,
    };
};
exports.getCommitMessages = (octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    const types = misc_1.getCommitTypes();
    const exclude = misc_1.getExcludeMessages();
    return (yield octokit.paginate(octokit.pulls.listCommits.endpoint.merge(Object.assign(Object.assign({}, context.repo), { 'pull_number': context.payload.number })))).filter((item) => !MERGE_MESSAGE.test(item.commit.message)).map((item) => (Object.assign({ sha: item.sha }, parseCommitMessage(item.commit.message, types, exclude))));
});
exports.getCommitItems = (octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    const types = misc_1.getCommitTypes();
    const maxNumber = misc_1.getMaxCommitNumber();
    return (yield exports.getCommitMessages(octokit, context))
        .filter(item => item.type)
        .map(item => item)
        .reduce((acc, item) => {
        const target = acc.find(element => element.type === item.type && element.message === item.message);
        if (target) {
            target.commits.push(item.sha);
        }
        else {
            acc.push(Object.assign(Object.assign({}, item), { commits: [item.sha] }));
        }
        return acc;
    }, [])
        .sort((item1, item2) => types.indexOf(item1.type) - types.indexOf(item2.type))
        .map(item => ({
        message: `${item.type}: ${item.message}`,
        commits: item.commits.slice(0, maxNumber).join(', ') + `${item.commits.length > maxNumber ? ', ...' : ''}`,
        raw: item.raw,
    }));
});
