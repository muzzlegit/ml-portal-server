class AuthDTO {
  static toRegisterDTO(model) {
    return {
      id: model?._id ?? "",
      email: model?.email ?? "",
      createdAt: model?.createdAt ?? "",
    };
  }
  static toLoginDTO(model) {
    return {
      id: model?._id ?? "",
      email: model?.email ?? "",
      userColor: model?.userColor ?? "#FFF",
      userIcon: model?.userIcon ?? "",
      createdAt: model?.createdAt ?? "",
    };
  }
}

module.exports = AuthDTO;
