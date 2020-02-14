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
exports.getMergedPulls = (octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield octokit.paginate(octokit.pulls.list.endpoint.merge(Object.assign(Object.assign({}, context.repo), { base: github_action_helper_1.Utils.getPrBranch(context) })))).map((item) => ({
        author: item.user.login,
        title: item.title,
        number: item.number,
    }));
});
