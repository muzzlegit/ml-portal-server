const createRegisterUserDTO = ({ _id, email, createdAt }) => {
  return {
    id: _id || "",
    email: email || "",
    createdAt: createdAt || "",
  };
};

module.exports = { createRegisterUserDTO };
