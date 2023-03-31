function generateMessage(isFailed, message, data = "") {
  let statusMessage = isFailed ? "FAILURE" : "SUCCESS";
  return { status: statusMessage, msg: message, data: data };
}

module.exports = {generateMessage};
