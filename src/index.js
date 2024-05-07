const core = require("@actions/core");
const github = require("@actions/github");
const {ConstructAnnotationsAsync} = require("./processingHelper.js");

const projectInputPath = core.getInput("path-input");

createAnnotations();

/**
 * Creates annotations for the errors that occurred during the build process
 * @async
 * @returns {void}
 * @throws {Error} - Throws an error if the build process fails
 */
async function createAnnotations() {
    
  let errors = await ConstructAnnotationsAsync(projectInputPath);

    
        if (errors.length === 0) {

            return;
        }

        const annotations = errors.map((error) => {
            return {
                path: error.path,
                start_line: parseInt(error.line),
                end_line: parseInt(error.line),
                annotation_level: "warning",
                message: error.message,
            };
        }
        );

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
        conclusion: "neutral",
        output: {
          title: "proccesing-build-checker Report",
          summary: "proccesing-build-checker Failed",
          annotations: annotations
        },

      });
  
    } catch (error) {
      console.error(error);
    }
}

