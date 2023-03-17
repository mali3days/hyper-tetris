import { FigureManager } from './FigureManager.js';

const RENDER_TIME = 1000;
export const STEP = 20;
const GAME_SIZE_W = 10;
const GAME_SIZE_H = 20;
const GAME_SIZE_W_PX = GAME_SIZE_W * STEP;
const GAME_SIZE_H_PX = GAME_SIZE_H * STEP;

class Game {
  figure;
  board;
  position;
  isGameOver;
  isPaused;
  gameRequestAnimationFrame;

  constructor(figureManager) {
    this.figureManager = figureManager;
  }

  start = () => {
    console.log('start');
    this.board = this.createBoardMatrix();
    this.isGameOver = false;

    this._resetPosition();
    this._createGameLoop();
    this._registerEventListeners();
  };

  createBoardMatrix = () => {
    function Matrix(w, h) {
      var matrix = [];
      for (var i = 0; i < h; i++) {
        matrix[i] = [];
        for (var j = 0; j < w; j++) {
          matrix[i][j] = { class: 'w' };
        }
      }

      return matrix;
    }

    return {
      value: Matrix(GAME_SIZE_W, GAME_SIZE_H),
      apply(blocks) {
        blocks.forEach((block) => {
          this.value[block.y][block.x] = {
            x: block.x,
            y: block.y,
            class: block.class,
          };
        });
      },
      removeRow(rowNumber) {
        this.value = this.value.filter((_row, index) => index !== rowNumber);
        this.value.unshift(Matrix(GAME_SIZE_W, GAME_SIZE_H)[0]);
      },
      removeRows(rows) {
        rows.forEach(this.removeRow.bind(this));
      },
      render() {
        const size = 20;
        return this.value.reduce((result, row, rowIdx) => {
          result += row.reduce((acc, column, columnIdx) => {
            if (!column) return acc;
            return (acc += `
                  <rect
                  data-y=${size * rowIdx}
                  width="${size}"
                  height="${size}"
                  x="${size * columnIdx}"
                  y="${size * rowIdx}"
                  class="${column.class}"
                  />`);
          }, '');
          return result;
        }, '');
      },
    };
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
    // console.log(this.figure);
    // console.log(this.figure.render);
    // console.log(this.figure.render(true));
    console.log(this.figure.getBlocks(true));
    console.log(this.board.value);
    console.log(this.board.apply(this.figure.getBlocks(true)));
    console.log(this.board.value);
    // this.board.push(this.figure.render(true)); // TODO: push figure coords to the matrix coords (this.board which is N * M matrix)
    this.deleteCompletedLines(this.figure);
    this._resetPosition();
    this._setFigure();
  }

  deleteCompletedLines = (figure) => {
      const figureBlocks = figure.getBlocks(true);

      const boardRowsToDelete = [...new Set(figureBlocks.filter((fBlock) => {
        return this.board.value[fBlock.y].every((boardRow) => boardRow.hasOwnProperty('x'));
      }).map(fBlock => fBlock.y))];

      this.board.removeRows(boardRowsToDelete)
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
            ${this.board.render(true)}
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
      this.gameRequestAnimationFrame = requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  };

  pause = async () => {
    this.isPaused = true;
  };

  resume = () => {
    this.isPaused = false;
  };

  restart = () => {
    new Game(new FigureManager()).start();
  }

  // TODO: use or delete
  kill = () => {
    document.getElementById('wrapper').innerHTML = '<div id="board"></div><div id="next-figures"></div>';
    document.getElementById('next-figures').innerHTML = ''; // TODO: check this! Maybe not needed
    cancelAnimationFrame(this.gameRequestAnimationFrame);
  }

  addDebugDot = (x, y) => {
    document.getElementsByTagName('svg')[0].innerHTML += `
      <g id="debug" style="fill: red" class="f1" x=${x}, y=${y}">
        <rect width="20" height="20" x="0" y="0"></rect>  
      </g>
    `;
  };

  _elementsIntersect = (position, figureToCheck) => {
    const { x = 0, y = 0 } = position;

    return figureToCheck.elements.some((figureElement) => {
      const boardXWeWant =
        (figureToCheck.position.x + figureElement.x + x) / 20;
      const boardYWeWant =
        (figureToCheck.position.y + figureElement.y + y) / 20;

      try {
        if (this.board.value[boardYWeWant][boardXWeWant].hasOwnProperty('x')) {
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
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
      this.kill();
      this.restart();
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
