export function rotateMatrix(matrix) {
  var result = [];
  matrix.forEach(function (a, i, aa) {
    a.forEach(function (b, j) {
      result[j] = result[j] || [];
      result[j][aa.length - i - 1] = b;
    });
  });
  return result;
}
