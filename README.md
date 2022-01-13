[![Maintained by Bridgecrew.io](https://img.shields.io/badge/maintained%20by-bridgecrew.io-blueviolet)](https://bridge.dev/2WBms5Q)
[![slack-community](https://img.shields.io/badge/Slack-4A154B?style=plastic&logo=slack&logoColor=white)](https://slack.bridgecrew.io/)

# Yor GitHub action

This GitHub Action runs [Yor](https://github.com/bridgecrewio/yor) against an Infrastructure-as-Code repository.
Yor applies tags to your infrastructure allowing easier governance, ownership and visibility.

## Example usage

### Simple Example
```yaml
jobs:
  yor-job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Run yor action
        uses: bridgecrewio/yor-action@main
```

Note that this example uses the latest version (`main`).
and that fetch-depth: 0 on checkout is required for yor
```yaml
        with:
          fetch-depth: 0
```
### Complex Examples
#### Using tag + tag_groups Parameters
```yaml
jobs:
  yor-job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Run yor action
        uses: bridgecrewio/yor-action@main
        env:
          LOG_LEVEL: DEBUG
        with:
          version: 0.1.129
          directory: path/to/iac
          skip_directory: test
          tag: git_modifiers,git_commit,git_repository,yor_trace
          tag_groups: git,code2cloud
          custom_tags: path/to/plugin.so
          output_format: json
```

#### Using skip_tags + tag_groups Parameters
```yaml
jobs:
  yor-job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Run yor action
        uses: bridgecrewio/yor-action@main
        env:
          LOG_LEVEL: DEBUG
        with:
          directory: path/to/iac
          skip_directory: test
          skip_tags: git_modifiers,git_commit,git_repository
          tag_groups: git
          custom_tags: path/to/plugin.so
          output_format: json
      - name: Commit tag changes
        uses: stefanzweifel/git-auto-commit-action@v4
```
#### Committing at your own timing instead of right after the tags were updated:
```yaml
jobs:
  yor-job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Run yor action
        uses: bridgecrewio/yor-action@main
        with:
          commit_changes: false
```
