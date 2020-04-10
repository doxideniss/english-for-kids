import GemPuzzle from './js/GemPuzzle';

const mode = [
  '3x3',
  '4x4',
  '5x5',
  '6x6',
  '7x7',
  '8x8',
];

const resetInfo = () => {
  const infoTime = document.querySelector('.info__time');
  const infoSteps = document.querySelector('.info__steps');
  const pauseBtn = document.querySelector('#pause');
  infoSteps.innerText = '0';
  infoTime.innerText = '00:00';
  pauseBtn.innerText = 'Стоп';
};

const createControl = () => {
  const control = document.createElement('div');
  control.classList.add('control');
  const startBtn = document.createElement('button');
  const pauseBtn = document.createElement('button');
  const saveBtn = document.createElement('button');
  const resultBtn = document.createElement('button');
  startBtn.classList.add('btn');
  startBtn.id = 'start';
  startBtn.innerText = 'Начать';
  pauseBtn.classList.add('btn');
  pauseBtn.id = 'pause';
  pauseBtn.innerText = 'Стоп';
  saveBtn.classList.add('btn');
  saveBtn.innerText = 'Сохранить';
  saveBtn.id = 'save';
  resultBtn.classList.add('btn');
  resultBtn.innerText = 'Результаты';
  control.append(startBtn, pauseBtn, saveBtn, resultBtn);

  return control;
};

const createInfo = () => {
  const info = document.createElement('div');
  info.classList.add('info');
  const infoTime = document.createElement('p');
  infoTime.innerText = 'Время: ';
  const infoTimeSpan = document.createElement('span');
  infoTimeSpan.classList.add('info__time');
  infoTimeSpan.innerText = '00:00';
  infoTime.append(infoTimeSpan);
  const infoSteps = document.createElement('p');
  infoSteps.innerText = 'Ходов: ';
  const infoStepsSpan = document.createElement('span');
  infoStepsSpan.classList.add('info__steps');
  infoStepsSpan.innerText = '0';
  infoSteps.append(infoStepsSpan);

  info.append(infoTime, infoSteps);

  return info;
};
const setTime = (time) => {
  const infoTime = document.querySelector('.info__time');
  infoTime.innerText = time;
};
const setSteps = (steps) => {
  const infoSteps = document.querySelector('.info__steps');
  infoSteps.innerText = steps;
};

const gameTime = {
  time: '00:00',
  date: null,
  isPause: false,
  pause() {
    this.isPause = true;
  },
  resume() {
    this.isPause = false;
  },
  reset() {
    this.time = '00:00';
    this.date = null;
    this.isPause = false;
    clearInterval(this.timer);
  },
  createTimer(date) {
    this.time = '00:00';
    this.date = date;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.isPause) {
        return;
      }
      const sec = this.date.getSeconds();
      this.date.setSeconds(sec + 1);
      const minutes = String(this.date.getMinutes()).padStart(2, '0');
      const seconds = String(this.date.getSeconds()).padStart(2, '0');
      this.time = `${minutes}:${seconds}`;
      setTime(this.time);
    }, 1000);
  },
};

const createModeGame = () => {
  const modeGame = document.createElement('div');
  modeGame.classList.add('mode');
  modeGame.innerText = 'Выбрать размер: ';
  const modeGameBox = document.createElement('div');
  modeGameBox.classList.add('mode__box');
  mode.forEach((x) => {
    const modeEl = document.createElement('button');
    modeEl.classList.add('mode__btn');
    modeEl.innerText = x;
    modeGameBox.append(modeEl);
  });
  modeGame.append(modeGameBox);
  return modeGame;
};

const setMode = (size) => {
  document.querySelectorAll('.mode__btn').forEach((el) => {
    if (el.innerText.includes(size)) {
      el.classList.add('mode__btn_active');
    }
  });
};

const finishGame = (game) => {
  alert(`Ура! Вы решили головоломку за ${gameTime.time} и ${game.getClicks()} ходов`);
  game.init();
  resetInfo();
  gameTime.reset();
};

const addCanvasHandler = (game) => {
  const canvas = document.querySelector('.canvas');
  canvas.addEventListener('click', (e) => {
    if (game.isStarted()) {
      game.move(e.offsetX, e.offsetY);
      setSteps(game.getClicks());
      if (game.isWin()) {
        finishGame(game);
      }
    }
  });
};
const addModeHandler = (game) => {
  const modeGame = document.querySelector('.mode');
  modeGame.addEventListener('click', (e) => {
    if (e.target.classList.contains('mode__btn') && !e.target.classList.contains('mode__btn_active')) {
      const activeMode = document.querySelector('.mode__btn_active');
      activeMode.classList.remove('mode__btn_active');
      e.target.classList.add('mode__btn_active');
      const modeSize = e.target.innerText[0];
      game.setSize(modeSize);
      gameTime.reset();
      resetInfo();
    }
  });
};
const addControlHandler = (game) => {
  const startBtn = document.querySelector('#start');
  const pauseBtn = document.querySelector('#pause');
  const saveBtn = document.querySelector('#save');
  startBtn.addEventListener('click', () => {
    resetInfo();
    gameTime.createTimer(new Date(0, 0));
    game.newGame();
  });
  pauseBtn.addEventListener('click', function () {
    if (gameTime.time === '00:00') {
      return;
    }
    if (this.innerText === 'Стоп') {
      gameTime.pause();
      this.innerText = 'Возобновить';
    } else {
      gameTime.resume();
      this.innerText = 'Стоп';
    }
  });
  saveBtn.addEventListener('click', () => {
    if (game.isStarted()) {
      const savedGame = {
        date: gameTime.date,
        mixedArr: game.mixedArr,
        size: game.size,
        clicks: game.clicks,
      };
      localStorage.setItem('savedGame', JSON.stringify(savedGame));
    }
  });
};

const generateSite = () => {
  const container = document.createElement('div');
  container.classList.add('container');

  const title = document.createElement('h1');
  title.innerText = 'Пятнашки';

  const control = createControl();
  const info = createInfo();
  const modeGame = createModeGame();

  const canvas = document.createElement('canvas');
  canvas.classList.add('canvas');

  container.append(title, control, info, canvas, modeGame);

  document.body.append(container);
};

window.onload = () => {
  generateSite();

  const canvas = document.querySelector('.canvas');
  canvas.width = window.innerWidth * 0.2;
  if (window.innerWidth <= 1024) {
    canvas.width = window.innerWidth * 0.7;
  }
  const ctx = canvas.getContext('2d');
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const game = new GemPuzzle(canvas, ctx);
  let savedGame = localStorage.getItem('savedGame');
  if (savedGame) {
    if (confirm('Хотите восстановить игру?')) {
      savedGame = JSON.parse(savedGame);
      gameTime.createTimer(new Date(savedGame.date));
      game.setSavedGame(savedGame);
      localStorage.removeItem('savedGame');
    } else {
      game.init();
    }
  } else {
    game.init();
  }

  setSteps(game.clicks);
  setTime(gameTime.time);
  setMode(game.size);

  addControlHandler(game);
  addModeHandler(game);
  addCanvasHandler(game);
};
