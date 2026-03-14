// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let tries = 0;
let canFlip = true;

// Card emojis (10 pairs)
const emojis = ['✈️', '🐶', '🐱', '🎩', '🐘', '🦁', '🐼', '🦊', '🐯', '🦒'];

// Initialize game
function initGame() {
    // Reset game state
    matchedPairs = 0;
    tries = 0;
    flippedCards = [];
    canFlip = true;

    // Update UI
    document.getElementById('tries-count').textContent = tries;
    document.getElementById('victory-modal').classList.add('hidden');

    // Create card pairs
    cards = [...emojis, ...emojis];

    // Shuffle cards
    shuffleArray(cards);

    // Clear and create game board
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    cards.forEach((emoji, index) => {
        const card = createCard(emoji, index);
        gameBoard.appendChild(card);
    });
}

// Create a card element
function createCard(emoji, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.dataset.emoji = emoji;

    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';

    const cardFace = document.createElement('div');
    cardFace.className = 'card-face';
    cardFace.textContent = emoji;

    card.appendChild(cardBack);
    card.appendChild(cardFace);

    card.addEventListener('click', () => handleCardClick(card));

    return card;
}

// Handle card click
function handleCardClick(card) {
    // Prevent flipping if:
    // - Animation in progress
    // - Card already flipped
    // - Two cards already flipped
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    // Flip the card
    card.classList.add('flipped');
    flippedCards.push(card);

    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        canFlip = false;
        tries++;
        document.getElementById('tries-count').textContent = tries;

        checkForMatch();
    }
}

// Check if flipped cards match
function checkForMatch() {
    const [card1, card2] = flippedCards;
    const emoji1 = card1.dataset.emoji;
    const emoji2 = card2.dataset.emoji;

    if (emoji1 === emoji2) {
        // Match found
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;

            flippedCards = [];
            canFlip = true;

            // Check if game is won
            if (matchedPairs === emojis.length) {
                setTimeout(() => showVictory(), 500);
            }
        }, 600);
    } else {
        // No match
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

// Show victory modal
function showVictory() {
    document.getElementById('final-tries').textContent = tries;
    document.getElementById('victory-modal').classList.remove('hidden');
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Event listeners
document.getElementById('play-again').addEventListener('click', initGame);

// Start the game when page loads
initGame();
