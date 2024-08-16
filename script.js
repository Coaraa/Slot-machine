const ICON_HEIGHT = 150;
const NUM_ICONS = 10;
const TIME_PER_ICON = 100;

const INDEXES = [0, 0, 0];
const ICONS_MAP = ["diamond", "cherry", "lemon", "orange", "bar", "clover", "grape", "apple", "seven", "plum"];

let rollings = false;
var wallet = 100;

function updateWallet() {
    document.getElementById('wallet').textContent = wallet;
}

const roll = (reel, offset = 0) => {
    const delta = (offset + 2) * NUM_ICONS + Math.round(Math.random() * NUM_ICONS);
    const style = getComputedStyle(reel),
        backgroundPositionY = parseFloat(style['background-position-y']);
    targetBackgroundPositionY = backgroundPositionY + delta * ICON_HEIGHT;

    const circle = document.getElementById('circle');
    const stick = document.getElementById('stick');

    return new Promise((resolve, reject) => {
        reel.style.transition = `background-position-y ${8 + delta * TIME_PER_ICON}ms cubic-bezier(0.45, 0.05, 0.58, 1.09)`;
        reel.style.backgroundPositionY = `${targetBackgroundPositionY}px`;

        circle.style.transform = `translateY(${ICON_HEIGHT}px) scale(1.2)`;
        circle.style.transition = `transform 1.2s ease-in-out`;
        stick.style.transform = `scaleY(0)`;
        stick.style.transition = `transform 0.9s ease-in-out`;

        circle.addEventListener('transitionend', () => {
            circle.style.transform = `translateY(-50%)`;
            circle.style.transition = `transform 1.2s`;
        });

        stick.addEventListener('transitionend', () => {
            stick.style.transform = `scaleY(1)`;
            stick.style.transition = `transform 0.9s`;
            stick.style.transitionDelay = `0.5s`;
        });

        setTimeout(() => {
            resolve(delta % NUM_ICONS);
        }, 8 + delta * TIME_PER_ICON);
    });
};

function checkWin(bet) {
    const first = INDEXES[0];
    const second = INDEXES[1];
    const third = INDEXES[2];

    if (first === second && second === third) {
        if (first === 4) {
            wallet += 250 * bet;
            Swal.fire({
                icon: "success",
                title: "You win! BAR 250 x " + bet + " = " + 250 * bet,
                showConfirmButton: false,
                timer: 3000
            });
        } else if (first === 8) {
            wallet += 200 * bet;
            Swal.fire({
                icon: "success",
                title: "You win! Seven 150 x " + bet + " = " + 150 * bet,
                showConfirmButton: false,
                timer: 3000
            });
        } else if (first === 0) {
            wallet += 50 * bet;
            Swal.fire({
                icon: "success",
                title: "You win! Diamond 50 x " + bet + " = " + 50 * bet,
                showConfirmButton: false,
                timer: 3000
            });
        } else if (first === 5) {
            wallet += 25 * bet;
            Swal.fire({
                icon: "success",
                title: "You win! Clover 25 x " + bet + " = " + 25 * bet,
                showConfirmButton: false,
                timer: 3000
            });
        } else {
            wallet += 15 * bet;
            Swal.fire({
                icon: "success",
                title: "You win! " + ICONS_MAP[first] + " 15 x " + bet + " = " + 15 * bet,
                showConfirmButton: false,
                timer: 3000
            });
        }
    } else {
        wallet -= bet;
        Swal.fire({
            icon: "error",
            title: "You lose!",
            showConfirmButton: false,
            timer: 3000
        });
    }
}

function rollAll() {
    if (rollings) return;
    rollings = true;

    const bet = document.getElementById('bet');
    bet.readOnly = true;
    if (bet.value <= 0 || bet.value > 10) {
        Swal.fire({
            icon: "error",
            title: "Invalid bet! Please enter a value between 1 and 10",
            showConfirmButton: true,
            confirmButtonText: "OK",
            timer: 3000
        });
        rollings = false;
        bet.readOnly = false;
        return;
    }
    if (bet.value > wallet) {
        if (wallet <= 0) {
            Swal.fire({
                icon: "error",
                title: "Insufficient funds!",
                showConfirmButton: true,
                confirmButtonText: "Retry",
                timer: 3000
            }).then((result) => {
                if (result.isConfirmed) {
                    bet.readOnly = false;
                    rollings = false;
                    wallet = 100;
                    updateWallet();
                    return;
                }
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Insufficient funds!",
                showConfirmButton: true,
                confirmButtonText: "OK",
                timer: 3000
            });
        }
    rollings = false;
    bet.readOnly = false;
    return;
}

const reelsList = document.querySelectorAll('.slots > .reel');

Promise.all([...reelsList].map((reel, index) => roll(reel, index)))
    .then((deltas) => {
        deltas.forEach((delta, index) => {
            INDEXES[index] = (INDEXES[index] + delta) % NUM_ICONS;
        });

        checkWin(bet.value);
        updateWallet();

        rollings = false;
        bet.readOnly = false;
    });
}

const spinButton = document.getElementById('spin-button');
spinButton.addEventListener('click', rollAll);
