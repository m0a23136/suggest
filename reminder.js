// 画面の取得
const homePage = document.getElementById("homePage");
const cameraPage = document.getElementById("cameraPage");
const albumPage = document.getElementById("albumPage");

// 表示する撮影お題
const prompts = [
  "雨の日",
  "家の中",
  "花を撮る",
  "食べ物と一緒に撮る",
  "公園で撮る",
  "空を撮る",
  "季節を感じるものを撮る",
  "食べたものを撮る",
  "電車を撮る"
];

// 現在のお題で撮影しているかどうか
let activePromptIndex = null;

// 今日の日付を取得（例：2026-10-29）
function getTodayKey() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 画面を切り替える
function showPage(page) {
  homePage.style.display = "none";
  cameraPage.style.display = "none";
  albumPage.style.display = "none";

  page.style.display = "block";
}

// ホーム画面を更新する
function renderHome() {
  const photos = getPhotos();

  // 次のお題を表示
  const progress =
    Number(localStorage.getItem("promptProgress")) || 0;

  const promptIndex = progress % prompts.length;

  document.getElementById("promptText").textContent =
    prompts[promptIndex];

  // 今日の撮影状況を確認
  const today = getTodayKey();

  const hasPhotoToday = photos.some(
    photo => photo.dateKey === today
  );

  const reminderMessage =
    document.getElementById("reminderMessage");

  if (hasPhotoToday) {
    reminderMessage.textContent =
      "今日の思い出を記録できました！また素敵な瞬間を残してみましょう。";
  } else {
    reminderMessage.textContent =
      "今日はまだ写真を撮っていません。思い出を記録してみませんか？";
  }
}

// お題を指定して撮影する
document
  .getElementById("startPromptShooting")
  .addEventListener("click", () => {
    const progress =
      Number(localStorage.getItem("promptProgress")) || 0;

    activePromptIndex = progress % prompts.length;

    document.getElementById("currentPrompt").textContent =
      "今日のお題：" + prompts[activePromptIndex];

    showPage(cameraPage);
    startCamera();
  });

// 自由に撮影する
document
  .getElementById("startShooting")
  .addEventListener("click", () => {
    activePromptIndex = null;

    document.getElementById("currentPrompt").textContent =
      "自由に撮影";

    showPage(cameraPage);
    startCamera();
  });

// アルバムを開く
document.getElementById("openAlbum").addEventListener("click", () => {
  renderPhotos();
  showPage(albumPage);
});

// カメラ画面からアルバムを開く
document
  .getElementById("openAlbumFromCamera")
  .addEventListener("click", () => {
    stopCamera();
    renderPhotos();
    showPage(albumPage);
  });

// ホームに戻る
document.getElementById("backHome").addEventListener("click", () => {
  stopCamera();
  renderHome();
  showPage(homePage);
});

// アルバムからホームに戻る
document
  .getElementById("backHomeFromAlbum")
  .addEventListener("click", () => {
    renderHome();
    showPage(homePage);
  });

// 最初にホーム画面を表示
renderHome();
showPage(homePage);