# PR Commit Body Action

[![CI Status](https://github.com/technote-space/pr-commit-body-action/workflows/CI/badge.svg)](https://github.com/technote-space/pr-commit-body-action/actions)
[![codecov](https://codecov.io/gh/technote-space/pr-commit-body-action/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/pr-commit-body-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/pr-commit-body-action/badge)](https://www.codefactor.io/repository/github/technote-space/pr-commit-body-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/pr-commit-body-action/blob/master/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

プルリクエスト本文にコミット履歴を追加する`GitHub Actions`です。

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [使用方法](#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
- [Options](#options)
  - [CHANGE_TEMPLATE](#change_template)
  - [COMMIT_TEMPLATE](#commit_template)
  - [MAX_COMMITS](#max_commits)
  - [TEMPLATE](#template)
  - [COMMIT_TYPES](#commit_types)
- [Action イベント詳細](#action-%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E8%A9%B3%E7%B4%B0)
  - [対象イベント](#%E5%AF%BE%E8%B1%A1%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 使用方法
例：
```yaml
on:
  pull_request:
    types: [opened, synchronize]

name: Pull Request updated

jobs:
  history:
    name: Pull Request Body
    runs-on: ubuntu-latest
    if: startsWith(github.event.pull_request.head.ref, 'release/')
    steps:
      - name: Pull Request Body
        uses: technote-space/get-git-comment-action@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Options
### CHANGE_TEMPLATE
マージされたプルリク用テンプレート  
default: `'* ${TITLE} (#${NUMBER}) @${AUTHOR}'`  

### COMMIT_TEMPLATE
コミット用テンプレート  
default: `'* ${MESSAGE} (${COMMITS})'`  

### MAX_COMMITS
最大コミット表示数  
default: `'5'`  

### TEMPLATE
テンプレート  
default:
```
${MERGES}
${COMMITS}
```  

### COMMIT_TYPES
コミットタイプ  
default: `'feat, fix, docs, style, refactor, test, chore'`  

## Action イベント詳細
### 対象イベント
| eventName | action |
|:---:|:---:|
|pull_request|opened, reopened, synchronize|

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
