const createRegisterUserDTO = ({ _id, email, createdAt }) => {
  return {
    id: _id || "",
    email: email || "",
    createdAt: createdAt || "",
  };
};

const createLoginUserDTO = ({ _id, email, userColor, userIcon, createdAt }) => {
  return {
    id: _id || "",
    email: email || "",
    userColor: userColor || "#FFF",
    userIcon: userIcon || "",
    createdAt: createdAt || "",
  };
};

module.exports = { createRegisterUserDTO, createLoginUserDTO };
