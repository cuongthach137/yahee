const delayedTransition = (functions, setLoading, multi = 1) => {
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
    functions.forEach((f) => f());
  }, 600 * multi);
};

export default delayedTransition;
