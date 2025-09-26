// script.js
document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesSpan = document.getElementById('moves');
    const winMessage = document.getElementById('win-message');
    const restartButton = document.getElementById('restart-button');

    const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    let cards = [...symbols, ...symbols];

    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let lockBoard = false;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        shuffle(cards);
        matchedPairs = 0;
        moves = 0;
        movesSpan.textContent = '0';
        winMessage.classList.add('hidden');

        cards.forEach(symbol => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.symbol = symbol;

            card.innerHTML = `
                <div class="card-face card-front">?</div>
                <div class="card-face card-back">${symbol}</div>
            `;

            card.addEventListener('click', handleCardClick);
            gameBoard.appendChild(card);
        });
    }

    function handleCardClick(e) {
        if (lockBoard) return;
        const clickedCard = e.currentTarget;
        if (clickedCard === flippedCards[0]) return;

        clickedCard.classList.add('is-flipped');
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            lockBoard = true;
            incrementMoves();
            checkForMatch();
        }
    }

    function incrementMoves() {
        moves++;
        movesSpan.textContent = moves;
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.symbol === card2.dataset.symbol;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        flippedCards.forEach(card => {
            card.removeEventListener('click', handleCardClick);
            card.classList.add('is-matched');
        });
        matchedPairs++;
        resetBoard();
        checkForWin();
    }

    function unflipCards() {
        setTimeout(() => {
            flippedCards.forEach(card => card.classList.remove('is-flipped'));
            resetBoard();
        }, 1200);
    }

    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }

    function triggerConfetti() {
        const duration = 3 * 1000; // 3 seconds
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 100 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // Shoot from the top-left
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#bb86fc', '#03dac6', '#ffffff']
            }));
            // Shoot from the top-right
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#bb86fc', '#03dac6', '#ffffff']
            }));
        }, 250);
    }

    function checkForWin() {
        if (matchedPairs === symbols.length) {
            if (moves <= 15) {
                triggerConfetti();
            } else {
                // Change all animals to crying face
                const allCards = document.querySelectorAll('.card.is-matched');
                allCards.forEach(card => {
                    const cardBack = card.querySelector('.card-back');
                    if (cardBack) {
                        cardBack.innerHTML = '😿';
                    }
                });
            }
            setTimeout(() => {
                winMessage.classList.remove('hidden');
            }, 800); // Slightly delay win message to see confetti
        }
    }
    
    restartButton.addEventListener('click', createBoard);

    // Initial game setup
    createBoard();
});
