import { Figure1 } from './figure1.js';

const RENDER_TIME = 1000;
export const STEP = 20;
const GAME_SIZE_W = 15 * STEP; // 300
const GAME_SIZE_H = 30 * STEP; // 600

class Game {
  figure;
  figures;
  position;
  isGameOver;
  isPaused;

  start = () => {
    this.figures = [];
    this.isGameOver = false;
    console.log('start');

    this._resetPosition();
    // this._renderGame();
    this._createGameLoop();

    const rotateBtnElement = document.getElementById('btn-rotate');
    const pauseResumeBtnElement = document.getElementById('btn-pause_resume');

    rotateBtnElement.addEventListener('click', () => {
      console.log('ROTATE CLICKED');
      console.log(this.figure);
      this.figure.rotate();
    });

    pauseResumeBtnElement.addEventListener('click', async () => {
        if (this.isPaused) {
          this.resume();
        } else {
          this.pause();
        }
    });
  };

  update = () => {
    console.log('update');

    if (!this.figure) this._setFigure();

    this._updateFigurePosition();
    this._renderGame();
  };

  stop() {
    // this.isGameOver = true;
    // this._resetPosition();
    console.log('STOP');
    console.log('Create new figure');
    console.log(this.figure);
    this.figures.push(this.figure);
    // TODO: Implement storing rectangles to the board canvas
    // as we need to strike a line if it is empty
    // TIP: remember about border of the figure
    this._resetPosition();
    this._setFigure();
  }

  _resetPosition = () => {
    this.position = { x: 0, y: 0 };
  };

  _updateFigurePosition = () => {
    const isValid = this._validatePosition();

    if (!isValid) {
      return this.stop();
    }

    this.position.x += STEP;
  };

  _validatePosition = (position) => {
    // console.log('validate');
    // console.log(this.position.x);
    // console.log(this.position.x + this.figure.totalSize.x);
    // console.log('this.figures[0]: ', this.figures[0]);

    if (
      this.figures.find((figure) => {
        // console.log('figure.elements[0].x: ', figure.elements[0]?.x);
        // console.log('this.position.x: ', this.position.x);
        // console.log('this.position.y: ', this.position.y);
        return figure.elements.some((element) => {
          return (
            element.x + figure.position.x === this.position.x + this.figure.totalSize.x ||
            element.y + figure.position.y === this.position.y + this.figure.totalSize.y
          );
        });
      })
    ) {
      if (this.position.x === 0) {
        this.isGameOver = true;
      }

      return false;
    }

    // width collision
    if (this.position.x + this.figure.totalSize.x === GAME_SIZE_W) {
      return false;
    }

    // height collision
    // if (this.position.y + this.figure.totalSize.y === GAME_SIZE_H) {
    //   return false;
    // }

    return true;
  };

  _setFigure = () => {
    this.figure = new Figure1(STEP, this.position);
  };

  _renderGame = () => {
    const element = document.getElementById('wrapper');

    element.innerHTML = `
        <svg
            width="${GAME_SIZE_W}"
            height="${GAME_SIZE_H}"
            xmlns="http://www.w3.org/2000/svg"
        >
            ${this.figure.render()}
            ${this.figures.map((figure) => figure.render())}
        </svg>
      `;
  };

  _createGameLoop = () => {
    let start = null;
    const gameLoop = async (timestamp) => {
      if (this.isGameOver) {
        return;
      };

      if (this.isPaused) {
        start = null;
      }

      if (start === null) start = timestamp;
      let progress = timestamp - start;

      if (progress > RENDER_TIME) {
        this.update();
        start = timestamp;
      }
      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  };

  pause = async () => {
    this.isPaused = true;
  }

  resume = () => {
    this.isPaused = false;
  }
}

new Game().start();
