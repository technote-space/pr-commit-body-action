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
const github_action_helper_1 = require("@technote-space/github-action-helper");
const github_action_version_helper_1 = require("@technote-space/github-action-version-helper");
const misc_1 = require("./misc");
exports.getCommitItems = (octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    const types = misc_1.getCommitTypes();
    const exclude = misc_1.getExcludeMessages();
    const maxNumber = misc_1.getMaxCommitNumber();
    return (yield github_action_version_helper_1.Commit.getCommits(types, exclude, [], octokit, context))
        .sort((item1, item2) => types.indexOf(item1.type) - types.indexOf(item2.type))
        .reduce((acc, item) => {
        const target = acc.find(element => element.type === item.type && element.message === item.message);
        if (target) {
            target.commits.push(item.sha);
            target.children.push(...item.children);
        }
        else {
            acc.push(Object.assign(Object.assign({}, item), { commits: [item.sha], children: item.children }));
        }
        return acc;
    }, [])
        .reduce((acc, item) => {
        acc.push(Object.assign(Object.assign({}, item), { message: `${item.type}: ${item.message}`, isChild: false }));
        acc.push(...github_action_helper_1.Utils.uniqueArray(item.children).map(child => ({
            message: child.normalized,
            original: child.original,
            isChild: true,
            commits: item.commits,
        })));
        return acc;
    }, [])
        .map(item => ({
        message: item.message,
        commits: item.commits.slice(0, maxNumber).join(', ') + `${item.commits.length > maxNumber ? ', ...' : ''}`,
        original: item.original,
        isChild: item.isChild,
    }));
});
