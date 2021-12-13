import os from 'os'
import * as core from '@actions/core'
import {Octokit} from '@octokit/rest'

function getArch(): 'amd64' | '386' | 'arm64' | 'armv7' {
  const arch = os.arch()
  core.debug(`arch is ${arch}`)
  switch (arch) {
    case 'arm':
      return 'armv7'
    case 'arm64':
      return 'arm64'
    case 'x64':
      return 'amd64'
    case 'x32':
    case 'ia-32':
      return '386'
    default:
      throw new Error(`Unsupported Architecture: ${arch}`)
  }
}

function getOS(): 'darwin' | 'windows' | 'linux' {
  const platform = os.platform()
  core.debug(`platform is ${platform}`)
  switch (platform) {
    case 'darwin':
      return 'darwin'
    case 'win32':
      return 'windows'
    case 'linux':
      return 'linux'
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

export function getDownloadUrl(version: string): string {
  const os = getOS()
  const arch = getArch()
  const extension = os === 'windows' ? 'zip' : 'tar.gz'
  const url = `https://github.com/bridgecrewio/yor/releases/download/${version}/yor_${version}_${os}_${arch}.${extension}`
  core.debug(`Download url is ${url}`)
  return url
}

export async function getLatestReleaseVersion(): Promise<string> {
  const octokit = new Octokit()
  const response = await octokit.rest.repos.getLatestRelease({
    owner: 'bridgecrewio',
    repo: 'yor'
  })
  if (!response.data.name) throw new Error("Couldn't find latest version!")
  return response.data.name
}
