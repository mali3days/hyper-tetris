export function calculateElements(matrix, size) {
  return matrix.reduce((acc, column, idxC) => {
    column.forEach((row, idxR) => {
      if (row) acc.push({ x: row * size * idxR, y: row * size * idxC });
    });

    return acc;
  }, []);
}
