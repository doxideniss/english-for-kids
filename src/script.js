const categoriesCards = [
  {
    title: 'Action (set A)',
    link: '/actionA',
    img: '',
  },
];

const menuItem = [
  {
    title: 'Main',
    link: '/',
  },
  ...categoriesCards,
];

const createNode = (tag, ...classes) => {
  const el = document.createElement(tag);
  el.classList.add(...classes);
  return el;
};

const render = () => {
  console.log('render');
};

window.onload = () => {
  const container = createNode('div', 'container');

  const header = createNode('header', 'header');

  const nav = createNode('nav', 'menu');
  const navMenu = createNode('ul', 'menu__list');
  menuItem.forEach((x) => {
    const navItem = createNode('li', 'menu__item');
    const navLink = createNode('a', 'menu__link');

    if (x.link === '/') {
      navItem.classList.add('menu__item_active');
    }

    navLink.innerText = x.title;
    navLink.href = x.link;

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

  header.append(burgerMenu);

  container.append(header, nav);

  document.body.append(container);

  nav.addEventListener('click', (e) => {
    if (e.target.classList.contains('menu__link')) {
      e.preventDefault();
      window.location.hash = e.target.pathname;
    }
    if (!e.target.classList.contains('menu__list')) {
      burgerMenuIcon.classList.toggle('burger-menu__icon_open');
      nav.classList.toggle('menu_active');
    }
  });
  window.addEventListener('hashchange', () => {
    render();
  });
};
