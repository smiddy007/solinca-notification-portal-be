const axios = require("axios");
const HttpError = require("../models/http-error");
const HttpStatusCode = require("./http-status-code");
const { CONNECTION_ERROR, AUTHENTICATION_OPEN_AIR_URL, SOLINCA_AUTH_ERROR } = require("./constants");
const logger = require("./logger");
const getUserById = require("./get-user");

const solincaOpenAirAuth = async (userId) => {
  try {
    const user = await getUserById(userId, "solincaAuth", CONNECTION_ERROR("solinca"));
    const response = await axios.post(AUTHENTICATION_OPEN_AIR_URL, null, {
      headers: {
        Authorization: `Basic ${user.solincaAuth}`,
      },
    });
    user.solincaOpenAirAuthToken = response.data.token;
    await user.save();
    return response.data.token;
  } catch (error) {
    logger.error(SOLINCA_AUTH_ERROR(error));
    throw new HttpError(
      error.message || CONNECTION_ERROR("solinca"),
      error.code || HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = solincaOpenAirAuth;
