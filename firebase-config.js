// ───────────────────────────────────────────────────────────
//  QQQQAAAA 共用 Firebase 設定（submit / screen / draw / admin / loadtest 共用）
//
//  部署步驟見 deploy-guide.md，重點：
//  1. https://console.firebase.google.com 建立專案（免費 Spark 方案即可）
//  2. 建立 Realtime Database，區域選 asia-southeast1（新加坡，離台灣最近）
//  3. 專案設定 → 你的應用程式 → 新增網頁應用程式 → 把 firebaseConfig 貼到下方
//  4. Realtime Database → 規則 → 貼上 database.rules.json 的內容後發布
// ───────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey: "AIzaSyAYV1-M1BbvJwjk8i9NDPY2nN6Dty-P6Z8",
  authDomain: "qqqqaaaa.firebaseapp.com",
  databaseURL: "https://qqqqaaaa-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "qqqqaaaa",
};

// 房間代號：彩排與正式演出用不同 room，資料互不干擾。
// 彩排用 qqqqaaaa-rehearsal，演出當天改成 qqqqaaaa-live 再重新整理各頁面。
const ROOM = "qqqqaaaa-rehearsal";

// 各頁共用初始化。設定未填、SDK 沒載到（CDN 掛掉）或初始化失敗時回傳 null，
// 失敗原因放在 QQQQ_INIT_ERROR，頁面必須顯示明確提示（不可白屏）。
var QQQQ_INIT_ERROR = null;
function initQQQQDb(){
  if (typeof firebase === 'undefined'){
    QQQQ_INIT_ERROR = 'Firebase SDK 載入失敗（現場請確認網路後重新整理）';
    return null;
  }
  if (!firebaseConfig.databaseURL || firebaseConfig.databaseURL === "PASTE_HERE"){
    QQQQ_INIT_ERROR = '尚未設定 Firebase（請照 deploy-guide.md 填 firebase-config.js）';
    return null;
  }
  try {
    firebase.initializeApp(firebaseConfig);
    return firebase.database();
  } catch(e){
    QQQQ_INIT_ERROR = 'Firebase 初始化失敗：' + e.message;
    return null;
  }
}

// 資料模型備忘（實際權限限制在 database.rules.json）：
// rooms/{ROOM}/submissions/{pushId} = {
//   table: "B3"~"B30", nick: ≤4字, question: ≤25字, ts: ServerValue.TIMESTAMP,
//   status?: "approved"|"blocked"（僅 admin 寫入）,
//   drawnAt?: timestamp, tone?: 1|2|3|4（僅 draw 寫入）
// }
// rooms/{ROOM}/control = { clearAt?, drawCutoffAt?, lastTone? }
