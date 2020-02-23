export type CommitInfo = Readonly<{
	sha: string;
	type?: string;
	message?: string;
	raw?: string;
}>

export type CommitItemInfo = Readonly<{
	message: string;
	commits: string;
	raw: string;
}>

export type PullsInfo = Readonly<{
	author: string;
	title: string;
	number: number;
}>
