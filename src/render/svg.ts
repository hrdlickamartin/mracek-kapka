export function tr(x: number, y: number, rotate = 0, sx = 1, sy = sx) {
  let t = `translate(${x} ${y})`;
  if (rotate) t += ` rotate(${rotate})`;
  if (sx !== 1 || sy !== 1) t += ` scale(${sx} ${sy})`;
  return t;
}
