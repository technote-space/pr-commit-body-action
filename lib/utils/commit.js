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
exports.getCommitMessages = (types, exclude, octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield octokit.paginate(octokit.pulls.listCommits.endpoint.merge(Object.assign(Object.assign({}, context.repo), { 'pull_number': context.payload.number }))))
        .filter((item) => !MERGE_MESSAGE.test(item.commit.message))
        .map((item) => item.commit.message.split('\n').filter(message => message).map(message => (Object.assign({ sha: item.sha }, misc_1.parseCommitMessage(message, types, exclude)))))
        .reduce((acc, items) => acc.concat(items));
});
exports.getCommitItems = (octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    const types = misc_1.getCommitTypes();
    const exclude = misc_1.getExcludeMessages();
    const maxNumber = misc_1.getMaxCommitNumber();
    return (yield exports.getCommitMessages(types, exclude, octokit, context))
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
