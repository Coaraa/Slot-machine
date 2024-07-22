const ICON_WITDH = 100;
const ICON_HEIGHT = 100;
const NUM_ICONS = 10;
const TIME_PER_ICON = 100;

const INDEXES = [0, 0, 0];
const ICONS_MAP = ["cherry", "diamond", "plum", "seven", "apple", "grape", "clover", "bar", "lemon", "orange"];
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
            resolve(delta%NUM_ICONS);
        }, 8 + delta * TIME_PER_ICON);
    });
};

function rollAll () {
    if (rollings) return;
    rollings = true;
    const reelsList = document.querySelectorAll('.slots > .reel');

    
    Promise.all([...reelsList].map((reel, index) => roll(reel, index)))
        .then((deltas) => {
            deltas.forEach((delta, index) => {
                INDEXES[index] = (INDEXES[index] + delta) % NUM_ICONS;
            });
            INDEXES.map((index => {
                console.log(ICONS_MAP[index]);
            }))

            rollings = false;
            // setTimeout(rollAll, 3000);
        });
    
    

}

const spinButton = document.getElementById('spin-button');
spinButton.addEventListener('click', rollAll);
