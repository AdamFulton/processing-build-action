const core = require('@actions/core');
const github = require('@actions/github');


(
    async () => {

        try {

          const token = core.getInput('repo-token');
          const octokit = github.getOctokit(token);
          
            // call octokit to create a check with annoation details 
            const check = await octokit.rest.checks.create({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                name: 'My check',
                head_sha: github.context.sha,
                status: 'completed',
                conclusion: 'failure',
                output: {
                    title: 'My check',
                    summary: 'My check failed', 
                    annotations: [
                        {
                            path: 'Test.pde',
                            start_line: 8,
                            end_line: 8,
                            annotation_level: 'failure',
                            message: 'My check failed'
                        
                        }
                    ]
                }
            });

            
            
        } catch (error) {
            core.setFailed(error.message);
        }
    }
)();