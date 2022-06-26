import { Figure } from './Figure.js';
import { rotateMatrix } from './rotateMatrix.js';
import { renderMatrix } from './renderMatrix.js';

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
    this.element = defaultElement; // element || defaultElement

    this.totalSize = {
      x: size * 2,
      y: size * 2,
    };

    this.elements = [
      {
        x: position.x,
        y: position.y,
      },
      {
        x: position.x + this.size,
        y: position.y,
      },
      {
        x: position.x + this.size,
        y: position.y + this.size,
      },
    ];
  }

  rotate() {
    rotateMatrix(this.element);
  }

  render() {
    return `
    <g id="${this.id} "class="f1" transform="translate(${this.position.x}, ${
      this.position.y
    })">
        ${renderMatrix(this.element, this.size)}
    </g>`;
  }
}
