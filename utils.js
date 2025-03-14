import { exec } from "child_process";

export function executeCommand(cwd, command) {
  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        cwd: cwd,
      },
      (error) => {
        if (error) {
          reject(new Error(`Exec ${command} in ${cwd} error: ${error}`));
        } else {
          console.log(`Exec ${command} in ${cwd} successfully!`);

          resolve();
        }
      }
    );
  });
}
