export default function capitalize(str) {
  return str
    .split(" ")
    .map((i) =>
      i[0] === i[0].toUpperCase() ? i : i[0].toUpperCase() + i.slice(1)
    )
    .join(" ");
}
