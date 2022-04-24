import { Context } from '@actions/github/lib/context';
import { components } from '@octokit/openapi-types';
import { Utils } from '@technote-space/github-action-helper';
import { Octokit } from '@technote-space/github-action-helper/dist/types';
import { Misc } from '@technote-space/github-action-version-helper';
import { PullsInfo } from '../types';
import { getCommitTypes, getExcludeMessages, isFilterPulls } from './misc';

type PullsListResponseData = components['schemas']['pull-request-simple'];

export const getMergedPulls = async(octokit: Octokit, context: Context): Promise<Array<PullsInfo>> => {
  const types                               = getCommitTypes();
  const exclude                             = getExcludeMessages();
  const isFilter                            = isFilterPulls();
  const pulls: Array<PullsListResponseData> = await octokit.paginate(
    octokit.rest.pulls.list,
    {
      ...context.repo,
      base: Utils.getPrBranch(context),
      state: 'closed',
    },
  );

  type PullsItem = PullsListResponseData & { type?: string }
  return (
    isFilter ?
      pulls
        .map((item: PullsListResponseData): PullsItem => ({ ...item, ...Misc.parseCommitMessage(item.title, types, exclude, []) }))
        .filter((item): item is Required<PullsItem> => typeof item.type === 'string')
        .sort((item1, item2) => types.indexOf(item1.type) - types.indexOf(item2.type)) :
      pulls
  )
    .filter(item => !!item.merged_at)
    .map((item: PullsListResponseData): PullsInfo => ({
      author: Utils.ensureNotNull(Utils.objectGet(item.user, 'login')),
      title: item.title,
      number: item.number,
    }));
};
