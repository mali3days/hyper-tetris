import { renderMatrix } from './renderMatrix.js';

export class Figure {
  constructor() {}

  render(element) {
    console.log(element);
    return `
    <g class="f1" transform="translate(${this.position.x}, ${this.position.y})">
        ${renderMatrix(element, this.size)}
    </g>`;
  }
}
