export function renderMatrix(matrix, size) {
  return matrix.reduce((result, row, rowIdx) => {
    result += row.reduce((acc, column, columnIdx) => {
      if (!column) return acc;
      return (acc += `
            <rect
                width="${size}"
                height="${size}"
                x="${size * columnIdx}"
                y="${size * rowIdx}"
            />`);
    }, '');
    return result;
  }, '');

  return result;
}
