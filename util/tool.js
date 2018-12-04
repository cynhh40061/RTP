var fs = require('fs');

/*
通用工具
    isNull：是否有值(回傳 boolean)
    isVal：是否有值(回傳 value)
    readFile：讀取資料
    writeFile：寫入資料
    appendNewFile：新建立檔案
    exit：離開 nodejs
*/

exports.isNull = (val) => {
    if (val == undefined || val == null) {
        return false;
    } else {
        return true;
    }
}

exports.isVal = (val) => {
    if (val == undefined || val == null) {
        return null;
    } else {
        return val;
    }
}

exports.readFile = (url) => {
    try {
        let data = fs.readFileSync(url, function (err, data) {
            if (err) {
                console.error(err);
                exit();
            }
            else {
                return data
            }
        }).toString('utf8');
        return data;
    } catch (e) {
        console.error(e);
    }
    return undefined;
}

exports.writeFile = async (url, data) => {
    await fs.writeFile(url, data, "UTF8", function (err) {
        if (err) throw err;
        console.log("檔案寫入操作完成!");
    })
    console.log("檔案寫入操作中 ... ");
}

exports.appendNewFile = (url, data) => {
    fs.appendFile(url, data, function (err) {
        if (err) {
            console.error(err);
            exit()
        }
        else {
            console.log('done!');
        }
    });
}

exit = (str) => {
    if (str) {
        console.error(str);
    }
    process.exit();
}

/*
    確認此筆reel是否中獎
*/

const reelConsts = require('../constants/reelConstants');

exports.checkReelRate = (reelSampling) => {
    var Reel1 = reelSampling['Reel1'];
    var rCount = 1;
    var rCombo = 0;
    var obj = {};

    for (var i = 0; i < Reel1.length; i++) {
        rCount = 1;
        rCombo = 0;
        for (var j = 0; j < Object.keys(reelSampling).length; j++) {
            var key = Object.keys(reelSampling)[j];
            var count = 0;
            for (var k = 0; k < Reel1.length; k++) {
                if (Reel1[i] == reelSampling[key][k] || 50 == reelSampling[key][k]) {
                    count++;
                }
            }
            if (count != 0) {
                rCount = rCount * count;
                rCombo++;
            }
            else {
                break;
            }
        }
        if (rCombo >= 3) {
            obj[Reel1[i]] = { 'winCombo': rCombo, 'winCount': rCount, 'winBaseLine': reelConsts.baseLine[Reel1[i]][rCombo] };
        }
    }

    // console.log(reelSampling);
    // console.log(obj);
    return obj;
}

/*
    根據號碼分類中獎
*/
exports.winNumberClassify = (winObj) => {
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

        totalObj[key]['winBonus'] = totalObj[key]['winBonus'] + thisReelLine;
        totalObj['totalWinBonus'] = totalObj['totalWinBonus'] + thisReelLine;

        reelClassifyByRange(thisReelLine, thisReelNum);
    }
}

/*
    根據賠率分類 Reel 組合，紀錄到 JSON 檔
*/
reelClassifyByRange = (reelLine, reelNum) => {
    if (reelLine > reelConsts.reelHighRange) {
        reelConsts.reelHighRangeArray.push(reelNum);
    } else if (reelConsts.reelLowRange <= reelLine && reelLine <= reelConsts.reelHighRange) {
        reelConsts.reelNomalRangeArray.push(reelNum);
    } else if (reelLine < reelConsts.reelLowRange) {
        reelConsts.reelLowRangeArray.push(reelNum);
    }
}
