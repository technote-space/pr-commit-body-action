import type { CommitItemInfo } from '../types';
import type { Context } from '@actions/github/lib/context';
import type { Octokit } from '@technote-space/github-action-helper/dist/types';
export declare const getCommitItems: (octokit: Octokit, context: Context) => Promise<Array<CommitItemInfo>>;
