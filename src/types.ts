export type CommitItemInfo = Readonly<{
	message: string;
	commits: string;
	original: string;
	isChild: boolean;
}>

export type PullsInfo = Readonly<{
	author: string;
	title: string;
	number: number;
}>
