#!/usr/bin/env node

import simpleGit from "simple-git";
import { resolve } from "path";
import {
  REPO_BASE_DIR,
  REPOS_TO_UPGRADE,
  DEPENDENCIES_TO_UPGRADE,
  BRANCH_NAME,
} from "../inputs.js";
import { executeCommand } from "../utils.js";

function getDependencyNameFromUrl(url) {
  const match = url.match(/\/(?<name>[^/]+)\/version\/[^/]+\/package\.tgz$/);
  if (!match) {
    throw new Error(`URL does not match the expected pattern: ${url}`);
  }
  const { name: dependencyName } = match.groups;

  return dependencyName;
}

function getRepoPath(repoName) {
  return resolve(REPO_BASE_DIR, `streamotion-web-${repoName}-widgets`);
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
  return executeCommand(repoPath, `npm install ${dependenciesToUpgrade} -f`);
}

async function commit(git) {
  await git.add(["package.json", "package-lock.json"]);
  await git.commit("update dependencies");
}

async function pushBranch(git) {
  await git.push("origin", BRANCH_NAME, { "--set-upstream": null });
  console.log(`Pushed branch: ${BRANCH_NAME}`);
}

function pushQA(repoName) {
  return executeCommand(getRepoPath(repoName), "git push-qa");
}

async function upgradeRepo(repoName) {
  try {
    const git = await openRepo(repoName);
    await switchBranch(git);
    await upgradeDependencies(repoName);
    await commit(git);
    await Promise.all([pushBranch(git), pushQA(repoName)]);

    console.log(
      `✅ Dependency upgrade completed successfully for ${repoName}!`
    );
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

function main() {
  Promise.all(REPOS_TO_UPGRADE.map(upgradeRepo));
}

main();
