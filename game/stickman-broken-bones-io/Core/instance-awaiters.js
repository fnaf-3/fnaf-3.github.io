var _unityAwaiter = { };
_unityAwaiter.ready = new Promise((resolve, reject) => {
    _unityAwaiter.done = resolve;
    _unityAwaiter.abort = reject;
});

var _gpAwaiter = { };
_gpAwaiter.ready = new Promise((resolve) => {
    _gpAwaiter.done = resolve;
});

window.onGPInit = async (gp) => {
    gp.player.ready.finally(_gpAwaiter.done);

    // Now can show hints.
    currentLanguage = gp.language;
    showHints = true;
    updateHint();
    setInterval(updateHint, 5000);
    setInterval(dot_interval, 250);

    await _unityAwaiter.ready;
    window.GamePush = new GamePushUnity(gp, unityI);
    unityI.SendMessage("Receiver", "OnReady");
    gp.gameStart();
};
