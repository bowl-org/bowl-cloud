function generateMessage(isFailed, message) {
  let statusMessage = isFailed ? "FAILURE" : "SUCCESS";
  return { status: statusMessage, msg: message };
}

module.exports = {generateMessage};
