const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');


const fileInputPath = core.getInput('file-input');
const projectInputPath = core.getInput('project-input');
checkIfFileExists(fileInputPath);
const errorArray = [];
fs.readFile(fileInputPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
  
    errorArray.push(getFileName(data));
    errorArray.push(getLineNumber(data));
    errorArray.push(getMessage(data));
    createAnnotations(errorArray, projectInputPath);

  });
  
   



function checkIfFileExists(file) {

    if (!fs.existsSync(file)) {
        core.setFailed(`File not found: ${fileInputPath}`);
        return;
    }
}

function createAnnotations(errors, filePath) {

    

        try {

          const token = core.getInput('repo-token');
          const octokit = github.getOctokit(token);
          
            // call octokit to create a check with annoation details 
            const check = await octokit.rest.checks.create({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                name: 'proccesing-build-checker',
                head_sha: github.context.sha,
                status: 'completed',
                conclusion: 'failure',
                output: {
                    title: 'proccesing-build-checker Report',
                    summary: 'proccesing-build-checker Failed', 
                    annotations: [
                        {
                            path: filePath + "/" + errors[0],
                            start_line: errors[1],
                            end_line: errors[1],
                            annotation_level: 'failure',
                            message: errors[2]
                        
                        }
                    ]
                }
            });

            
            
        } catch (error) {
            core.setFailed(error.message);
        }
    }

function getFileName(error) {


    retval = error.split(":");
  
    return retval[0].split("\n")[1];
}

function getLineNumber(error) {

    retval = error.split(":");
   

    return retval[1] - 1;
}
function getMessage(error) {

    retval = error.split(":");
    if (retval.length > 6) {
        return retval[5] + retval[6];
    }
    return retval[5];
}
