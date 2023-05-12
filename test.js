const fs = require('fs');

fs.readFile('./output.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(getFileName(data));
  console.log(getLineNumber(data));
  console.log(getMessage(data));
});

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