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

- [Setup](#setup)
  - [yarn](#yarn)
  - [npm](#npm)
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
