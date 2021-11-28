const findNameInText = (message, user, members) => {
  if (!Object.keys(message || {}).length > 0) return;

  if (!message.text) return;
  const initialText = message.text.replace(
    "userName",
    message.sender === user._id ? "You" : message.senderName
  );
  for (let member of members) {
    if (initialText.includes(member._id)) {
      if (message.contentType.endsWith("changeNickName")) {
        if (member._id === user._id)
          return initialText.replace(member._id, "your");
        if (message.sender === member._id && user._id !== message.sender)
          return initialText.replace(member._id, "their own");
        return initialText.replace(
          member._id,
          `${member?.name || "someone"}'s`
        );
      }
      if (message.contentType.endsWith("adminActions")) {
        if (member._id === user._id && member._id === message.sender)
          return initialText.replace(member._id, "yourself");
        if (member._id === user._id && member._id !== message.sender)
          return initialText.replace(member._id, "you");
        if (message.sender === member._id && user._id !== message.sender)
          return initialText.replace(member._id, "themself");
        return initialText.replace(member._id, `${member?.name || "someone"}`);
      }
    }
    if (initialText.includes(user.name)) {
      return initialText.replace(user.name, "you");
    }
  }
  return initialText;
};
export default findNameInText;
