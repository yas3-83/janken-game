// Game State
const state = {
    playerScore: 0,
    aiScore: 0,
    drawScore: 0,
    isPlaying: false
};

// DOM Elements
const elements = {
    playerScore: document.getElementById('player-score'),
    aiScore: document.getElementById('ai-score'),
    drawScore: document.getElementById('draw-score'),
    playerHand: document.getElementById('player-hand-icon'),
    aiHand: document.getElementById('ai-hand-icon'),
    resultText: document.getElementById('result-text'),
    resultDisplay: document.getElementById('result-display'),
    buttons: document.querySelectorAll('.choice-btn'),
    resetBtn: document.getElementById('reset-btn')
};

// Hand Mappings
const hands = {
    rock: '✊',
    scissors: '✌️',
    paper: '✋'
};

const choices = ['rock', 'scissors', 'paper'];

// Initialize Game
function init() {
    elements.buttons.forEach(btn => {
        btn.addEventListener('click', () => handleChoice(btn.dataset.choice));
    });

    elements.resetBtn.addEventListener('click', resetGame);
}

// Handle Player Choice
function handleChoice(playerChoice) {
    if (state.isPlaying) return;
    state.isPlaying = true;

    // Reset styles
    resetHandStyles();
    elements.resultText.textContent = "BATTLE...";
    elements.resultText.style.color = "#94a3b8";

    // Start Shake Animation
    elements.playerHand.textContent = hands.rock;
    elements.playerHand.classList.add('shake');

    // Start AI Roulette
    let rouletteInterval = setInterval(() => {
        elements.aiHand.textContent = hands[choices[Math.floor(Math.random() * 3)]];
    }, 100);

    // Wait for animation
    setTimeout(() => {
        clearInterval(rouletteInterval);
        const aiChoice = getAiChoice();
        resolveRound(playerChoice, aiChoice);

        elements.playerHand.classList.remove('shake');
        state.isPlaying = false;
    }, 1500);
}

// Get Random AI Choice
function getAiChoice() {
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

// Resolve Round
function resolveRound(playerChoice, aiChoice) {
    // Update Hand Icons
    elements.playerHand.textContent = hands[playerChoice];
    elements.aiHand.textContent = hands[aiChoice];

    // Determine Winner
    if (playerChoice === aiChoice) {
        handleDraw();
    } else if (
        (playerChoice === 'rock' && aiChoice === 'scissors') ||
        (playerChoice === 'scissors' && aiChoice === 'paper') ||
        (playerChoice === 'paper' && aiChoice === 'rock')
    ) {
        handleWin();
    } else {
        handleLose();
    }

    updateScoreboard();
}

function handleWin() {
    state.playerScore++;
    elements.resultText.textContent = "YOU WIN!";
    elements.resultText.style.color = "var(--success-color)";
    elements.playerHand.classList.add('winner-anim');
    document.body.classList.add('winner-effect');

    // Trigger Confetti - Realistic
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        colors: ['#6366f1', '#ec4899', '#22d3ee', '#ffffff']
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}

function handleLose() {
    state.aiScore++;
    elements.resultText.textContent = "YOU LOSE";
    elements.resultText.style.color = "var(--lose-color)";
    elements.aiHand.classList.add('winner-anim');
    triggerTrashRain();
}

function triggerTrashRain() {
    const trashIcons = ['🗑️', '💩', '👎', '🦴', '🍌'];
    const count = 15;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const trash = document.createElement('div');
            trash.classList.add('trash-item');
            trash.textContent = trashIcons[Math.floor(Math.random() * trashIcons.length)];
            trash.style.left = Math.random() * 100 + 'vw';
            trash.style.animationDuration = (Math.random() * 2 + 3) + 's'; // 3s - 5s
            document.body.appendChild(trash);

            // Cleanup
            setTimeout(() => {
                trash.remove();
            }, 5000);
        }, i * 200);
    }
}

function handleDraw() {
    state.drawScore++;
    elements.resultText.textContent = "DRAW";
    elements.resultText.style.color = "var(--draw-color)";

    // Trigger Clash Effect
    document.body.classList.add('clash-effect');
    setTimeout(() => {
        document.body.classList.remove('clash-effect');
    }, 500);
}

function resetHandStyles() {
    elements.playerHand.classList.remove('winner-anim');
    elements.aiHand.classList.remove('winner-anim');
    document.body.classList.remove('winner-effect');
}

function updateScoreboard() {
    elements.playerScore.textContent = state.playerScore;
    elements.aiScore.textContent = state.aiScore;
    elements.drawScore.textContent = state.drawScore;
}

function resetGame() {
    state.playerScore = 0;
    state.aiScore = 0;
    state.drawScore = 0;
    updateScoreboard();

    resetHandStyles();
    elements.playerHand.textContent = hands.rock;
    elements.aiHand.textContent = hands.rock;
    elements.resultText.textContent = "CHOOSE YOUR HAND";
    elements.resultText.style.color = "#f8fafc";
}

// Start the game
init();
