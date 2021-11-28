const joiner = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export default joiner;
