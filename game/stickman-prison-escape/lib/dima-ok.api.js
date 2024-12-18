var _isPause = false;

function initSDK() {
    let options = {
        // если присутствует данный параметр, то автоопределение платформы пропустится
        // и бридж подключит SDK указанной платформы
        //forciblySetPlatformId: 'yandex',

        platforms: {
            // если вы выпускаете игру на Game Distribution, то необходимо указать её айди
            'game_distribution': { 
                gameId: '7d9835f1ceb748c1aeec18c6472870b5'
            },
            // если вы выпускаете игру в VK Play, то необходимо указать её айди
            // 'vk_play': { 
            //     gameId: '33134'
            // }
        }
    };
    bridge.initialize(options)
        .then(() => {
            initPayments();

            showAd();
        })
        .catch(error => {
        });

}

function gameLoaded() {
    bridge.platform.sendMessage("game_ready");
}

function gameLoop(e) {
    if (createjs.Sound.paused) {
        return;
    }
    stage.update(e);
    //stage(e);
}
var sounds = {};
function playSound(id, loop, offset) {
    if (createjs.Sound.paused) {
        return;
    }
    let sound = createjs.Sound.play(id, {'interrupt':createjs.Sound.INTERRUPT_EARLY, 'loop': loop, 'offset': offset});
    sound.on("complete", onHandleCompleted, this);
    sound.id = id;
    sounds[id] = sound;
    function onHandleCompleted(e) {
        let id = e.currentTarget.id;
        if (typeof sounds[id] !== "undefined" && !sounds[id].loop) {
            sounds[id].stop();
            delete sounds[id];
        }
    }
    return sound;
}
function visiblePauseScreen(isVisible) {
    if (_isPause) {
        return;
    }

    if (typeof exportRoot !== "undefined") {
        let pauseScreen = exportRoot.pauseBlocker;
        pauseScreen.visible = isVisible;
        stage.update();

        if (isVisible) {
            pauseScreen.addEventListener("click", resumeAllSounds.bind(this));
        } else {
            pauseScreen.removeAllEventListeners();
        }
    }
}
function pauseAllSounds() {
    visiblePauseScreen(true);
    createjs.Sound.paused = true;
    createjs.Sound.muted = true;
    Object.values(sounds).forEach(sound => {
        sound.paused = true;
    });
}
function resumeAllSounds() {
    if (_isPause) {
        return;
    }
    visiblePauseScreen(false);
    createjs.Sound.paused = false;
    createjs.Sound.muted = false;
    Object.values(sounds).forEach(sound => {
        sound.paused = false;
    });
}
function showAd() {
    bridge.advertisement.on(bridge.EVENT_NAME.INTERSTITIAL_STATE_CHANGED, state => {
        switch (state) {
            case "loading":
                break;

            case "opened":
                _isPause = true;
                pauseAllSounds();
                break;

            case "closed":
            case "failed":
                _isPause = false;
                resumeAllSounds();
                break;
        }
    });
    bridge.advertisement.showInterstitial();
}

// Save & Restore system
var _localSaveData = {
    currentLabel: null,
    paused: true
};
function isLocalStorageAvailable() {
    var test = "test";
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}
function saveGame() {
    switch (exportRoot.currentLabel) {
        case "q1":
        case "q3":
            break;

        default:
            if (isLocalStorageAvailable()) {
                localStorage.setItem("currentLabel", exportRoot.currentLabel);
                localStorage.setItem("paused", exportRoot.paused);
            } else {
                _localSaveData.currentLabel = exportRoot.currentLabel;
                _localSaveData.paused = exportRoot.paused;
            }
            break;
    }
}
function loadGame() {
    if (isLocalStorageAvailable()) {
        exportRoot.gotoAndStop(localStorage.getItem("currentLabel") || 0);
        if (localStorage.getItem("paused") == "false") {
            exportRoot.play();
        }
    } else {
        exportRoot.gotoAndStop(_localSaveData.currentLabel || 0);
        if (_localSaveData.paused == "false") {
            exportRoot.play();
        }
    }
}
function clearSaveGame() {
    if (isLocalStorageAvailable()) {
        localStorage.clear();
    } else {
        _localSaveData.currentLabel = null;
        _localSaveData.paused = true;
    }
}
function isLoadGame() {
    if (isLocalStorageAvailable()) {
        return localStorage.getItem("currentLabel") !== null;
    } else {
        return _localSaveData.currentLabel !== null;
    }
}


var _isDelayPause = false;
window.addEventListener("blur", pauseAllSounds.bind(this));
window.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        pauseAllSounds();
    }
});


// Payments
var isSecretLevel = false;
const SECRET_LEVEL = "secret_level";
function initPayments() {
}

function openSecretLevel() {
    let options = {};
    switch (bridge.platform.id) {
        case "yandex":
            options = {
                id: SECRET_LEVEL
            };
            break;
    }

    bridge.payments.purchase(options)
        .then(() => {
            isSecretLevel = true;
            window.dispatchEvent(new CustomEvent(SECRET_LEVEL, { "detail": {"result": true} }));
        })
        .catch(error => {
            window.dispatchEvent(new CustomEvent(SECRET_LEVEL, { "detail": {"result": false} }));
        });
}

function checkIsSecretLevel() {
    bridge.payments.getPurchases()
        .then(purchases => {
            // данные успешно получены
            purchases.forEach(purchase => {
                if (purchase.productID === SECRET_LEVEL) {
                    isSecretLevel = true;
                    window.dispatchEvent(new CustomEvent(SECRET_LEVEL, { "detail": {"result": true} }));
                    return;
                }
            });
            window.dispatchEvent(new CustomEvent(SECRET_LEVEL, { "detail": {"result": false} }));
        })
        .catch(error => {
            // ошибка, что-то пошло не так
            window.dispatchEvent(new CustomEvent(SECRET_LEVEL, { "detail": {"result": false} }));
        });
}
