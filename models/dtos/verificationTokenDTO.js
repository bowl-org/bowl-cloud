const mapToVerificationTokenDTO = (verificationTokenData) => {
  try {
    let verificationToken = {
      user_id: verificationTokenData.user_id,
      token: verificationTokenData.token
    };
    return verificationToken;
  } catch (err) {
    throw err;
  }
};
module.exports = {mapToVerificationTokenDTO};
