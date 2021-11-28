export default function trimText(text, length = 30) {
  if (!text || text.length <= length) {
    return text;
  }

  return `${text.substr(0, length)}...`;
}
