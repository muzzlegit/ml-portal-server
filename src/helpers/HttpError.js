const errorMessages = {
  400: "Bad Request",
  401: "Not authorized",
  404: "Not Found",
  409: "Email in use",
};

const HttpError = (status, message = errorMessages[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;
