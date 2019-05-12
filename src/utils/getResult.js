module.exports = () => {
  return value => {
    return new Promise(resolve => {
      resolve(JSON.parse(value).result);
    });
  };
};
