class GemPuzzle {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.size = 4;
    this.clicks = 0;
    this.arr = [];
    this.mixedArr = [];
    this.started = false;
  }

  getClicks() {
    return this.clicks;
  }

  setSize(size) {
    this.size = size;
    this.cellSize = this.canvas.width / this.size;
    this.clearCanvas();
    this.clicks = 0;
    this.started = false;
    this.init();
  }

  createArr() {
    const length = this.size * this.size;
    this.arr = new Array(length).fill(1).map((x, i) => {
      if (i + 1 === length) {
        return 0;
      }
      return i + 1;
    });
    this.mixedArr = [...this.arr];
  }

  mixArr() {
    this.mixedArr.sort(() => Math.random() - 0.5);
  }

  move(x, y) {
    const nullCellIndex = this.getNullCellIndex();
    const nullX = nullCellIndex % this.size;
    const nullY = Math.floor(nullCellIndex / this.size);
    const clickIndex = (this.size * Math.floor(y / this.cellSize)) + Math.floor(x / this.cellSize);
    const clickIndexX = clickIndex % this.size;
    const clickIndexY = Math.floor(clickIndex / this.size);
    if (((clickIndex - 1 === nullCellIndex || clickIndex + 1 === nullCellIndex)
      && clickIndexY === nullY)
        || ((clickIndexY - 1 === nullY || clickIndexY + 1 === nullY) && clickIndexX === nullX)) {
      this.mixedArr[nullCellIndex] = this.mixedArr[clickIndex];
      this.mixedArr[clickIndex] = 0;
      this.clicks += 1;
      this.moveAnimate(clickIndex, nullCellIndex, this.mixedArr[nullCellIndex]);
      // this.clearCanvas();
      // this.draw();
    }
  }

  moveAnimate(idx, nullIdx, el) {
    const x = idx % this.size;
    const y = Math.floor(idx / this.size);
    const nullX = nullIdx % this.size;
    const nullY = Math.floor(nullIdx / this.size);
    let moveX = 0;
    let moveY = 0;
    const step = this.cellSize / 30;
    const drawing = setInterval(() => {
      if (Math.abs(+moveX.toFixed(2)) === this.cellSize
          || Math.abs(+moveY.toFixed(2)) === this.cellSize) {
        clearInterval(drawing);
      }
      this.ctx.clearRect(
        x * this.cellSize - 1,
        y * this.cellSize - 1,
        this.cellSize + 2,
        this.cellSize + 2,
      );
      this.createEl(x, y, el, moveX, moveY);
      if (nullX - x > 0) {
        moveX += step;
      } else if (nullX - x < 0) {
        moveX -= step;
      } else if (nullY - y > 0) {
        moveY += step;
      } else if (nullY - y < 0) {
        moveY -= step;
      }
    }, 1);
  }

  getNullCellIndex() {
    return this.mixedArr.findIndex((x) => x === 0);
  }

  draw() {
    let x = 0;
    let y = 0;
    this.mixedArr.forEach((el, idx) => {
      if (el > 0) {
        this.createEl(x, y, el);
      }
      x += 1;
      if ((idx + 1) % this.size === 0) {
        y += 1;
        x = 0;
      }
    });
  }

  createEl(x, y, el, moveX = 0, moveY = 0) {
    this.ctx.fillStyle = '#FFB93B';
    this.ctx.fillRect(
      (x * this.cellSize) + 1 + moveX,
      (y * this.cellSize) + 1 + moveY,
      this.cellSize - 2,
      this.cellSize - 2,
    );
    this.ctx.font = `bold ${(this.cellSize / 2)}px Sans`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = '#222';
    this.ctx.fillText(
      el,
      (x * this.cellSize) + moveX + this.cellSize / 2,
      (y * this.cellSize) + moveY + this.cellSize / 2,
    );
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  newGame() {
    this.clicks = 0;
    this.started = true;
    this.mixArr();
    this.clearCanvas();
    this.draw();
  }

  isWin() {
    for (let i = 0; i < this.mixedArr.length; i += 1) {
      const el = this.mixedArr[i];
      if (el !== this.arr[i]) {
        return false;
      }
    }
    return true;
  }

  isStarted() {
    return this.started;
  }

  setSavedGame(opt) {
    this.size = opt.size;
    this.createArr();
    this.mixedArr = opt.mixedArr;
    this.clicks = opt.clicks;
    this.started = true;
    this.cellSize = this.canvas.width / this.size;
    this.canvas.height = this.cellSize * this.size;
    this.clearCanvas();
    this.draw();
  }

  init() {
    this.cellSize = this.canvas.width / this.size;
    this.canvas.height = this.cellSize * this.size;
    this.started = false;
    this.createArr();
    this.draw();
  }
}

export default GemPuzzle;
