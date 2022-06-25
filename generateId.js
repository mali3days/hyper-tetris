function* idMaker() {
  var index = 0;
  while (true) yield index++;
}

export const generateId = idMaker();