let hints = {
    "en": [
        "Hacking the Pentagon",
        "Counting to Infinity",
        "Asking the AI",
        "Connecting to Satellite",
        "Looking for a Pie recipe",
        "Ordering Kebab",
        "Searching for UFO",
        "Come on, Smile :)"
    ],
    "fr": [
        "Piratage du Pentagone",
        "Compter jusqu'à l'infini",
        "Demander à l'IA",
        "Se connecter à un satellite",
        "Chercher une recette de tarte",
        "Commander un kebab",
        "Recherche d'un OVNI",
        "Allez, souris :)"
    ],
    "it": [
        "Hackerare il Pentagono",
        "Contare all'infinito",
        "Chiediamo AI",
        "Connettersi al satellite",
        "Cercare la ricetta di una torta",
        "Ordinare Kebab",
        "Ricerca di un UFO",
        "Dai, sorridi :)"
    ],
    "de": [
        "Hacking the Pentagon",
        "Zählen bis zur Unendlichkeit",
        "Die KI befragen",
        "Eine Verbindung zum Satelliten herstellen",
        "Ein Kuchenrezept suchen",
        "Kebab bestellen",
        "Suche nach UFO",
        "Komm schon, lächle :)"
    ],
    "es": [
        "Hackeando el Pentágono",
        "Contando hasta el infinito",
        "Preguntando a la IA",
        "Conectarse al satélite",
        "Buscando una receta de tarta",
        "Pidiendo Kebab",
        "Buscando un OVNI",
        "Vamos, Sonríe :)"
    ],
    "zh": [
        "黑进五角大楼",
        "数到无穷大",
        "询问人工智能",
        "连接到卫星",
        "寻找派的配方",
        "订购烤肉",
        "寻找UFO",
        "来吧，微笑 :)"
    ],
    "pt": [
        "Hackear o Pentágono",
        "Contar até ao infinito",
        "Perguntar à IA",
        "Ligar a um satélite",
        "À procura de uma receita de tarte",
        "Encomendar um Kebab",
        "À procura de um OVNI",
        "Vá lá, sorri :)"
    ],
    "ko": [
        "펜타곤 해킹",
        "무한대까지 세기",
        "AI에게 물어보기",
        "위성에 연결",
        "파이 레시피 찾기",
        "케밥 주문",
        "UFO 검색 중",
        "어서, 웃어 :)"
    ],
    "ja": [
        "ペンタゴンをハッキング",
        "無限大に数える",
        "AIに聞く",
        "衛星に接続する",
        "パイのレシピを探す",
        "ケバブを注文する",
        "「UFOを探す",
        "さあ、笑顔で :)"
    ],
    "ru": [
        "Взламываем Пентагон",
        "Считаем до Бесконечности",
        "Спрашиваем у Нейросети",
        "Подключаемся к Спутнику",
        "Ищем рецепт Пирога",
        "Заказываем Шаурму",
        "Ведем поиск НЛО",
        "Давай, улыбнись :)"
    ],
    "tr": [
        "Pentagon'u Hacklemek",
        "Sonsuza Kadar Saymak",
        "Yapay Zekaya Sormak",
        "Uyduya Bağlanmak",
        "Turta tarifi arıyorum",
        "Kebap Siparişi",
        "UFO aranıyor",
        "Hadi, Gülümse :)"
    ],
    "ar": [
        "اختراق البنتاغون",
        "العد إلى ما لا نهاية",
        "يسأل منظمة العفو الدولية",
        "الاتصال بالقمر الصناعي",
        "أبحث عن وصفة فطيرة",
        "طلب كباب",
        "البحث عن جسم غامض",
        "هيا ، ابتسم :)"
    ],
    "hi": [
        "पेंटागन हैकिंग",
        "अनंत की गिनती",
        "एआई से पूछना",
        "उपग्रह से जुड़ना",
        "एक पाई नुस्खा की तलाश में",
        "कबाब ऑर्डर करना",
        "यूएफओ की खोज",
        "चलो, मुस्कुराओ :)"
    ],
    "id": [
        "Meretas Pentagon",
        "Menghitung hingga Tak Terbatas",
        "Bertanya kepada AI",
        "Menghubungkan ke Satelit",
        "Mencari resep Pai",
        "Memesan Kebab",
        "Mencari UFO",
        "Ayo, Tersenyumlah :)"
    ]
};

const loadingRoot = document.getElementById("loading-screen");
const hintElement = document.getElementById("hint");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

let currentHint = -1;
let showDots = true;
let currentLanguage = "ru";
let showHints = false;

function updateHint() {
    if (showHints) {
        currentHint = (currentHint + 1) % hints[currentLanguage].length;
        hintElement.textContent = hints[currentLanguage][currentHint];
        showDots = currentHint != 7;
        return;
    }
    hintElement.textContent = " ";
    showDots = false;
}

function updateProgress(progress) {
    var int_progress = Math.ceil(progress / 0.9);
    int_progress = int_progress > 100 ?
        100 : int_progress < 0 ? 0 : int_progress;
    progressBar.style.width = `${int_progress}%`;
    progressText.textContent = `${int_progress}%`;
}

function onProgressDone() {
    hideLoadingScreen();
}

const dots = document.getElementById('dots');
let dotCount = 0;

let loadingDone = false;

function dot_interval() {
    dotCount = (dotCount + 1) % 4;
    dots.textContent = showDots ? ".".repeat(dotCount) : " ";
}

function hideLoadingScreen() {
    if (loadingDone) return;
    document.getElementById("loading-screen").style.opacity = 0.0;
    setTimeout(() => {
        clearInterval(updateHint);
        clearInterval(dot_interval);
        loadingRoot.style.display = "none";
        loadingRoot.remove();
        console.log("Loading screen is done and deleted.");
    }, 500);
    loadingDone = true;
}
