export function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

export function calculateElements(matrix, size) {
  return matrix.reduce((acc, column, columnIdx) => {
    column.forEach((row, rowIdx) => {
      if (row) acc.push({ x: size * rowIdx, y: size * columnIdx });
    });

    return acc;
  }, []);
}

function* idGenerator() {
  var index = 0;
  while (true) yield index++;
}

export const generateId = idGenerator();
