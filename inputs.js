/**
 * The base directory where the repositories are located.
 *
 * @constant {string}
 * @example
 * "/Users/username/Projects"
 */
export const REPO_BASE_DIR = "";

/**
 * An array of repository names to upgrade.
 *
 * @constant {string[]}
 * @example
 * [
 *   "martian",
 *   "ares",
 *   "flash",
 *   "life",
 *   "hawk"
 * ]
 */
export const REPOS_TO_UPGRADE = ["martian", "ares", "flash", "life", "hawk"];

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
export const DEPENDENCIES_TO_UPGRADE = [];

/**
 * The name of the branch to create or switch to.
 *
 * @constant {string}
 * @example
 * "feat/xxx-123-upgrade-dependencies"
 */
export const BRANCH_NAME = "";
