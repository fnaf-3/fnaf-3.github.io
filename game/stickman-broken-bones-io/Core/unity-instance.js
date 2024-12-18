const buildUrl = "Build";
const loaderUrl = buildUrl + "/build.loader.js";
const config = {
    dataUrl: buildUrl + "/8f60a1f7307ab66933764eebd0d524d8.data.unityweb",
    frameworkUrl: buildUrl + "/fbc834c5c148997524ef263b88ef2bcc.js.unityweb",
    codeUrl: buildUrl + "/d627a4f7aeb993eb385690dbb5efbe47.wasm.unityweb",
        streamingAssetsUrl: "StreamingAssets",
    companyName: "MirraGames",
    productName: "Stickman Broken Bones io",
    productVersion: "1.0.0",
};

const container = document.querySelector("#unity-container");
const canvas = document.querySelector("#unity-canvas");

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    container.className = "unity-mobile";
}

function focusOnGame() {
    container.focus();
    window.focus();
    canvas.focus();
}

const script = document.createElement("script");
var unityI = null;
script.src = loaderUrl;
script.onload = async () => {
    await _gpAwaiter.ready;
    createUnityInstance(canvas, config, (progress) => {
        updateProgress(100 * progress);
    }).then((unityInstance) => {
        _unityAwaiter.done(unityInstance);
        unityI = unityInstance;
        focusOnGame();
    }).catch((message) => {
        _unityAwaiter.abort(message);
        alert(message);
    });
};
document.body.appendChild(script);

document.addEventListener("pointerdown", focusOnGame);
