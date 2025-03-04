import path from 'path'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import * as utils from './utils'

function getArgs(flag: string, input: string): string[] {
  const value = core.getInput(input)
  if (value) return [flag, value]
  return []
}

async function run(): Promise<void> {
  const githubRef =
    process.env.GITHUB_EVENT_NAME === 'pull_request'
      ? process.env.GITHUB_HEAD_REF
      : process.env.GITHUB_REF_NAME
  await exec.exec(`git switch --detach ${githubRef}`)
  const yorVersion = core.getInput('version')
  const commitChanges = core.getBooleanInput('commit_changes')

  // Computing args
  const yorArgs: string[] = [
    'tag',
    getArgs('-d', 'directory'),
    getArgs('--tag-groups', 'tag_groups'),
    getArgs('--tags', 'tags'),
    getArgs('--skip-tags', 'skip_tags'),
    getArgs('--skip-dirs', 'skip_dirs'),
    getArgs('--skip-resource-types', 'skip_resource_types'),
    getArgs('--custom-tagging', 'custom_tags'),
    getArgs('--output', 'output_format'),
    getArgs('--config-file', 'config_file'),
    getArgs('--skip-resources', 'skip_resources'),
    getArgs('--parsers', 'parsers'),
    getArgs('--tag-prefix', 'tag_prefix'),
    getArgs('--tag-local-modules', 'tag_local_modules')
  ].flat()

  // Downloading Yor
  const yorExactVersion =
    yorVersion === 'latest' ? await utils.getLatestReleaseVersion() : yorVersion
  const downloadUrl = utils.getDownloadUrl(yorExactVersion)
  const pathToTarball = await tc.downloadTool(downloadUrl)
  const extractFn = downloadUrl.endsWith('.zip') ? tc.extractZip : tc.extractTar
  const pathToCLI = await extractFn(pathToTarball)

  // Executing Yor
  const pathToYor = path.join(pathToCLI, 'yor')
  await exec.exec(pathToYor, ['-v'])
  const exitCode = await exec.exec(pathToYor, yorArgs)

  if (exitCode > 0) {
    core.setFailed(`Yor failed with ${exitCode}`)
    return
  }

  // Commit Changes if needed
  const gitStatus = await exec.getExecOutput(
    'git status -s --untracked-files=no'
  )
  if (!gitStatus.stdout && !gitStatus.stderr) {
    core.info('Nothing has changed')
    return
  }

  if (!commitChanges) {
    core.debug('Commit Change disabled, nothing to do')
    return
  }

  core.info('Yor made changes, committing')
  await exec.exec('git add .')
  await exec.exec(
    'git -c user.name=actions@github.com -c user.email="GitHub Actions" \
    commit -m "Update tags (by Yor)" \
    --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>"'
  )
  core.info('Changes committed, pushing...')
  await exec.exec('git push origin')
}

run()
