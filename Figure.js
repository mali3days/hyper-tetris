import { renderMatrix } from './renderMatrix.js';
import { generateId } from './generateId.js';

export class Figure {
  constructor() {
    this.setId();
  }

  setId() {
    this.id = generateId.next().value;
  }

  // render(element) {
  //   console.log(element);
  //   return `
  //   <g class="f1" transform="translate(${this.position.x}, ${this.position.y})">
  //       ${renderMatrix(element, this.size)}
  //   </g>`;
  // }
}
