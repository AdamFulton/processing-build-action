const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
/**
 * Finds all Processing sketches in a directory
 * @param {string} dir - The directory to search
 * @param {Array} sketchPaths - The array to store the paths of the Processing sketches
 * @returns {Array} - An array of paths to Processing sketches
 */
function findProcessingSketches(dir,sketchPaths = []) {

    const files = fs.readdirSync(dir);

    for (const file of files) {

        const filePath = path.join(dir, file);

        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {

            findProcessingSketches(filePath,sketchPaths);

        } else if (file.endsWith('.pde')) {

            sketchPaths.push(dir);
        }
    }
    return sketchPaths;
}

async function buildProcessing(sketches) {
    
        let errors = []

        for (const sketch of sketches) {
            const command = `processing-java --sketch=${sketch} --build`;

            try {
               
                await  execPromise(command);
              
            } catch (error) {

                errors.push({
                    message: error.stderr,
                    cmd: error.cmd, 
                })
            }
        }

    return errors;
}