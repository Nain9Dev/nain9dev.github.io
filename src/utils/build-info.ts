// The commit that produced the build, for the publication receipt of the hero (specs/next-receipts-strip, RC-002).
// GitHub Actions names the commit in GITHUB_SHA; anywhere else git answers. The date is the commit date, so the
// same commit always yields the same receipt. A build that cannot name its commit stops: the site is never
// published without saying which commit it is.
import { execSync } from 'node:child_process';

export interface BuildInfo {
  sha: string;
  shortSha: string;
  date: string;
}

const git = (command: string): string => {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};

export function buildInfo(): BuildInfo {
  const sha = process.env.GITHUB_SHA?.trim() || git('git rev-parse HEAD');
  if (!/^[0-9a-f]{40}$/.test(sha)) {
    throw new Error('Publication receipt: the commit being built could not be resolved (GITHUB_SHA or git rev-parse HEAD).');
  }
  const date = git(`git show -s --format=%cs ${sha}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Publication receipt: the date of commit ${sha} could not be resolved (git show -s --format=%cs).`);
  }
  return { sha, shortSha: sha.slice(0, 7), date };
}
