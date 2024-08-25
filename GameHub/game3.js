document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.getElementById('game-board');
  const restartButton = document.getElementById('restart');

  const cardsArray = [
      'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
      'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H','I','I','J','J','K','K',
      'L','L','M','M','N','N','O','O','P','P','Q','Q','R','R'
  ];

  let flippedCards = [];
  let matchedPairs = 0;

  function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }

  function createBoard() {
      gameBoard.innerHTML = '';
      const shuffledCards = shuffle(cardsArray);
      shuffledCards.forEach((card) => {
          const cardElement = document.createElement('div');
          cardElement.classList.add('card');
          cardElement.dataset.value = card;
          cardElement.addEventListener('click', flipCard);
          gameBoard.appendChild(cardElement);
      });
  }

  function flipCard() {
      if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
          this.classList.add('flipped');
          this.textContent = this.dataset.value;
          flippedCards.push(this);

          if (flippedCards.length === 2) {
              setTimeout(checkMatch, 1000);
          }
      }
  }

  function checkMatch() {
      const [card1, card2] = flippedCards;
      if (card1.dataset.value === card2.dataset.value) {
          matchedPairs += 1;
          if (matchedPairs === cardsArray.length / 2) {
              setTimeout(() => alert('You win!'), 100);
          }
      } else {
          card1.classList.remove('flipped');
          card1.textContent = '';
          card2.classList.remove('flipped');
          card2.textContent = '';
      }
      flippedCards = [];
  }

  function restartGame() {
      flippedCards = [];
      matchedPairs = 0;
      createBoard();
  }

  restartButton.addEventListener('click', restartGame);

  createBoard();
});
