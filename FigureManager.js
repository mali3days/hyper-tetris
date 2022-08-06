import { Figure1 } from './Figure1.js';
import { Figure2 } from './Figure2.js';
import { Figure3 } from './Figure3.js';
import { getRandomNumber } from './utils.js';
const FIGURES = [Figure1, Figure2, Figure3];

export class FigureManager {
  create(...payload) {
    const nextFigureIndex = getRandomNumber(FIGURES.length);

    return new FIGURES[nextFigureIndex](...payload);
  }
}
