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
    console.log('start');
    this.figures = [];
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
    // TODO: Implement storing rectangles to the board canvas
    // as we need to strike a line if it is empty
    // TIP: remember about border of the figure
    this._resetPosition();
    this._setFigure();
  }

  _resetPosition = () => {
    this.position = { x: 0, y: 0 };
  };

  _updateFigurePosition = (position) => {
    const isValid = this._validatePosition();

    if (!isValid) {
      return this.stop();
    }

    if (position) {

      if ((this.position.x + position.x + STEP) === GAME_SIZE_W) return;
      if ((this.position.x + position.x) < 0) return;

      if (position.x) this.position.x += position.x;
      if (position.y) this.position.y += position.y;
    }
  };

  _validatePosition = (position) => {
    if (
      this.figures.find((figure) => {
        return figure.elements.some((element) => {
          return this.figure.elements.some((figureElement) => {
            const figureElementXWeWant =
              this.figure.position.x + this.figure.size + figureElement.x;
            const elementXWeHave = figure.position.x + element.x;

            const figureElementYWeWant =
              this.figure.position.y + figureElement.y;
            const elementYWeHave = figure.position.y + element.y;

            if (
              figureElementXWeWant === elementXWeHave &&
              figureElementYWeWant === elementYWeHave
            )
              return true;

            return false;
          });
        });
      })
    ) {
      if (this.position.x === 0) {
        this.isGameOver = true;
      }

      return false;
    }

    // width collision
    // if (this.position.x + this.figure.totalSize.x === GAME_SIZE_W) {
    //   return false;
    // }

    // height collision
    if (this.position.y + this.figure.totalSize.y === GAME_SIZE_H) {
      return false;
    }

    return true;
  };

  _setFigure = () => {
    this.figure = new Figure1(STEP, this.position);
  };

  rotate = () => {
    this.figure.rotate();
    this.update();
  }

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
        this.update({ x: STEP })
      }
      
      if (event.key === 'ArrowLeft') {
        this.update({ x: -STEP })
      }
    })
  };
}

new Game().start();
