import { Figure } from './Figure.js';
import { rotateMatrix } from './rotateMatrix.js';
import { renderMatrix } from './renderMatrix.js';
import { calculateElements } from './calculateElements.js';

/**
 *
 * [1, 1, 1, 1],
 *
 */

const defaultElement = [
  [1, 1, 1, 1],
];

export class Figure3 extends Figure {
  constructor(size, position, element) {
    super();
    this.size = size;
    this.position = position;
    this.element = JSON.parse(JSON.stringify(defaultElement)); // element || defaultElement

    this.totalSize = {
      x: size * 4,
      y: size * 1,
    };

    this.elements = calculateElements(this.element, this.size);
  }

  // TODO: rename method?!
  rotate = () => {
    return rotateMatrix(JSON.parse(JSON.stringify(this.element)));
  };

  updateElement = (element) => {
    this.element = element;
    this.elements = this.calculateElements();
  };

  calculateElements = (element = this.element) => {
    return calculateElements(element, this.size);
  };

  render() {
    return `
    <g id="${this.id} "class="f3" transform="translate(${this.position.x}, ${
      this.position.y
    })">
        ${renderMatrix(this.element, this.size)}
    </g>`;
  }
}
