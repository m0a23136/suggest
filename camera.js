// カメラ関連の要素
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");
const switchCameraBtn = document.getElementById("switchCameraBtn");

let stream = null;
let facingMode = "environment";

// カメラを起動する
async function startCamera() {
  stopCamera();

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode },
      audio: false
    });

    video.srcObject = stream;
    await video.play();
  } catch (error) {
    console.error("カメラを起動できませんでした:", error);
    alert("カメラを起動できませんでした。カメラの使用を許可してください。");
  }
}

// カメラを停止する
function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  video.srcObject = null;
}

// カメラを切り替える
switchCameraBtn.addEventListener("click", async () => {
  facingMode = facingMode === "environment" ? "user" : "environment";
  await startCamera();
});

// 撮影・保存
captureBtn.addEventListener("click", () => {
  if (!video.videoWidth || !video.videoHeight) {
    alert("カメラの準備ができていません。");
    return;
  }

  const context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/jpeg", 0.5);
  const memo = prompt("この写真の思い出を入力してください");

  // キャンセルされた場合は保存しない
  if (memo === null) {
    return;
  }

  const photos = getPhotos();
  const today = new Date();

  // 写真データを作成
  const newPhoto = {
    id: Date.now(),
    image: imageData,
    tags: [],
    memo: memo,
    date: today.toLocaleString("ja-JP"),
    dateKey: getTodayKey(),
    promptIndex: activePromptIndex
  };

  photos.push(newPhoto);
  savePhotos(photos);

  // お題に沿って撮影した場合のみ、次のお題に進む
  if (activePromptIndex !== null) {
    const progress =
      Number(localStorage.getItem("promptProgress")) || 0;

    localStorage.setItem("promptProgress", progress + 1);
    activePromptIndex = null;
  }

  alert("保存しました！");

  // ホーム画面の記録状況を更新
  renderHome();

  // カメラを停止してホームへ戻る
  stopCamera();
  showPage(homePage);
});