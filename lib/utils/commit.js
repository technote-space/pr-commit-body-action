"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitItems = void 0;
const github_action_helper_1 = require("@technote-space/github-action-helper");
const github_action_version_helper_1 = require("@technote-space/github-action-version-helper");
const misc_1 = require("./misc");
const getCommitItems = async (octokit, context) => {
    const types = (0, misc_1.getCommitTypes)();
    const maxNumber = (0, misc_1.getMaxCommitNumber)();
    return (await github_action_version_helper_1.Commit.getCommits(types, (0, misc_1.getExcludeMessages)(), (0, misc_1.getBreakingChangeNotes)(), octokit, context))
        .map(item => item)
        .sort((item1, item2) => types.indexOf(item1.type) - types.indexOf(item2.type))
        .reduce((acc, item) => {
        const target = acc.find(element => element.type === item.type && element.message === item.message);
        if (target) {
            target.commits.push(item.sha);
            target.children.push(...item.children);
        }
        else {
            acc.push({
                ...item,
                commits: [item.sha],
                children: item.children,
                notes: item.notes,
            });
        }
        return acc;
    }, [])
        .reduce((acc, item) => {
        acc.push({
            ...item,
            message: `${item.type}: ${item.message}`,
            isChild: false,
            isNotes: false,
        });
        acc.push(...github_action_helper_1.Utils.uniqueArray(item.children).map(child => ({
            message: child.normalized,
            original: child.original,
            commits: item.commits,
            isChild: true,
            isNotes: false,
        })));
        acc.push(...github_action_helper_1.Utils.uniqueArray(item.notes).map(notes => ({
            message: notes,
            original: notes,
            commits: item.commits,
            isChild: false,
            isNotes: true,
        })));
        return acc;
    }, [])
        .map(item => ({
        message: item.message,
        commits: item.commits.slice(0, maxNumber).join(', ') + `${item.commits.length > maxNumber ? ', ...' : ''}`,
        original: item.original,
        isChild: item.isChild,
        isNotes: item.isNotes,
    }));
};
exports.getCommitItems = getCommitItems;
