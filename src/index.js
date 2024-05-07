const core = require("@actions/core");
const github = require("@actions/github");
const { constructAnnotationsAsync } = require("./processingHelper.js");

const projectInputPath = core.getInput("path-input");

createAnnotations();

/**
 * Creates annotations for the errors that occurred during the build process
 * @async
 * @returns {void}
 * @throws {Error} - Throws an error if the build process fails
 */
async function createAnnotations() {
  let errors = await constructAnnotationsAsync(projectInputPath);

  for (const error of errors) {
    try {
      const token = core.getInput("repo-token");
      const octokit = github.getOctokit(token);

      // call octokit to create a check with annoation details
      const check = await octokit.rest.checks.create({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        name: "proccesing-build-checker",
        head_sha: github.context.sha,
        status: "completed",
        conclusion: "failure",
        output: {
          title: "proccesing-build-checker Report",
          summary: "proccesing-build-checker Failed",
          annotations: [
            {
              path: error.path,
              start_line: parseInt(error.line),
              end_line: parseInt(error.line),
              annotation_level: "failure",
              message: error.message,
            },
          ],
        },
      });

      core.setFailed(
        `proccesing-build-checker Failed due to: ${error.message} at ${error.path}:${error.line}`
      );
    } catch (error) {
      console.error(error);
    }
  }
}
