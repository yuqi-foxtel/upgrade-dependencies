#!/usr/bin/env node

const { execSync } = require("child_process");
const simpleGit = require("simple-git");
const path = require("path");

/**
 * The base directory where the repositories are located.
 *
 * @constant {string}
 * @example
 * "/Users/username/Projects"
 */
const REPO_BASE_DIR = "";

/**
 * An array of repository names to upgrade.
 *
 * @constant {string[]}
 * @example
 * [
 *   "martian",
 *   "ares",
 *   "flash",
 *   "life"
 * ]
 */
const REPOS_TO_UPGRADE = ["martian", "ares", "flash", "life"];
/**
 * An array of URLs pointing to the dependencies that need to be upgraded.
 * Each URL corresponds to a specific package version.
 *
 * @constant {string[]}
 * @example
 * [
 *  "https://web.kayosports.com.au/streamotion-web-app/player-abc/version/xyz/package.tgz",
 * ]
 */
const DEPENDENCIES_TO_UPGRADE = [];
/**
 * The name of the branch to create or switch to.
 *
 * @constant {string}
 * @example
 * "feat/xxx-123-upgrade-dependencies"
 */
const BRANCH_NAME = "";

function getDependencyNameFromUrl(url) {
  const match = url.match(/\/(?<name>[^/]+)\/version\/[^/]+\/package\.tgz$/);
  if (!match) {
    throw new Error(`URL does not match the expected pattern: ${url}`);
  }
  const { name: dependencyName } = match.groups;

  return dependencyName;
}

function getRepoPath(repoName) {
  return path.resolve(REPO_BASE_DIR, `streamotion-web-${repoName}-widgets`);
}

async function openRepo(repoName) {
  const repoPath = getRepoPath(repoName);
  const git = simpleGit();
  await git.cwd({ path: repoPath, root: true });

  return git;
}

async function switchBranch(git) {
  await git.checkout("main");
  await git.pull();

  const branches = await git.branchLocal();
  if (branches.all.includes(BRANCH_NAME)) {
    await git.checkout(BRANCH_NAME);
    console.log(`Switched to existing branch: ${BRANCH_NAME}`);
  } else {
    await git.checkoutLocalBranch(BRANCH_NAME);
    console.log(`Switched to new branch: ${BRANCH_NAME}`);
  }
}

function upgradeDependencies(repoName) {
  const repoPath = getRepoPath(repoName);
  const dependenciesToUpgrade = DEPENDENCIES_TO_UPGRADE.reduce(
    (result, dependencyUrl) => {
      const dependencyName = getDependencyNameFromUrl(dependencyUrl);
      result.push(`@fsa-streamotion/${dependencyName}@${dependencyUrl}`);

      return result;
    },
    []
  ).join(" ");

  console.log(`Upgrading ${dependenciesToUpgrade} in ${repoPath}...`);
  execSync(`npm install ${dependenciesToUpgrade} -f`, {
    cwd: repoPath,
    stdio: "inherit",
  });
}

async function commit(git) {
  await git.add(["package.json", "package-lock.json"]);
  await git.commit("update dependencies");
}

async function remoteBranchExists(git) {
  const branches = await git.branch(["-r"]);
  return branches.all.includes(`origin/${BRANCH_NAME}`);
}

async function pushBranch(git) {
  await git.push("origin", BRANCH_NAME, { "--set-upstream": null });
  console.log(`Pushed branch: ${BRANCH_NAME}`);
}

async function upgradeRepo(repoName) {
  try {
    const git = await openRepo(repoName);
    await switchBranch(git);
    upgradeDependencies(repoName);
    await commit(git);
    if (!(await remoteBranchExists(git))) await pushBranch(git);

    console.log(
      `✅ Dependency upgrade completed successfully for ${repoName}!`
    );
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

function main() {
  REPOS_TO_UPGRADE.forEach(upgradeRepo);
}

main();
