function generateMessage(isFailed, message) {
  let statusMessage = isFailed ? "FAILED" : "SUCCESS";
  return { status: statusMessage, msg: message };
}

module.exports = {generateMessage};
