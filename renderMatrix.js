export function renderMatrix(
  matrix,
  size,
  { x, y } = { x: 0, y: 0 },
  className
) {
  return matrix.reduce((result, row, rowIdx) => {
    result += row.reduce((acc, column, columnIdx) => {
      if (!column) return acc;
      return (acc += `
            <rect
            data-y=${size * rowIdx + y}
            width="${size}"
            height="${size}"
            x="${size * columnIdx + x}"
            y="${size * rowIdx + y}"
            class="${className}"
            />`);
    }, '');
    return result;
  }, '');
}
