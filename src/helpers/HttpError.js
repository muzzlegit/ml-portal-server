const errorMessages = {
  402: "Bad Request",
  403: "Not authorized",
  406: "Not Found",
  401: "Email in use",
};

const HttpError = (status, message = errorMessages[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;
