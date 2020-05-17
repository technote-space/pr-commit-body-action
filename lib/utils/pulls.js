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
exports.getMergedPulls = void 0;
const github_action_helper_1 = require("@technote-space/github-action-helper");
const github_action_version_helper_1 = require("@technote-space/github-action-version-helper");
const misc_1 = require("./misc");
exports.getMergedPulls = (octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    const types = misc_1.getCommitTypes();
    const exclude = misc_1.getExcludeMessages();
    const isFilter = misc_1.isFilterPulls();
    const pulls = yield octokit.paginate(octokit.pulls.list.endpoint.merge(Object.assign(Object.assign({}, context.repo), { base: github_action_helper_1.Utils.getPrBranch(context), state: 'closed' })));
    return (isFilter ?
        pulls
            .map(item => (Object.assign(Object.assign({}, item), github_action_version_helper_1.Misc.parseCommitMessage(item.title, types, exclude, []))))
            .filter(item => item.type)
            .sort((item1, item2) => types.indexOf(item1.type) - types.indexOf(item2.type)) :
        pulls)
        .filter(item => !!item.merged_at)
        .map((item) => ({
        author: item.user.login,
        title: item.title,
        number: item.number,
    }));
});
