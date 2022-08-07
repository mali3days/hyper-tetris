import { renderMatrix } from './renderMatrix.js';
import { generateId } from './utils.js';

export class Figure {
  constructor() {
    this.setId();
  }

  setId() {
    this.id = generateId.next().value;
  }

  updatePosition(position) {
    this.position = position;
    return this;
  }

  getMaxY() {
    return Math.max(...this.elements.map((element) => element.y));
  }

  getMaxX() {
    return Math.max(...this.elements.map((element) => element.x));
  }

  getMinX() {
    return Math.min(...this.elements.map((element) => element.x));
  }

  render(noWrap, className) {
    if (noWrap) {
      return `${renderMatrix(
        this.element,
        this.size,
        {
          x: this.position.x,
          y: this.position.y,
        },
        className
      )}`;
    }

    return `
    <g id="${this.id}" class="${className}" data-y=${this.position.y} transform="translate(${
      this.position.x
    }, ${this.position.y})">
        ${renderMatrix(this.element, this.size)}
    </g>`;
  }
}
