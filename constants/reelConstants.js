const tools = require('../util/tool');
const urlConstants = require('../constants/urlConstants');

// 讀取 BaseGame JSON 檔
const jsonObj = JSON.parse(tools.readFile(urlConstants.BaseGameJsonUrl));

// 讀取 所有測試過的 Reel 組合 JSON 檔
exports.reelAllNumObj = JSON.parse(tools.readFile(urlConstants.ReelAllNumJsonUrl));
// 讀取 高賠率 Reel 組合 JSON 檔
exports.reelHighRangeNumObj = JSON.parse(tools.readFile(urlConstants.ReelHighRangeNumJsonUrl));

// 讀取 BaseGame JSON 檔 的 Reel
exports.reelObj = jsonObj['Reel'];
// 讀取 BaseGame JSON 檔 的 mappingTable
exports.mappingTableObj = jsonObj['mappingTable'];
// 讀取 BaseGame JSON 檔 的 baseLine
exports.baseLine = jsonObj['baseLine'];

// 高賠率範圍
exports.reelHighRange = 1000;
// 低賠率範圍
exports.reelLowRange = 100;

// 所有測試過的 Reel 組合 JSON 檔
exports.reelAllJson = [];
// 高賠率 Reel 組合 JSON 檔
exports.reelHighRangeJson = [];
// 低賠率 Reel 組合 JSON 檔
exports.reelLowRangeJson = [];
// 一般賠率 Reel 組合 JSON 檔
exports.reelNomalRangeJson = [];

// 下注金額
exports.PLAYER_BET = 88;



