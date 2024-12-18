document.addEventListener('DOMContentLoaded', () => {
    const secondSong = new Audio('sounds/lofi.mp3');
    let musicMuted = false;

    const piggy = document.getElementById('piggy');
    const coinValue = document.getElementById('coinValue');
    const clickSound = document.getElementById('click-sound');
    const buzzSound = document.getElementById('buzz-sound');
    const buySound = document.getElementById('buy-sound');
    const soundButton = document.getElementById('soundimg'); // Sound button
    const musicButton = document.getElementById('music'); // Music button
    const attentionText = document.getElementById('attentionText');
    const upgradeButton = document.getElementById('upgradeButton');
    const autoClickerButton = document.getElementById('autoClickerButton');
    const ballButton = document.getElementById('ballButton');
    const shoeButton = document.getElementById('shoeButton');
    const koalaButton = document.getElementById('koalaButton');
    const secondCursorButton = document.getElementById('secondCursorButton');
    const consoleButton = document.getElementById('consoleButton');
    const rugButton = document.getElementById('rugButton');
    const cursorButton350 = document.getElementById('cursorButton350');
    const plantButton = document.getElementById('plantButton');
    const snailButton = document.getElementById('snailButton');
    const cabinetButton = document.getElementById('cabinetButton');
    const glueButton = document.getElementById('glueButton');
    const fitButton = document.getElementById('fitButton');
    const cursorButton550 = document.getElementById('cursorButton550');
    const cursorButton800 = document.getElementById('cursorButton800');
    const cursorButton1000 = document.getElementById('cursorButton1000');
    const photoButton = document.getElementById('photoButton');
    const couchButton = document.getElementById('couchButton');
    const brushButton = document.getElementById('brushButton');
    const dogButton = document.getElementById('dogButton');
    const parrotButton = document.getElementById('parrotButton'); // Ad button
    const adPopup = document.getElementById('adPopup'); // Ad popup
    const popupClose = document.getElementById('popupClose'); // Popup close button
    const popupButton = document.getElementById('popupButton'); 
    const medalButton = document.getElementById('medalButton'); // Popup get button
    const coinCountImg = document.querySelector('#coinCount img');
    const main = document.querySelector('.main');
    const adButton = document.getElementById('ad');
    const boughtItemsContainer = document.querySelector('.bought-items-container');

    let coins = 0;
    let clickIncrement = 1;
    let autoIncrement = 0;
    let soundEnabled = true; // Flag to track sound state
    let firstClick = true; // Flag to track first click
    let musicRotation = 0; // Variable to track music button rotation
    let hasSongPlayed = false;

    popupButton.disabled = true;

    const itemsPurchased = {
        train: false,
        koala: false
    };

    function playClickSound() {
        if (soundEnabled) {
            clickSound.play();
        }
    }

    function playBuzzSound() {
        if (soundEnabled) {
            buzzSound.play();
        }
    }

    function playBuySound() {
        if (soundEnabled) {
            buySound.play();
        }
    }

    function toggleSound() {
        soundEnabled = !soundEnabled;
        soundButton.src = soundEnabled ? 'img/sound.svg' : 'img/soundMuted.svg';
    }

    soundButton.addEventListener('click', (event) => {
        toggleSound();
    });

    musicButton.addEventListener('click', (event) => {
        musicMuted = !musicMuted;
        if(musicMuted){
            secondSong.pause();
        } else {
            secondSong.play();
        }
        musicRotation += 180;
        musicButton.style.transform = `rotate(${musicRotation}deg)`;
    });

    adButton.addEventListener('click', () => {
        playClickSound();
        popupButton.disabled = false;
        adPopup.classList.remove('hidden');
        adPopup.classList.remove('nopoint');
        setTimeout(() => {
            adPopup.classList.add('show');
        }, 10); // Slight delay to trigger animation
    });

    popupClose.addEventListener('click', () => {
        playClickSound();
        popupButton.disabled = true;
        adPopup.classList.remove('show');
        adPopup.classList.add('nopoint');
        setTimeout(() => {
            adPopup.classList.add('hidden');
        }, 500); // Delay to match the opacity transition
    });

    popupButton.addEventListener('click', () => {
        secondSong.pause();
        setTimeout(() => {
            secondSong.play();
        }, 30000); 
        gdsdk.showAd('rewarded');
        adPopup.classList.add('hidden');
        coins += 3000; // Assuming you want to add coins when the button is clicked
        coinValue.textContent = coins;
    });

    function spawnHeart() {
        const heart = document.createElement('img');
        heart.src = 'img/heart.png';
        heart.className = 'heart';
        piggy.parentElement.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 1000);
    }

    function animateCoinCount() {
        coinCountImg.classList.add('animate');
        setTimeout(() => {
            coinCountImg.classList.remove('animate');
        }, 1000);
    }

    function spawnItem(className) {
        const item = document.createElement('img');
        item.src = `img/${className}.png`;
        item.className = 'bought-item';

        const mainRect = main.getBoundingClientRect();

        const safePosition = getSafePosition(mainRect);

        item.style.position = 'absolute';
        item.style.left = `${safePosition.x}%`;
        item.style.top = `${safePosition.y}%`;
        item.style.opacity = '0';

        main.appendChild(item);

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.style.transition = 'opacity 1s, transform 1s';
        }, 100);
    }

    function getSafePosition(containerRect) {
        const maxAttempts = 100;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const x = Math.random() * 90; // Ensures the item doesn't go beyond container width
            const y = Math.random() * 90; // Ensures the item doesn't go beyond container height

            if (isPositionSafe(x, y)) {
                return { x, y };
            }
        }
        return { x: 0, y: 0 };
    }

    function isPositionSafe(x, y) {
        const items = document.querySelectorAll('.bought-item');
        const piggyRect = piggy.getBoundingClientRect();
        const mainRect = main.getBoundingClientRect();

        const xPx = (x / 100) * mainRect.width;
        const yPx = (y / 100) * mainRect.height;

        for (let item of items) {
            const itemRect = item.getBoundingClientRect();
            if (xPx < itemRect.right && xPx + 50 > itemRect.left && yPx < itemRect.bottom && yPx + 50 > itemRect.top) {
                return false;
            }
        }

        return !(xPx < piggyRect.right && xPx + 50 > piggyRect.left && yPx < piggyRect.bottom && yPx + 50 > piggyRect.top);
    }

    function showButtonWithSound(button) {
        if (!button.classList.contains('show')) {
            button.classList.add('show');
        }
    }

    function checkAndPurchase(button, cost, activatePower) {
        if (coins >= cost) {
            coins -= cost;
            coinValue.textContent = coins;
            playBuySound();
            if (!activatePower) {
                spawnHeart();
            }
            button.style.transition = 'opacity 0.5s';
            button.style.opacity = '0';
            setTimeout(() => {
                button.remove();
                const buttonsBelow = button.nextElementSibling;
                if (buttonsBelow) {
                    buttonsBelow.classList.add('show');
                }
            }, 1);
            return true;
        } else {
            playBuzzSound();
            animateCoinCount();
            return false;
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this,
                args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    piggy.addEventListener('click', (event) => {
        if(!hasSongPlayed){
            hasSongPlayed = true;
            secondSong.play();
        }
        console.log("Hello")
        event.stopPropagation();

        coins += clickIncrement;
        coinValue.textContent = coins;

        playClickSound();

        piggy.style.transform = 'scale(0.9)';
        setTimeout(() => {
            piggy.style.transform = 'scale(1)';
        }, 200);

        if (firstClick) {
            setTimeout(() => {
            }, 500); // Delay for train button appearance
            firstClick = false;
        }

        if (coins === 1) {
            attentionText.style.transition = 'opacity 0.8s ease';
            attentionText.style.opacity = '0';
        }

        const pennyContainer = document.createElement('div');
        pennyContainer.className = 'penny';

        const penny = document.createElement('img');
        penny.src = 'img/penny.svg';

        const direction = Math.random() > 0.5 ? '100px' : '-100px';
        const rotationDuration = `${Math.random() * 0.5 + 0.5}s`;
        pennyContainer.style.setProperty('--direction', direction);
        penny.style.setProperty('--rotation-duration', rotationDuration);

        pennyContainer.appendChild(penny);
        piggy.parentElement.appendChild(pennyContainer);

        setTimeout(() => {
            pennyContainer.remove();
        }, 1000);
    });

    upgradeButton.addEventListener('click', () => {
        if (checkAndPurchase(upgradeButton, 20, true)) {
            clickIncrement = 2;
            coinValue.textContent = coins;
        }
    });

    autoClickerButton.addEventListener('click', () => {
        if (checkAndPurchase(autoClickerButton, 50, false)) {
            autoIncrement += 1;
            spawnItem('train');
            itemsPurchased.train = true;
        }
    });

    ballButton.addEventListener('click', () => {
        if (checkAndPurchase(ballButton, 100, false)) {
            secondSong.pause();
            autoIncrement += 2;
            spawnItem('ball');
            setTimeout(() => {
                secondSong.play();
            }, 30000); 
            gdsdk.showAd("interstitial");
            coinValue.textContent = coins;
        }
    });

    shoeButton.addEventListener('click', () => {
        if (checkAndPurchase(shoeButton, 150, false)) {
            autoIncrement += 3;
            spawnItem('shoe');
            coinValue.textContent = coins;
        }
    });

    koalaButton.addEventListener('click', () => {
        if (checkAndPurchase(koalaButton, 375, false)) {
            autoIncrement += 5;
            itemsPurchased.koala = true;
            spawnItem('koala');
            showButtonWithSound(secondCursorButton);
            setTimeout(() => {
                showButtonWithSound(rugButton);
            }, 500);
        }
    });

    secondCursorButton.addEventListener('click', () => {
        if (checkAndPurchase(secondCursorButton, 225, true)) {
            clickIncrement += 1;
            coinValue.textContent = coins;
        }
    });

    consoleButton.addEventListener('click', () => {
        if (checkAndPurchase(consoleButton, 1000, false)) {
            autoIncrement += 7;
            spawnItem('console');
            showButtonWithSound(cursorButton350);
            setTimeout(() => {
                showButtonWithSound(plantButton);
                setTimeout(() => {
                    showButtonWithSound(snailButton);
                    setTimeout(() => {
                        showButtonWithSound(cabinetButton);
                    }, 500);
                }, 500);
            }, 500);
        }
    });

    rugButton.addEventListener('click', () => {
        if (checkAndPurchase(rugButton, 1500, false)) {
            autoIncrement += 11;
            spawnItem('rugBig');
            coinValue.textContent = coins;
        }
    });

    cursorButton350.addEventListener('click', () => {
        if (checkAndPurchase(cursorButton350, 350, true)) {
            clickIncrement += 5;
            coinValue.textContent = coins;
        }
    });

    plantButton.addEventListener('click', () => {
        if (checkAndPurchase(plantButton, 1890, false)) {
            autoIncrement += 15;
            spawnItem('plant');
            coinValue.textContent = coins;
        }
    });

    snailButton.addEventListener('click', () => {
        if (checkAndPurchase(snailButton, 2250, false)) {
            autoIncrement += 20;
            spawnItem('snail');
            coinValue.textContent = coins;
        }
    });

    console.log("glueButton", glueButton);

    cabinetButton.addEventListener('click', () => {
        if (checkAndPurchase(cabinetButton, 3000, false)) {
            autoIncrement += 30;
            spawnItem('cabinet');
            setTimeout(() => {
                showButtonWithSound(glueButton);
            }, 500);
            coinValue.textContent = coins;
        }
    });

    glueButton.addEventListener('click', () => {
        if (checkAndPurchase(glueButton, 4222, false)) {
            autoIncrement += 40;
            spawnItem('glue');
            setTimeout(() => {
                showButtonWithSound(fitButton);
                setTimeout(() => {
                    showButtonWithSound(cursorButton550);
                }, 500);
            }, 500);
            coinValue.textContent = coins;
        }
    });

    fitButton.addEventListener('click', () => {
        if (checkAndPurchase(fitButton, 5556, false)) {
            autoIncrement += 55;
            secondSong.pause();
            setTimeout(() => {
                secondSong.play();
            }, 30000); 
            gdsdk.showAd("interstitial");
            spawnItem('fit');
        }
    });

    cursorButton800.addEventListener('click', () => {
        if (checkAndPurchase(cursorButton800, 1000, false)) {
            clickIncrement += 4;
        }
    });

    parrotButton.addEventListener('click', () => {
        if (checkAndPurchase(parrotButton, 8741, false)) {
            autoIncrement += 75;
            spawnItem('parrot');
        }
    });

    couchButton.addEventListener('click', () => {
        if (checkAndPurchase(couchButton, 20000, false)) {
            autoIncrement += 150;
            spawnItem('couch');
        }
    });

    brushButton.addEventListener('click', () => {
        if (checkAndPurchase(brushButton, 10000, false)) {
            autoIncrement += 120;
            spawnItem('brush');
        }
    });

    photoButton.addEventListener('click', () => {
        if (checkAndPurchase(photoButton, 35000, false)) {
            autoIncrement += 20;
            spawnItem('photo');
            setTimeout(() => {
                showButtonWithSound(dogButton);
            }, 500);
        }
    });

    dogButton.addEventListener('click', () => {
        if (checkAndPurchase(dogButton, 50000, false)) {
            autoIncrement += 200;
            spawnItem('brush');
        }
    });

    medalButton.addEventListener('click', () => {
        if (checkAndPurchase(medalButton, 500000, false)) {
            autoIncrement += 1000;
            spawnItem('medal');
        }
    });

    cursorButton1000.addEventListener('click', () => {
        if (checkAndPurchase(cursorButton1000, 2000, false)) {
            clickIncrement += 3;
        }
    });

    cursorButton550.addEventListener('click', () => {
        if (checkAndPurchase(cursorButton550, 550, false)) {
            clickIncrement += 1;
            setTimeout(() => {
                showButtonWithSound(parrotButton);
                setTimeout(() => {
                    showButtonWithSound(cursorButton800);
                    setTimeout(() => {
                        showButtonWithSound(brushButton);
                    }, 500);
                }, 500);
            }, 500);
            coinValue.textContent = coins;
        }
    });

    setInterval(() => {
        console.log(autoIncrement, clickIncrement)
        coins += autoIncrement;
        coinValue.textContent = coins;
    }, 1000);
});
