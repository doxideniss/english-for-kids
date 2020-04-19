import data from './cardsData';

const errorAudio = './data/audio/error.mp3';
const correctAudio = './data/audio/correct.mp3';

export default class Game {
  constructor(playAudio) {
    this.category = null;
    this.cards = [];
    this.currentCardIndex = 0;
    this.currentCard = null;
    this.playAudio = playAudio;
    this.answers = [];
    this.started = false;
  }

  isStarted() {
    return this.started;
  }

  setCategory(category) {
    this.category = category;
  }

  playCurrentAudio() {
    this.playAudio(this.currentCard.audio);
  }

  setCurrentCard(card) {
    this.currentCard = card;
  }

  shuffleCards() {
    this.cards.sort(() => Math.random() - 0.5);
  }

  setCards() {
    this.cards = [...data.find((x) => x.linkURL === `/${this.category}`).cards];
  }

  checkCardClick(card) {
    const isRight = card.dataset.audio === this.currentCard.audio;
    if (isRight) {
      this.answers.push(true);
      this.playAudio(correctAudio);
      this.currentCardIndex += 1;
      if (this.currentCardIndex !== this.cards.length) {
        this.setCurrentCard(this.cards[this.currentCardIndex]);
        setTimeout(() => {
          this.playCurrentAudio();
        }, 500);
      } else {
        this.started = false;
      }
      card.classList.add('card_correct');
    } else {
      this.answers.push(false);
      this.playAudio(errorAudio);
    }
    return isRight;
  }

  getIncorrectAnswersLength() {
    const incorrectAnswers = this.answers.filter((x) => x === false);
    return incorrectAnswers.length;
  }

  isGameEnd() {
    return this.currentCardIndex === this.cards.length;
  }

  stopGame() {
    this.started = false;
  }

  startGame(category) {
    this.started = true;
    this.currentCardIndex = 0;
    this.setCategory(category);
    this.setCards();
    this.shuffleCards();
    this.setCurrentCard(this.cards[this.currentCardIndex]);
    setTimeout(() => {
      this.playCurrentAudio();
    }, 500);
  }
}
