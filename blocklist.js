// ───────────────────────────────────────────────────────────
//  QQQQAAAA 黑名單＋審核判定（screen / draw / admin 共用）
//
//  ★ AUTO_HOLD（2026/08/13 決策：預設不做事前審核）
//    false＝觀眾投了就直接上幕、直接進抽題池（黑名單不自動壓）
//    true ＝踩到黑名單的投稿自動壓住（held），後台放行才上幕
//    現場若有人鬧場，把下面這行改成 true、重新整理各頁面即可恢復審核。
// ───────────────────────────────────────────────────────────

const AUTO_HOLD = false;

const BLOCKLIST = ['雞巴', '幹你娘', '陰莖', '尻', '幹'];

// 「無辜白名單」：含「幹」但其實沒事的詞。比對前先把這些挖掉，
// 才不會把「幹嘛 / 能幹」這種日常用詞誤殺。
const BLOCK_WHITELIST = [
  '幹部', '幹練', '能幹', '骨幹', '才幹', '主幹', '樹幹',
  '幹勁', '苦幹', '實幹', '幹活', '幹嘛', '幹線', '幹道'
];

// 回傳 true = 踩到黑名單（要壓著等放行）
function hitsBlocklist(it){
  let text = [it.nick, it.question].join(' ');
  for(const w of BLOCK_WHITELIST) text = text.split(w).join('');   // 先放掉無辜詞
  return BLOCKLIST.some(w => w && text.includes(w));
}

// 審核判定（單一真相，screen 上幕與 draw 抽題池都必須用這個）：
// 'approved' 手動放行｜'blocked' 手動擋下
// 'held' 踩黑名單待放行（僅 AUTO_HOLD 為 true 時會出現）｜'live' 直接上幕
function statusOf(it){
  if (it.status === 'approved') return 'approved';
  if (it.status === 'blocked')  return 'blocked';
  if (AUTO_HOLD && hitsBlocklist(it)) return 'held';
  return 'live';
}

// 合格 = 可上幕、可進抽題池
function isEligible(it){
  const s = statusOf(it);
  return s === 'approved' || s === 'live';
}
