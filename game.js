import { FigureManager } from './FigureManager.js';

const RENDER_TIME = 1000;
export const STEP = 20;
const GAME_SIZE_W = 10;
const GAME_SIZE_H = 20;
const GAME_SIZE_W_PX = GAME_SIZE_W * STEP;
const GAME_SIZE_H_PX = GAME_SIZE_H * STEP;

class Game {
  figure;
  figures;
  board;
  position;
  isGameOver;
  isPaused;

  constructor(figureManager) {
    this.figureManager = figureManager;
  }

  start = () => {
    console.log('start');
    this.figures = [];
    this.board = [];
    this.isGameOver = false;

    this._resetPosition();
    this._createGameLoop();
    this._registerEventListeners();
  };

  update = (position) => {
    if (!this.figure) this._setFigure();

    this._updateFigurePosition(position);
    this._renderGame();
  };

  stop() {
    // this.isGameOver = true;
    // this._resetPosition();
    console.log('STOP');
    console.log('Create new figure');
    console.log(this.figure);
    this.figures.push(this.figure);
    this.board.push(this.figure.render(true));
    this.deleteCompletedLines(this.figure);
    // TODO: Implement storing rectangles to the board canvas
    // as we need to strike a line if it is empty
    // TIP: remember about border of the figure
    this._resetPosition();
    this._setFigure();
  }

  deleteCompletedLines = (figure) => {
    setTimeout(() => {
      // TODO: check if some line is finished
      console.log('figure: ', figure);
      console.log('figures: ', this.figures);
      console.log('figures: ', this.size);
      // getCTM()

      const { position, totalSize } = figure;

      const completedLines = [];
      let elemtnsInLine;
      for (let i = position.y; i < position.y + totalSize.y; i += figure.size) {
        elemtnsInLine = document.querySelectorAll(`[data-y='${i}']`);

        if (elemtnsInLine.length === GAME_SIZE_W) {
          completedLines.push(i);
        }
      }

      if (completedLines.length > 0) {
        // alert('DELETE ' + completedLines.join(', ') + ' LINE(S)');
        // TODO: delete completed lines
        const svgContainer = document.getElementsByTagName('svg')[0];
        elemtnsInLine.forEach((el) => svgContainer.removeChild(el));
      }
    });
  };

  _resetPosition = () => {
    this.position = { x: 0, y: 0 };
  };

  _updateFigurePosition = (position) => {
    const { isValid, skipMove } = this._validatePosition(position, this.figure);

    if (!isValid) {
      if (skipMove) return;
      return this.stop();
    }

    if (position) {
      if (this.position.x + position.x < 0) return;

      if (position.x) this.position.x += position.x;
      if (position.y) this.position.y += position.y;
    }
  };

  _validatePosition = (position = {}, figure) => {
    let isValid = true;
    let skipMove = false;

    if (this._elementsIntersect(position, figure)) {
      if (position.x !== 0 && !position.y) {
        isValid = false;
        skipMove = true;
      } else if (this.position.x === 0 && this.position.y === 0) {
        this.isGameOver = true;
      } else {
        isValid = false;
      }
    }

    // width collision
    const maxXposition = this.position.x + figure.getMaxX() + this.figure.size;
    const widthCollision1 = position.x > 0 && maxXposition === GAME_SIZE_W_PX;
    const widthCollision2 = maxXposition > GAME_SIZE_W_PX;
    if (widthCollision1 || widthCollision2) {
      isValid = false;
      skipMove = true;
    }

    // height collision
    const maxYposition = this.position.y + figure.getMaxY() + this.figure.size;
    const heightCollision1 = position.y > 0 && maxYposition === GAME_SIZE_H_PX;
    const heightCollision2 = maxYposition > GAME_SIZE_H_PX;
    if (heightCollision1 || heightCollision2) {
      isValid = false;
    }

    return { isValid, skipMove };
  };

  _setFigure = () => {
    this.figure = this.figureManager.create(this.position);
  };

  rotate = () => {
    const rotatedElem = this.figure.rotate();
    const figureToCheck = {
      ...this.figure,
      element: rotatedElem,
      elements: this.figure.calculateElements(rotatedElem),
      __proto__: this.figure.__proto__,
    };

    const { isValid } = this._validatePosition({}, figureToCheck);

    if (isValid) {
      this.figure.updateElement(rotatedElem);
      this.update();
    } else {
      console.log('NON VALID ROTATE');
      // this.pause(); // TODO: remove later!
    }
  };

  _renderGame = () => {
    const boardElement = document.getElementById('board');

    boardElement.innerHTML = `
        <svg
            width="${GAME_SIZE_W_PX}"
            height="${GAME_SIZE_H_PX}"
            xmlns="http://www.w3.org/2000/svg"
        >
            ${this.figure.render(true)}
            ${this.figures.map((figure) => figure.render(true))}
        </svg>
      `;
  };

  _createGameLoop = () => {
    let start = null;
    const gameLoop = async (timestamp) => {
      if (this.isGameOver) {
        const shouldRestart = window.confirm('GAME OVER. Try again?');

        if (shouldRestart) {
          // TODO: restart logic
        } else {
          // TODO: show dead game?!
        }

        return;
      }

      if (this.isPaused) {
        start = null;
      }

      if (start === null) start = timestamp;
      let progress = timestamp - start;

      if (progress > RENDER_TIME) {
        this.update({ y: STEP });
        start = timestamp;
      }
      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  };

  pause = async () => {
    this.isPaused = true;
  };

  resume = () => {
    this.isPaused = false;
  };

  // TODO: use or delete
  // kill = () => {
  //   document.getElementById('wrapper').innerHTML = '';
  // }

  addDebugDot = (x, y) => {
    document.getElementsByTagName('svg')[0].innerHTML += `
      <g id="debug" style="fill: red" class="f1" x=${x}, y=${y}">
        <rect width="20" height="20" x="0" y="0"></rect>  
      </g>
    `;
  };

  _elementsIntersect = (position, figureToCheck) => {
    const { x = 0, y = 0 } = position;

    return this.figures.find((figure) => {
      return figure.elements.some((element) => {
        return figureToCheck.elements.some((figureElement) => {
          const figureElementXWeWant =
            figureToCheck.position.x + figureElement.x + x;
          const figureElementYWeWant =
            figureToCheck.position.y + figureElement.y + y;

          const elementXWeHave = figure.position.x + element.x;
          const elementYWeHave = figure.position.y + element.y;

          if (
            figureElementXWeWant === elementXWeHave &&
            figureElementYWeWant === elementYWeHave
          ) {
            // TODO: remove later
            this.addDebugDot(figureElementXWeWant, figureElementYWeWant);

            return true;
          }

          return false;
        });
      });
    });
  };

  elementFromPoint(x, y) {
    const coordToCheck = { x: 0, y: 380 };
  }

  _registerEventListeners = () => {
    const rotateBtnElement = document.getElementById('btn-rotate');
    const restartBtnElement = document.getElementById('btn-restart');
    const pauseResumeBtnElement = document.getElementById('btn-pause_resume');

    rotateBtnElement.addEventListener('click', this.rotate);

    restartBtnElement.addEventListener('click', () => {
      // TODO: implement restart logic
      // this.kill();
      // new Game().start();
    });

    pauseResumeBtnElement.addEventListener('click', async () => {
      if (this.isPaused) {
        this.resume();
      } else {
        this.pause();
      }
    });

    document.body.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        this.update({ y: STEP });
      }

      if (event.key === 'ArrowUp') {
        this.rotate();
      }

      if (event.key === 'ArrowRight') {
        this.update({ x: STEP });
      }

      if (event.key === 'ArrowLeft') {
        this.update({ x: -STEP });
      }
    });
  };
}

new Game(new FigureManager()).start();
