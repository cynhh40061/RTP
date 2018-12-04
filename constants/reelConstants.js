const tools = require('../util/tool');
const urlConstants = require('../constants/urlConstants');

// 讀取 BaseGame JSON 檔
const jsonObj = JSON.parse(tools.readFile(urlConstants.BaseGameJsonUrl));

// 讀取 BounsGame1 JSON 檔
exports.BounsGame1Obj = JSON.parse(tools.readFile(urlConstants.BOUNS_GAME_1_URL));
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

// 
exports.totalWinObj = {
    1: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
    2: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
    3: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
    4: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
    5: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
    11: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
    12: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
    13: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
    14: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
    15: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
    20: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
    // 50: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
    totalWinBonus: 0,
};

// 所有測試過的 Reel 組合 JSON 檔
exports.reelAllArray = [];
// 高賠率 Reel 組合 JSON 檔
exports.reelHighRangeArray = [];
// 低賠率 Reel 組合 JSON 檔
exports.reelLowRangeArray = [];
// 一般賠率 Reel 組合 JSON 檔
exports.reelNomalRangeArray = [];