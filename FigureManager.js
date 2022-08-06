import { Figure1 } from './Figure1.js';
import { Figure2 } from './Figure2.js';
import { Figure3 } from './Figure3.js';
import { getRandomNumber } from './utils.js';

const FIGURES = [Figure1, Figure2, Figure3];

const size = 20;

const POSITION = {
  0: { x: 1 * size, y: 1 * size },
  1: { x: 1 * size, y: 4 * size },
  2: { x: 1 * size, y: 7 * size },
};

export class FigureManager {
  figures;

  constructor() {
    this.figures = [];

    this.figures.push(
      new FIGURES[getRandomNumber(FIGURES.length)](size, POSITION[0])
    );
    this.figures.push(
      new FIGURES[getRandomNumber(FIGURES.length)](size, POSITION[1])
    );
    this.figures.push(
      new FIGURES[getRandomNumber(FIGURES.length)](size, POSITION[2])
    );
  }

  create(position) {
    const figureToCreate = this.figures.shift().updatePosition(position);

    this.figures.push(
      new FIGURES[getRandomNumber(FIGURES.length)](size, POSITION[2])
    );

    this.renderNextFigures();

    return figureToCreate;
  }

  renderNextFigures = () => {
    const nextFiguresElement = document.getElementById('next-figures');

    nextFiguresElement.innerHTML = `
        <svg
            width="${20 * 6}"
            height="${20 * 10}"
            xmlns="http://www.w3.org/2000/svg"
        >
          ${this.figures.map((figure, index) =>
            figure.updatePosition(POSITION[index]).render()
          )}
        </svg>
      `;
  };
}
