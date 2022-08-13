import { Figure } from './Figure.js';
import { rotateMatrix } from './rotateMatrix.js';
import { calculateElements } from './utils.js';

/**
 *
 * [1, 1]
 * [0, 1]
 *
 */

const defaultElement = [
  [1, 1],
  [0, 1],
];

export class Figure1 extends Figure {
  constructor(size, position, element) {
    super();
    this.size = size;
    this.position = position;
    this.element = JSON.parse(JSON.stringify(defaultElement)); // element || defaultElement

    this.totalSize = {
      x: size * this.element[0].length,
      y: size * this.element.length,
    };

    this.elements = calculateElements(this.element, this.size);
  }

  rotate = () => {
    return rotateMatrix(JSON.parse(JSON.stringify(this.element)));
  };

  updateElement = (element) => {
    this.element = element;
    this.elements = this.calculateElements();
    super.updateTotalSize();
  };

  calculateElements = (element = this.element) => {
    return calculateElements(element, this.size);
  };

  render(noWrap) {
    return super.render(noWrap, 'f f1');
  }
}
