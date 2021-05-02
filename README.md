[![Maintained by Bridgecrew.io](https://img.shields.io/badge/maintained%20by-bridgecrew.io-blueviolet)](https://bridge.dev/2WBms5Q)
[![slack-community](https://slack.bridgecrew.io/badge.svg)](https://slack.bridgecrew.io/?utm_source=github&utm_medium=organic_oss&utm_campaign=checkov-action)

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
      - name: Commit tag changes
        uses: stefanzweifel/git-auto-commit-action@v4
```

Note that this example uses the latest version (`main`).

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
        with:
          directory: path/to/iac
          skip_directory: test
          log_level: DEBUG
          tag: git_modifiers,git_commit,git_repository,yor_trace
          tag_groups: git,code2cloud
          custom_tags: path/to/plugin.so
          output_format: json
      - name: Commit tag changes
        uses: stefanzweifel/git-auto-commit-action@v4
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
        with:
          directory: path/to/iac
          skip_directory: test
          log_level: DEBUG
          skip_tags: git_modifiers,git_commit,git_repository
          tag_groups: git
          custom_tags: path/to/plugin.so
          output_format: json
      - name: Commit tag changes
        uses: stefanzweifel/git-auto-commit-action@v4
```
