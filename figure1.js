/**
 *
 *    ///\\\
 *    \\\///
 */

import { STEP } from './index.js';

export class Figure1 {
  constructor(size, position) {
    this.size = size;
    this.position = position;

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
        x: position.x + STEP,
        y: position.y,
      },
      {
        x: position.x + STEP,
        y: position.y + STEP,
      },
    ];
  }

  rotate() {
    console.log('ROTATE FIG 1');
    console.log(this);
  }

  get element() {
    return `
      <g class="f1" transform="translate(${this.position.x}, ${this.position.y})">
          <rect
              width="${this.size}"
              height="${this.size}"
          />

          <rect
              width="${this.size}"
              height="${this.size}"
              x="${STEP}"
          />
          <rect
              width="${this.size}"
              height="${this.size}"
              x="${STEP}"
              y="${STEP}"
          />
      </g>`;
  }
}
