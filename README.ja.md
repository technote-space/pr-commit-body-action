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

- [スクリーンショット](#%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88)
  - [自動生成された本文](#%E8%87%AA%E5%8B%95%E7%94%9F%E6%88%90%E3%81%95%E3%82%8C%E3%81%9F%E6%9C%AC%E6%96%87)
- [使用方法](#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
- [Options](#options)
  - [CHANGE_TEMPLATE](#change_template)
  - [COMMIT_TEMPLATE](#commit_template)
  - [MAX_COMMITS](#max_commits)
  - [TEMPLATE](#template)
  - [COMMIT_TYPES](#commit_types)
  - [EXCLUDE_MESSAGES](#exclude_messages)
  - [TITLE](#title)
  - [NO_ITEMS](#no_items)
  - [LINK_ISSUE_KEYWORD](#link_issue_keyword)
  - [FILTER_PR](#filter_pr)
- [Action イベント詳細](#action-%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E8%A9%B3%E7%B4%B0)
  - [対象イベント](#%E5%AF%BE%E8%B1%A1%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## スクリーンショット
### 自動生成された本文
![pr-body](https://raw.githubusercontent.com/technote-space/pr-commit-body-action/images/pr-body.png)

このプルリクエストの本文の一部（赤で囲まれている箇所）は、マージされたPR（緑で囲まれている箇所）とコミット（青で囲まれている箇所）によって自動的に生成されています。

## 使用方法
1. ワークフローを設定  
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
            uses: technote-space/pr-commit-body-action@v1
    ```
1. 以下のコメントを含むプルリクエストを作成
    ```markdown
    <!-- START pr-commits -->
    <!-- END pr-commits -->
    ```

## Options
| name | description | default | required | e.g. |
|:---:|:---|:---:|:---:|:---:|
|CHANGE_TEMPLATE|マージされたプルリク用テンプレート|`* ${TITLE} (#${NUMBER}) @${AUTHOR}`| |`- ${TITLE}`|
|COMMIT_TEMPLATE|コミット用テンプレート|`* ${MESSAGE} (${COMMITS})`| |`- ${MESSAGE}`|
|MAX_COMMITS|最大コミット表示数|`5`| |`3`|
|TEMPLATE|テンプレート|`${MERGES}`<br>`${COMMITS}`<br>`${BREAKING_CHANGES}`|true|`${MERGES}`|
|COMMIT_TYPES|コミットタイプ|`feat, fix, build, ci, docs, style, perf, refactor, test, chore`|true|`feat, fix, chore`|
|EXCLUDE_MESSAGES|除外メッセージ| | |`tweaks`|
|TITLE|タイトル| | |`Changes:`|
|NO_ITEMS|アイテムがない時に表示するメッセージ| | |`- no item`|
|LINK_ISSUE_KEYWORD|プルリクエストを Issue に紐付けるためのキーワード<br>このオプションが設定されている場合、この値が Issue 参照に付与されます。<br>(例：` #234` => ` closes #123`)| | |`closes`|
|FILTER_PR|Semantic message のルールでプルリクエストをフィルタするかどうか|`false`| |`true`|
|GITHUB_TOKEN|アクセストークン|`${{github.token}}`|true|`${{secrets.ACCESS_TOKEN}}`|

## Action イベント詳細
### 対象イベント
| eventName | action |
|:---:|:---:|
|pull_request|opened, reopened, synchronize|

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
