# PR Commit Body Action

[![CI Status](https://github.com/technote-space/pr-commit-body-action/workflows/CI/badge.svg)](https://github.com/technote-space/pr-commit-body-action/actions)
[![codecov](https://codecov.io/gh/technote-space/pr-commit-body-action/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/pr-commit-body-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/pr-commit-body-action/badge)](https://www.codefactor.io/repository/github/technote-space/pr-commit-body-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/pr-commit-body-action/blob/master/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

This is a `GitHub Actions` to add commit history to PR body.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Usage](#usage)
- [Options](#options)
  - [CHANGE_TEMPLATE](#change_template)
  - [COMMIT_TEMPLATE](#commit_template)
  - [MAX_COMMITS](#max_commits)
  - [TEMPLATE](#template)
  - [COMMIT_TYPES](#commit_types)
  - [EXCLUDE_MESSAGES](#exclude_messages)
  - [TITLE](#title)
  - [NO_ITEMS](#no_items)
- [Action event details](#action-event-details)
  - [Target events](#target-events)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Screenshots
### Auto generated body
![pr-body](https://raw.githubusercontent.com/technote-space/pr-commit-body-action/images/pr-body.png)

Part of the body of this PR (enclosed in red) is automatically generated by the merged PRs (enclosed in green) and commits (enclosed in blue).

## Usage
1. Setup workflow  
    e.g.
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
            with:
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    ```
1. Create pull request including comment below
    ```markdown
    <!-- START pr-commits -->
    <!-- END pr-commits -->
    ```

## Options
### CHANGE_TEMPLATE
Merge item template.  
default: `'* ${TITLE} (#${NUMBER}) @${AUTHOR}'`  

### COMMIT_TEMPLATE
Commit template.  
default: `'* ${MESSAGE} (${COMMITS})'`  

### MAX_COMMITS
Max number to show commits.  
default: `'5'`  

### TEMPLATE
Template.  
default:
```
${MERGES}
${COMMITS}
```  

### COMMIT_TYPES
Types.  
default: `'feat, fix, docs, style, refactor, test, chore'`  

### EXCLUDE_MESSAGES
Exclude messages.   

### TITLE
Title.  

### NO_ITEMS
Message to show if there are no item.  

### LINK_ISSUE_KEYWORD
A keyword linking a pull request to issue.  
If this options is set, this value is added to issue references (e.g. ` #234` => ` closes #123`)  
default: `'closes'`

### FILTER_PR
Whether to filter pull requests by semantic message rule.  
default: `'false'`

## Action event details
### Target events
| eventName | action |
|:---:|:---:|
|pull_request|opened, reopened, synchronize|

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
