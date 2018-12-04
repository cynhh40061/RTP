const tools = require('../util/tool');
const reelConsts = require('../constants/reelConstants');
const urlConstants = require('../constants/urlConstants');
const config = require('../config');

/**
 * 以亂數從 reelJSON 取出測試 Array[5][3]，並將此次亂數值存入 reelAllArray
 * @param {object} reelObj reel資料
 * @returns {object} obj 亂數取出的 Array[5][3]
 */
getReelRandom = (reelObj) => {
    var obj = {};
    var rArray = [];

    for (let i = 1; i <= Object.keys(reelObj).length; i++) {
        subReel = reelObj['Reel' + i];
        var randomNum = parseInt(Math.random() * subReel.length);

        if (randomNum == 0) {
            obj['Reel' + i] = [subReel[subReel.length - 1], subReel[0], subReel[1]];
        } else if (randomNum == subReel.length - 1) {
            obj['Reel' + i] = [subReel[subReel.length - 2], subReel[subReel.length - 1], subReel[0]];
        } else {
            obj['Reel' + i] = [subReel[randomNum - 1], subReel[randomNum], subReel[randomNum + 1]];
        }

        rArray.push(randomNum);
    }

    reelConsts.reelAllArray.push(''.concat(rArray[0], '|', rArray[1], '|', rArray[2], '|', rArray[3], '|', rArray[4]));

    return obj;
}

/**
 * 根據號碼分類中獎
 * @param {obj} winObj 中獎資料
 */
winNumberClassify = (winObj) => {
    var totalObj = reelConsts.totalWinObj;
    var keys = Object.keys(winObj);

    for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var thisReelLine = winObj[key]['winBaseLine'] * winObj[key]['winCount'];
        var thisReelNum = reelConsts.reelAllArray[reelConsts.reelAllArray.length - 1];

        if (winObj[key]['winCombo'] == 3) {
            totalObj[key]['threeCombo'] = totalObj[key]['threeCombo'] + 1;
            totalObj[key]['threeComboBonus'] = totalObj[key]['threeComboBonus'] + winObj[key]['winBaseLine'] * winObj[key]['winCount'];
        } else if (winObj[key]['winCombo'] == 4) {
            totalObj[key]['fourCombo'] = totalObj[key]['fourCombo'] + 1;
            totalObj[key]['fourComboBonus'] = totalObj[key]['fourComboBonus'] + winObj[key]['winBaseLine'] * winObj[key]['winCount'];
        } else if (winObj[key]['winCombo'] == 5) {
            totalObj[key]['fivesCombo'] = totalObj[key]['fivesCombo'] + 1;
            totalObj[key]['fivesComboBonus'] = totalObj[key]['fivesComboBonus'] + winObj[key]['winBaseLine'] * winObj[key]['winCount'];
        }

        if (key == config.SPECIAL_NUMBER && config.FREE_GAME_CHECK_SWITCH) {
            totalObj['totalWinBonus'] = totalObj['totalWinBonus'] + thisReelLine + tools.getFreeGameBouns(0);
        } else {
            totalObj[key]['winBonus'] = totalObj[key]['winBonus'] + thisReelLine;
            totalObj['totalWinBonus'] = totalObj['totalWinBonus'] + thisReelLine;
        }

        reelClassifyByRange(thisReelLine, thisReelNum);
    }
}

/**
 * 根據賠率分類 Reel 組合，紀錄到 JSON 檔
 * @param {number} reelLine 賠率
 * @param {number} reelNum Reel 組合編號
 */
reelClassifyByRange = (reelLine, reelNum) => {
    if (reelLine > config.REEL_HIGH_RANGE) {
        reelConsts.reelHighRangeArray.push(reelNum);
    } else if (config.REEL_LOW_RANGE <= reelLine && reelLine <= config.REEL_HIGH_RANGE) {
        reelConsts.reelNomalRangeArray.push(reelNum);
    } else if (reelLine < config.REEL_LOW_RANGE) {
        reelConsts.reelLowRangeArray.push(reelNum);
    }
}

/**
* main function 執行指定測試次數
* @param {number} runTimes 測試次數
*/
main = (runTimes) => {
    for (var i = 1; i <= runTimes; i++) {
        var reelSampling = getReelRandom(reelConsts.reelObj);
        var winObj = tools.checkReelRate(reelSampling);
        winNumberClassify(winObj);
    }

    infoOutput(runTimes);
}

/**
 * 輸出(中獎資訊、 RTP 訊息、 Reel 組合) 
 * @param {number} times 測試次數
 */
infoOutput = (times) => {
    var totalObj = reelConsts.totalWinObj;
    var str = "";
    str += "測試次數： " + times + "\n";

    for (let k in totalObj) {
        if (k !== "totalWinBonus") {
            str += "--------------------------------------------------------------- \n";
            str += "中獎號： " + k + "\n";
            str += "三條線中獎次數： " + totalObj[k]["threeCombo"] + "\n";
            str += "三條線中獎平均： " + (Math.floor((totalObj[k]["threeCombo"] / times) * 10000) / 100) + "\n";
            str += "三條線總中獎金額： " + totalObj[k]["threeComboBonus"] + "\n";
            str += "四條線中獎次數： " + totalObj[k]["fourCombo"] + "\n";
            str += "四條線中獎平均： " + (Math.floor((totalObj[k]["fourCombo"] / times) * 10000) / 100) + "\n";
            str += "四條線總中獎金額： " + totalObj[k]["fourComboBonus"] + "\n";
            str += "五條線中獎次數： " + totalObj[k]["fivesCombo"] + "\n";
            str += "五條線中獎平均： " + (Math.floor((totalObj[k]["fivesCombo"] / times) * 10000) / 100) + "\n";
            str += "五條線總中獎金額： " + totalObj[k]["fivesComboBonus"] + "\n";
            str += "單號總中獎金額： " + totalObj[k]["winBonus"] + "\n";
        }
    }
    str += "--------------------------------------------------------------- \n";
    str += "全部總中獎金額： " + totalObj["totalWinBonus"] + "\n";
    str += "RTP： " + (totalObj["totalWinBonus"] / (times * config.PLAYER_BET)) + "\n";
    str += "--------------------------------------------------------------- \n";

    var RTPs = Math.floor((totalObj["totalWinBonus"] / (times * config.PLAYER_BET)) * 10000) / 10000;

    if (config.BASE_GAME_CHECK_INSERT_ALL_REEL_NUM_SWITCH) {
        reelConsts.reelAllNumObj[RTPs] = reelConsts.reelAllArray;
        tools.writeFile(urlConstants.ReelAllNumJsonUrl, JSON.stringify(reelConsts.reelAllNumObj));
        console.log(Object.keys(reelConsts.reelAllNumObj));
    }

    if (config.BASE_GAME_CHECK_INSERT_HIGH_RANG_REEL_NUM_SWITCH) {
        reelConsts.reelHighRangeNumObj[RTPs] = reelConsts.reelHighRangeArray;
        tools.writeFile(urlConstants.ReelHighRangeNumJsonUrl, JSON.stringify(reelConsts.reelHighRangeNumObj));
        console.log(Object.keys(reelConsts.reelHighRangeNumObj));
    }

    if (config.BASE_GAME_CHECK_APPEND_FILE_SWITCH) {
        tools.appendNewFile(__dirname + '/TestFile/Test_測試數' + times + '_' + new Date().getTime() + '.txt', str);
    }
    console.log(RTPs);
}

main(config.BASE_GAME_CHECK_RUN_TIMES);
