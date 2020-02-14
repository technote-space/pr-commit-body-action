export type CommitInfo = {
	readonly sha: string;
	readonly type?: string;
	readonly message?: string;
	readonly raw?: string;
}

export type CommitItemInfo = {
	readonly message: string;
	readonly commits: string;
	readonly raw: string;
}

export type PullsInfo = {
	readonly author: string;
	readonly title: string;
	readonly number: number;
}
