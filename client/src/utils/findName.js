const findName = (personId, currentUserId, conversation, isSideBar) => {
  if (isSideBar) {
    if (personId === currentUserId) return "You";

    return conversation.members.find((p) => p._id === personId)?.name;
  }
  if (personId === currentUserId) return "yourself";

  return conversation.members.find((p) => p._id === personId).name;
};

export default findName;
