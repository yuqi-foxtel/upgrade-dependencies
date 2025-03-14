# Upgrade Dependencies

A script to upgrade dependencies for web widget repositories.

## Getting Started

To get started with upgrading dependencies, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/upgrade-dependencies.git
   cd upgrade-dependencies
   ```

2. Install the required dependencies:

   ```sh
   npm install
   ```

3. Set input variables in [script](scripts/index.js):

   ```sh
   const REPO_BASE_DIR = '/path/to/your/repositories';
   const REPOS_TO_UPGRADE = ["martian","ares", "flash", "life"];
   const DEPENDENCIES_TO_UPGRADE = ["https://web.kayosports.com.au/streamotion-web-app/player-abc/version/xyz/package.tgz"];
   const BRANCH_NAME = "feat/xxx-123-upgrade-dependencies"
   ```

4. Run the upgrade script:
   ```sh
   npm start
   ```
