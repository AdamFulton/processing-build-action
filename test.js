const fs = require('fs');

fs.readFile('./output.txt', 'utf8', (err, data) => {
  if (err) {

    
    console.error(err);
    return;
  }

  if (!data.includes("Finished")) {
  

  console.log(getFileName(data));
  console.log(getLineNumber(data));
  console.log(getMessage(data));
  } else {
    console.log("Finished")
  }
});

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