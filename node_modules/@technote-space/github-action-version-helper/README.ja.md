# Github Action Version Helper

[![npm version](https://badge.fury.io/js/%40technote-space%2Fgithub-action-version-helper.svg)](https://badge.fury.io/js/%40technote-space%2Fgithub-action-version-helper)
[![CI Status](https://github.com/technote-space/github-action-version-helper/workflows/CI/badge.svg)](https://github.com/technote-space/github-action-version-helper/actions)
[![codecov](https://codecov.io/gh/technote-space/github-action-version-helper/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/github-action-version-helper)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/github-action-version-helper/badge)](https://www.codefactor.io/repository/github/technote-space/github-action-version-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/github-action-version-helper/blob/master/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

GitHub Actions 用のバージョンヘルパー

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [使用方法](#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
  - [Commit](#commit)
  - [Version](#version)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 使用方法
1. インストール
   * npm  
   `npm i @technote-space/github-action-version-helper`
   * yarn  
   `yarn add @technote-space/github-action-version-helper`
1. 使用
```typescript
import { Commit, Version } from '@technote-space/github-action-version-helper';
```

### Commit
```typescript
import { Commit } from '@technote-space/github-action-version-helper';

...

const types = ['feat', 'chore'];
const excludeMessages = ['trigger workflow'];
const breakingChangeNotes = ['BREAKING CHANGE'];
const commits = await Commit.getCommits(types, excludeMessages, breakingChangeNotes, octokit, context);

/**
例：__tests__/fixtures/commit.list2.json
[
	{
		'type': 'chore',
		'message': 'tweaks',
		'normalized': 'chore: tweaks',
		'original': 'chore: tweaks',
		'children': [],
		'notes': [],
		'sha': '2dcb09b5b57875f334f61aebed695e2e4193db5e',
	},
	{
		'type': 'feat',
		'message': 'add new features',
		'normalized': 'feat: add new features',
		'original': 'feat!: add new features',
		'children': [
			{
				'type': 'feat',
				'message': 'add new feature1 (#123)',
				'normalized': 'feat: add new feature1 (#123)',
				'original': 'feat: add new feature1 (#123)',
			},
			{
				'type': 'feat',
				'message': 'add new feature2 (#234)',
				'normalized': 'feat: add new feature2 (#234)',
				'original': 'feat: add new feature2 (#234)',
			},
		],
		'notes': ['BREAKING CHANGE: changed'],
		'sha': '3dcb09b5b57875f334f61aebed695e2e4193db5e',
	},
	{
		'type': 'feat',
		'message': 'add new feature3',
		'normalized': 'feat: add new feature3',
		'original': 'feat :  add new feature3',
		'children': [],
		'notes': [],
		'sha': '4dcb09b5b57875f334f61aebed695e2e4193db5e',
	},
	{
		'type': 'chore',
		'message': 'tweaks',
		'normalized': 'chore: tweaks',
		'original': 'chore: tweaks',
		'children': [],
		'notes': [],
		'sha': '9dcb09b5b57875f334f61aebed695e2e4193db5e',
	},
]
**/
```

### Version
```typescript
import { Version } from '@technote-space/github-action-version-helper';

...

const minorUpdateCommitTypes = ['feat'];
const excludeMessages = ['tweaks'];
const breakingChangeNotes = ['BREAKING CHANGE'];
const version = await Version.getNextVersion(minorUpdateCommitTypes, excludeMessages, breakingChangeNotes, helper, octokit, context);

/**
例：__tests__/fixtures/repos.git.matching-refs.json, __tests__/fixtures/commit.list3.json
v2.1.0
**/
```

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
