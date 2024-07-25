const ICON_HEIGHT = 150;
const NUM_ICONS = 10;
const TIME_PER_ICON = 100;

const INDEXES = [0, 0, 0];
const ICONS_MAP = ["diamond", "cherry", "lemon", "orange", "bar", "clover", "grape", "apple", "seven", "plum"];
let rollings = false;

const roll = (reel, offset = 0) => {
    const delta = (offset + 2) * NUM_ICONS + Math.round(Math.random() * NUM_ICONS);
    const style = getComputedStyle(reel),
        backgroundPositionY = parseFloat(style['background-position-y']);
    targetBackgroundPositionY = backgroundPositionY + delta * ICON_HEIGHT;
    normalisedBackgroundPositionY = targetBackgroundPositionY % (NUM_ICONS * ICON_HEIGHT);

    return new Promise((resolve, reject) => {
        reel.style.transition = `background-position-y ${8 + delta * TIME_PER_ICON}ms cubic-bezier(0.45, 0.05, 0.58, 1.09)`;
        reel.style.backgroundPositionY = `${targetBackgroundPositionY}px`;

        setTimeout(() => {
            // reel.style.transition = 'none';
            // reel.style.backgroundPositionY = `${normalisedBackgroundPositionY}px`; 
            resolve(delta % NUM_ICONS);
        }, 8 + delta * TIME_PER_ICON);
    });
};

function checkWin(bet) {
    const first = INDEXES[0];
    const second = INDEXES[1];
    const third = INDEXES[2];

    if (first === second && second === third && first == 4) {
        // BAR
        console.log("You win! " + ICONS_MAP[first] + " 250 x " + bet + " = " + 250 * bet);
    }else if (first === second && second === third && first == 8) {
        // Seven
        console.log("You win! " + ICONS_MAP[first] + " 150 x " + bet + " = " + 150 * bet);
    } else if (first === second && second === third && first == 0) {
        // Diamond
        console.log("You win! " + ICONS_MAP[first] + " 50 x " + bet + " = " + 50 * bet);
    } else if (first === second && second === third && first == 5) {
        // Clover
        console.log("You win! " + ICONS_MAP[first] + " 25 x " + bet + " = " + 25 * bet);
    } else if (first === second && second === third) {
        // Any fruit
        console.log("You win! " + ICONS_MAP[first] + " 15 x " + bet + " = " + 15 * bet);
    } else if (first === second || second === third || first === third) {
        // Any two
        console.log("You win! Any two 3 x " + bet + " = " + 3 * bet);
    } else {
        console.log("You lose!");
    }
        
}

function rollAll() {
    if (rollings) return;
    rollings = true;
    const reelsList = document.querySelectorAll('.slots > .reel');


    Promise.all([...reelsList].map((reel, index) => roll(reel, index)))
        .then((deltas) => {
            deltas.forEach((delta, index) => {
                INDEXES[index] = (INDEXES[index] + delta) % NUM_ICONS;
            });

            checkWin(1);

            rollings = false;
        });
}

const spinButton = document.getElementById('spin-button');
spinButton.addEventListener('click', rollAll);
