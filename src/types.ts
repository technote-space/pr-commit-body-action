export type CommitInfo = {
	readonly sha: string;
	readonly type?: string;
	readonly message?: string;
}

export type CommitItemInfo = {
	readonly message: string;
	readonly commits: string;
}

export type PullsInfo = {
	readonly author: string;
	readonly title: string;
	readonly number: number;
}
