import data from './js/cardsData';

const menuItem = [
  {
    title: 'Main',
    linkURL: '/',
  },
  ...data,
  {
    title: 'Statistics',
    linkURL: '/statistics',
  },
];

const playAudio = (src) => {
  const audio = document.querySelector('.audio');
  audio.src = src;
  audio.currentTime = 0.0;
  audio.load();
  setTimeout(() => {
    audio.play();
  }, 0);
};

const closeBurgerMenu = () => {
  const nav = document.querySelector('.menu');
  const burgerMenuIcon = document.querySelector('.burger-menu__icon');
  burgerMenuIcon.classList.remove('burger-menu__icon_open');
  nav.classList.remove('menu_active');
};

const setPage = (url) => {
  const menuItemActive = document.querySelector('.menu__item_active');
  const menuItemCLicked = document.querySelector(`[href='${url}']`).parentElement;
  menuItemActive.classList.remove('menu__item_active');
  window.location.hash = url;
  menuItemCLicked.classList.add('menu__item_active');
};

const createCards = (category) => {
  const cardsContainer = document.querySelector('.cards-container');
  let cards = null;
  if (category === '/' || category === '') {
    cards = data.map((x) => (
      `<div class="category-card" data-url="${x.linkURL}">
    <div class="category-card__img">
        <img src="${x.categoryImage}" alt="">
    </div>
    <div class="category-card__title">${x.title}</div>
</div>`
    ));
  } else {
    const categoryItem = data.find((x) => x.linkURL === category);
    cards = categoryItem.cards.map((x) => (
      `<div class="card" data-audio="${x.audio}">
    <div class="card__inner">
        <div class="card__front">
            <div class="card__img">
                <img src="${x.image}" alt="">
            </div>
            <div class="card__title">${x.word}</div>
        </div>
        <div class="card__back">
            <div class="card__img">
                <img src="${x.image}" alt="">
            </div>
            <div class="card__title">${x.translation}</div>
        </div>
        <div class="card__rotate"></div>
    </div>
</div>`
    ));
  }
  cardsContainer.innerHTML = cards.join('');
  cardsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('card__rotate')) {
      const card = e.target.closest('.card');
      card.classList.add('card_active');
    } else if (e.target.closest('.category-card')) {
      const card = e.target.closest('.category-card');
      setPage(card.dataset.url);
    } else if (e.target.closest('.card__front')) {
      const srcAudio = e.target.closest('.card').dataset.audio;
      playAudio(srcAudio);
    }
  });
  cardsContainer.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('cards-container')) {
      cardsContainer.querySelectorAll('.card').forEach((el) => {
        el.classList.remove('card_active');
      });
    }
  });
};

const render = () => {
  const category = window.location.hash.replace('#', '');
  createCards(category);
};

const createNode = (tag, ...classes) => {
  const el = document.createElement(tag);
  el.classList.add(...classes);
  return el;
};

const createHeader = () => {
  const header = createNode('header', 'header');

  const nav = createNode('nav', 'menu');
  const navMenu = createNode('ul', 'menu__list');
  menuItem.forEach((x) => {
    const navItem = createNode('li', 'menu__item');
    const navLink = createNode('a', 'menu__link');
    const locationHash = window.location.hash.replace('#', '');

    if (x.linkURL === locationHash || (locationHash === '' && x.linkURL === '/')) {
      navItem.classList.add('menu__item_active');
    }

    navLink.innerText = x.title;
    navLink.href = x.linkURL;

    navItem.append(navLink);
    navMenu.append(navItem);
  });
  nav.append(navMenu);

  const burgerMenu = createNode('div', 'burger-menu');
  const burgerMenuIcon = createNode('div', 'burger-menu__icon');
  burgerMenu.addEventListener('click', () => {
    burgerMenuIcon.classList.toggle('burger-menu__icon_open');
    nav.classList.toggle('menu_active');
  });
  burgerMenu.append(burgerMenuIcon);

  nav.addEventListener('click', (e) => {
    if (e.target.classList.contains('menu__link')) {
      e.preventDefault();
      setPage(e.target.pathname);
      closeBurgerMenu();
      render();
    }
  });

  const toggleBtn = createNode('div', 'toggle-box');
  const toggleInput = createNode('input', 'toggle-box__input');
  toggleInput.type = 'checkbox';
  toggleInput.checked = true;
  const toggleLabel = createNode('label', 'toggle-box__label');
  toggleLabel.innerHTML = `<span class="toggle-box__on">Train</span>
    <span class="toggle-box__off">Play</span>
    <div class="toggle-box__handle"></div>`;
  toggleBtn.append(toggleInput, toggleLabel);
  toggleInput.addEventListener('click', (e) => {
    console.log(e);
  });

  header.append(burgerMenu, nav, toggleBtn);
  return header;
};

const createAudio = () => {
  const audio = createNode('audio', 'audio');
  return audio;
};

const generatePage = () => {
  const container = createNode('div', 'container');
  const cardsContainer = createNode('div', 'cards-container');
  const header = createHeader();
  const audio = createAudio();
  container.append(header, cardsContainer, audio);
  document.body.append(container);
};

const addWindowHandler = () => {
  window.addEventListener('click', (e) => {
    if (e.target.closest('.cards-container')) {
      const burgerMenuIcon = document.querySelector('.burger-menu__icon');
      const nav = document.querySelector('.menu');
      burgerMenuIcon.classList.remove('burger-menu__icon_open');
      nav.classList.remove('menu_active');
    }
  });
  window.addEventListener('hashchange', () => {
    render();
  });
};

window.onload = () => {
  generatePage();
  addWindowHandler();
  render();
};
