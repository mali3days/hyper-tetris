const RENDER_TIME = 1000;

class Game {
  start = () => {
    console.log('start');

    // <?xml version="1.0"?>
    // <svg width="120" height="120"
    //      viewBox="0 0 120 120"
    //      xmlns="http://www.w3.org/2000/svg">

    //   <rect x="10" y="10"
    //         width="100" height="100"
    //         rx="15" ry="15"/>

    // </svg>

    this._createGame();
    // this._createGameLoop();
  };

  update = () => {
    console.log('update');
  };

  stop() {
    console.log('stop');
  }

  _createGame = () => {
    const element = document.getElementById('wrapper');

    element.innerHTML = `
        <svg
            width="300"
            height="600"
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="10"
                y="10"
                width="100"
                height="100"
                rx="15"
                ry="15"
            />
        </svg>
      `;
  };

  _createGameLoop = () => {
    let start = null;
    const gameLoop = (timestamp) => {
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
}

new Game().start();
