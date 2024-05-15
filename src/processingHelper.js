const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
/**
 * Finds all Processing sketches in a directory
 * @param {string} dir - The directory to search
 * @param {Array} sketchPaths - The array to store the paths of the Processing sketches
 * @returns {Set} - A set of paths to Processing sketches
 */
function findProcessingSketches(dir, sketchPaths = new Set()) {
  const files = fs.readdirSync(dir);
  let foundPDEFile = false; 

  for (const file of files) {
    const filePath = path.join(dir, file);

    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      findProcessingSketches(filePath, sketchPaths);
    } else if (file.endsWith(".pde")) {
        foundPDEFile = true;
    }

    if (foundPDEFile) {
    sketchPaths.add(dir);
  }
  }
  return sketchPaths;
}

/**
 * Builds Processing sketches using the processing-java command
 * @param {Set} sketches - A set of paths to Processing sketches
 * @returns {Array} - An array of errors that occurred during the build process
 * @async
 */
async function buildProcessingAsync(sketches) {
  let errors = [];

  for (const sketch of sketches) {
    const command = `processing-java --sketch="${sketch}" --build`;

    try {
      await execPromise(command);
    } catch (error) {
      errors.push({
        message: error.stderr,
        cmd: error.cmd,
        path: sketch
      });
    }
  }

  return errors;
}
/**
 * Constructs annotations for the errors that occurred during the build process
 * @param {Array} errors - An array of errors that occurred during the build process
 * @returns {Array} - An array of annotations for the errors that occurred during the build process
 * @async
 */
async function ConstructAnnotationsAsync(rootPath) {
  const files = findProcessingSketches(rootPath);

  let retval = [];

  try {
    const errors = await buildProcessingAsync(files);

    for (const error of errors) {
      if (error.message.includes("Not a valid sketch folder")) { 
        continue;
      }
     
    

       retval.push({
        message: getMessage(error.message),
        path: path,
        line: getLineNumber(error.message)
        }); 
      
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }

  return retval;
}

/**
 * Parses the error message from the processing-java command to extract the line number
 * @param {string} error - The error message from the processing-java command
 * @returns {number} - The line number where the error occurred
 */
function getLineNumber(error) {
  retval = error.split(":");

  return retval[1];
}

/**
 * Parses the error message from the processing-java command to extract the sketch path
 * @param {string} cmd - The command that was run to build the Processing sketch that containts the sketch path
 * @returns {string} - The path to the Processing sketch
 */
function getSketchPath(path) {
  retval = path.split("project_code/");
  return retval[1];
}

/**
 * Parses the error message from the processing-java command to extract the file name
 * @param {string} error - The error message from the processing-java command
 * @returns {string} - The file name where the error occurred
 */
function getFileName(error) {
  retval = error.split(":");

  return retval[0];
}

/**
 * Parses the error message from the processing-java command to extract the error message
 * @param {string} error - The error message from the processing-java command
 * @returns {string} - The error message that occurred
 */
function getMessage(error) {
  retval = error.split(":");
  if (retval.length > 6) {
    return retval[5] + retval[6];
  }
  return retval[5];
}
result = getSketchPath("/project_code/something/something/something")
console.log(result);