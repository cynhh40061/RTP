var fs = require('fs');
const config = require('../config');

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
                console.error(data);
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
                if (Reel1[i] == reelSampling[key][k] || config.ANY_NUMBER == reelSampling[key][k]) {
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

const tools = require('../util/tool');

/**
 * 以亂數從 bonusJSON 取出測試 Array[5][3]
 * @param {obj} reelObj reel資料
 * @returns {object} obj 亂數取出的 Array[5][3]
 */
exports.getReelRandomFromBounsGame = (reelObj) => {
    var obj = {};

    for (let i = 0; i < Object.keys(reelObj).length; i++) {
        var keys = Object.keys(reelObj);
        if (keys[i] != 'Times') {
            var key = keys[i];
            subReel = reelObj[key];
            var randomNum = parseInt(Math.random() * subReel.length);

            if (randomNum == 0) {
                obj[key] = [subReel[subReel.length - 1], subReel[0], subReel[1]];
            } else if (randomNum == subReel.length - 1) {
                obj[key] = [subReel[subReel.length - 2], subReel[subReel.length - 1], subReel[0]];
            } else {
                obj[key] = [subReel[randomNum - 1], subReel[randomNum], subReel[randomNum + 1]];
            }
        }
    }

    return obj;
}

/**
 * 取得freeGame中獎金額
 * @param {number} freeGameBouns 中獎金額
 * @returns {number} freeGameBouns 中獎金額
 */
exports.getFreeGameBouns = (freeGameBouns) => {
    var BounsGame1Obj = reelConsts.BounsGame1Obj['bounsGame1'];
    for (var i = 1; i <= BounsGame1Obj['Times']; i++) {
        var reelSampling = tools.getReelRandomFromBounsGame(BounsGame1Obj);
        var winObj = tools.checkReelRate(reelSampling);
        var keys = Object.keys(winObj);

        for (var j = 0; j < keys.length; j++) {
            var key = keys[j];
            if (key == config.SPECIAL_NUMBER) {
                freeGameBouns = tools.getFreeGameBouns(freeGameBouns);
            }
            freeGameBouns = freeGameBouns + winObj[key]['winBaseLine'] * winObj[key]['winCount'];
        }
    }
    return freeGameBouns;
}