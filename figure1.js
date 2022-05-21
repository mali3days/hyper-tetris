/**
 *
 *    ///\\\
 *    \\\///
 */

import { STEP } from './index.js';

export function figure1({ size, position }) {
  return {
    size: {
      x: size * 2,
      y: size * 2,
    },
    elements: [
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
    ],
    element: `
        <g class="f1" transform="translate(${position.x}, ${position.y})">
            <rect
                width="${size}"
                height="${size}"
            />

            <rect
                width="${size}"
                height="${size}"
                x="${STEP}"
            />
            <rect
                width="${size}"
                height="${size}"
                x="${STEP}"
                y="${STEP}"
            />
        </g>`,
  };
}
{
  /* <rect
width="${size}"
height="${size}"
y="20"
/> */
}
