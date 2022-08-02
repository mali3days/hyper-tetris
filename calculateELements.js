export function calculateElements(matrix, size) {
  return matrix.reduce((acc, column, columnIdx) => {
    column.forEach((row, rowIdx) => {
      if (row) acc.push({ x: size * rowIdx, y: size * columnIdx });
    });

    return acc;
  }, []);
}
