import type { PullsInfo } from '../types';
import type { Context } from '@actions/github/lib/context';
import type { Octokit } from '@technote-space/github-action-helper/dist/types';
export declare const getMergedPulls: (octokit: Octokit, context: Context) => Promise<Array<PullsInfo>>;
