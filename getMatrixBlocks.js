export function getMatrixBlocks(matrix, { x, y } = { x: 0, y: 0 }, className) {
  return matrix.reduce((result, row, rowIdx) => {
    result.push(
      ...row.reduce((acc, column, columnIdx) => {
        if (!column) return acc;

        acc.push({
          x: columnIdx + x / 20,
          y: (20 * rowIdx + y) / 20,
          class: className,
        });

        return acc;
      }, [])
    );
    return result;
  }, []);
}
