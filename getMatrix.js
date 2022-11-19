export function getMatrix(matrix, size, { x, y } = { x: 0, y: 0 }, className) {
  return matrix.reduce((result, row, rowIdx) => {
    row.forEach((column, columnIdx) => {
      if (!column) return;

      result.push({
        x: size * columnIdx + x,
        y: size * rowIdx + y,
        class: className,
      });
    });
    return result;
  }, []);
}
