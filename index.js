const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const exec = require('@actions/exec');


const fileInputPath = core.getInput('file-input');

const command = "./processing-java " +  "--sketch=" + fileInputPath + " --build";

exec.exec(command, (error, stdout, stderr) => {
    if (error) {
  
    
       const errorArray = []
      
      console.error(`${error}`);
      core.setFailed(error.message.toString());
     const errorParts = error.toString().split('\n');
     
     
      errorArraypush.push(getFileName(errorParts[1]));
      errorArray.push(getLineNumber(errorParts[1]));
      errorArray.push(getMessage(errorParts[1]));
      createAnnotations(errorArray, file);
  
      return;
    }
  
    // Print the output
    console.log(stdout);
  });



function checkIfFileExists(file) {

    if (!fs.existsSync(file)) {
        core.setFailed(`File not found: ${fileInputPath}`);
    }
}

function createAnnotations(errors, filePath) {

    async () => {

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
}
function getFileName(error) {


    retval = error.split(":");
  
    return retval[0];
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
