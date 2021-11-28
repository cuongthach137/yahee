export default function keyBoard(e, key, cbs) {
  if (e.key === key) {
    cbs.forEach((cb) => cb());
  }
}
