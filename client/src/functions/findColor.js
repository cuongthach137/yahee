const poteColor = {
  little: "#3ecefc",
  xm: "#00a99d",
  vm: "#91c44d",
  m: "#ebc750",
  s: "#f7d373",
  vs: "#e27c2a",
  is: "#ab3726",
};

export default function findColor(pote) {
  switch (pote) {
    case "Little To Minimal":
      return poteColor.little;
    case "Mild":
      return poteColor.m;
    case "Very Mild":
      return poteColor.vm;
    case "Extremely Mild":
      return poteColor.xm;
    case "Strong":
      return poteColor.s;
    case "Very Strong":
      return poteColor.vs;
    default:
      return poteColor.is;
  }
}
