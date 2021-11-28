const findOtherEnd = (members, userId) => {
  const otherEnd = members.find((m) => m._id !== userId);

  return otherEnd;
};
export default findOtherEnd;
