const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('8자리 이상의 비밀번호를 입력하세요');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('최소한 1자리의 영문과 1자리의 숫자로 이뤄져야 합니다.');
  }
  return value;
};

module.exports = {
  objectId,
  password,
};
