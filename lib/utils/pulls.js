"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMergedPulls = void 0;
const github_action_helper_1 = require("@technote-space/github-action-helper");
const github_action_version_helper_1 = require("@technote-space/github-action-version-helper");
const misc_1 = require("./misc");
const getMergedPulls = async (octokit, context) => {
    const types = misc_1.getCommitTypes();
    const exclude = misc_1.getExcludeMessages();
    const isFilter = misc_1.isFilterPulls();
    const pulls = await octokit.paginate(octokit.rest.pulls.list, {
        ...context.repo,
        base: github_action_helper_1.Utils.getPrBranch(context),
        state: 'closed',
    });
    return (isFilter ?
        pulls
            .map((item) => ({ ...item, ...github_action_version_helper_1.Misc.parseCommitMessage(item.title, types, exclude, []) }))
            .filter((item) => typeof item.type === 'string')
            .sort((item1, item2) => types.indexOf(item1.type) - types.indexOf(item2.type)) :
        pulls)
        .filter(item => !!item.merged_at)
        .map((item) => ({
        author: github_action_helper_1.Utils.ensureNotNull(github_action_helper_1.Utils.objectGet(item.user, 'login')),
        title: item.title,
        number: item.number,
    }));
};
exports.getMergedPulls = getMergedPulls;
