import {Context} from '@actions/github/lib/context';
import {Octokit} from '@technote-space/github-action-helper/dist/types';
import {Utils} from '@technote-space/github-action-helper';
import {Misc} from '@technote-space/github-action-version-helper';
import {PaginateInterface} from '@octokit/plugin-paginate-rest';
import {RestEndpointMethods} from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import {
  PullsListResponseData,
} from '@octokit/types';
import {getCommitTypes, getExcludeMessages, isFilterPulls} from './misc';
import {PullsInfo} from '../types';

export const getMergedPulls = async(octokit: Octokit, context: Context): Promise<Array<PullsInfo>> => {
  const types                        = getCommitTypes();
  const exclude                      = getExcludeMessages();
  const isFilter                     = isFilterPulls();
  const pulls: PullsListResponseData = await (octokit.paginate as PaginateInterface)(
    (octokit as RestEndpointMethods).pulls.list,
    {
      ...context.repo,
      base: Utils.getPrBranch(context),
      state: 'closed',
    },
  );

  type PullsItem = PullsListResponseData[number] & { type?: string }
  return (
    isFilter ?
      pulls
        .map((item: PullsListResponseData[number]): PullsItem => ({...item, ...Misc.parseCommitMessage(item.title, types, exclude, [])}))
        .filter((item): item is Required<PullsItem> => typeof item.type === 'string')
        .sort((item1, item2) => types.indexOf(item1.type) - types.indexOf(item2.type)) :
      pulls
  )
    .filter(item => !!item.merged_at)
    .map((item: PullsListResponseData[number]): PullsInfo => ({
      author: item.user.login,
      title: item.title,
      number: item.number,
    }));
};
