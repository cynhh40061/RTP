const tools = require('../util/tool');
const reelConsts = require('../constants/reelConstants');
const urlConstants = require('../constants/urlConstants');

/*
    以亂數從 BaseGame.json 取出測試 Array[5][3]，並將此次亂數值存入 reelAllJson
*/
getReelRandom = () => {
    var obj = {};
    var rArray = [];

    for (let i = 1; i <= Object.keys(reelConsts.reelObj).length; i++) {
        subReel = reelConsts.reelObj['Reel' + i];
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

/*
    main function 執行指定測試次數
*/
main = (runTimes) => {
    var totalObj = reelConsts.totalWinObj;

    for (var i = 1; i <= runTimes; i++) {
        var reelSampling = getReelRandom();
        var winObj = tools.checkReelRate(reelSampling);
        tools.winNumberClassify(winObj);
    }

    infoOutput(runTimes, totalObj);
}

/*
    輸出(中獎資訊、 RTP 訊息、 Reel 組合)
*/
infoOutput = (times, obj) => {
    var str = "";
    str += "測試次數： " + times + "\n";
    for (let k in obj) {
        if (k !== "totalWinBonus") {
            str += "--------------------------------------------------------------- \n";
            str += "中獎號： " + k + "\n";
            str += "三條線中獎次數： " + obj[k]["threeCombo"] + "\n";
            str += "三條線中獎平均： " + (Math.floor((obj[k]["threeCombo"] / times) * 10000) / 100) + "\n";
            str += "三條線總中獎金額： " + obj[k]["threeComboBonus"] + "\n";
            str += "四條線中獎次數： " + obj[k]["fourCombo"] + "\n";
            str += "四條線中獎平均： " + (Math.floor((obj[k]["fourCombo"] / times) * 10000) / 100) + "\n";
            str += "四條線總中獎金額： " + obj[k]["fourComboBonus"] + "\n";
            str += "五條線中獎次數： " + obj[k]["fivesCombo"] + "\n";
            str += "五條線中獎平均： " + (Math.floor((obj[k]["fivesCombo"] / times) * 10000) / 100) + "\n";
            str += "五條線總中獎金額： " + obj[k]["fivesComboBonus"] + "\n";
            str += "單號總中獎金額： " + obj[k]["winBonus"] + "\n";
        }
    }
    str += "--------------------------------------------------------------- \n";
    str += "全部總中獎金額： " + obj["totalWinBonus"] + "\n";
    str += "RTP： " + (obj["totalWinBonus"] / (times * 88)) + "\n";
    str += "--------------------------------------------------------------- \n";

    var RTPs = Math.floor((obj["totalWinBonus"] / (times * 88)) * 10000) / 10000;

    reelConsts.reelAllNumObj[RTPs] = reelConsts.reelAllArray;
    tools.writeFile(urlConstants.ReelAllNumJsonUrl, JSON.stringify(reelConsts.reelAllNumObj));
    console.log(Object.keys(reelConsts.reelAllNumObj));

    reelConsts.reelHighRangeNumObj[RTPs] = reelConsts.reelHighRangeArray;
    tools.writeFile(urlConstants.ReelHighRangeNumJsonUrl, JSON.stringify(reelConsts.reelHighRangeNumObj));
    console.log(Object.keys(reelConsts.reelHighRangeNumObj));

    tools.appendNewFile(__dirname + '/TestFile/Test_測試數' + times + '_' + new Date().getTime() + '.txt', str);
    console.log(RTPs);
}

main(10000);
