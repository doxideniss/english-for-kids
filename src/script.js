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
    const locationHash = window.location.hash.replace('#', '');

    console.log(x.link, locationHash);

    if (x.link === locationHash) {
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

  header.append(burgerMenu, nav);

  container.append(header);

  document.body.append(container);

  nav.addEventListener('click', (e) => {
    if (e.target.classList.contains('menu__link')) {
      e.preventDefault();
      window.location.hash = e.target.pathname;
      nav.querySelectorAll('.menu__item').forEach((x) => {
        x.classList.remove('menu__item_active');
      });
      e.target.parentNode.classList.add('menu__item_active');
      burgerMenuIcon.classList.toggle('burger-menu__icon_open');
      nav.classList.toggle('menu_active');
    }
  });
  window.addEventListener('click', (e) => {
    if (!(e.target.classList.contains('burger-menu')
      || e.target.classList.contains('menu__list')
      || e.target.classList.contains('menu__item'))) {
      burgerMenuIcon.classList.remove('burger-menu__icon_open');
      nav.classList.remove('menu_active');
    }
  });
  window.addEventListener('hashchange', () => {
    render();
  });
};
