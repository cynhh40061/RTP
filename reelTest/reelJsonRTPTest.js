const tools = require('../util/tool');
const reelConsts = require('../constants/reelConstants');


/*
    從 reelAllNumObj 取出指定 RTP 對應的測試值，並從中以亂數選則一組回傳 
*/
getReelRandom = (Num) => {
    var obj = {};
    var keys = Object.keys(reelConsts.reelAllNumObj);
    var randomNum = parseInt(Math.random() * reelConsts.reelAllNumObj[keys[Num]].length);
    var reelNum = reelConsts.reelAllNumObj[keys[Num]][randomNum].split('|');

    for (let i = 0; i < reelNum.length; i++) {
        var subReel = reelConsts.reelObj['Reel' + (i + 1)];
        var subReelNum = parseInt(reelNum[i]);

        if (subReelNum == 0) {
            obj['Reel' + (i + 1)] = [subReel[subReel.length - 1], subReel[0], subReel[1]];
        } else if (reelNum[i] == subReel.length - 1) {
            obj['Reel' + (i + 1)] = [subReel[subReel.length - 2], subReel[subReel.length - 1], subReel[0]];
        } else {
            obj['Reel' + (i + 1)] = [subReel[subReelNum - 1], subReel[subReelNum], subReel[subReelNum + 1]];
        }
    }
    return obj;
}

/*
    執行指定測試次數，並回傳原 RTP 值與 測試後新 RTP 值
*/
main = (runTimes, Num) => {
    var totalWinBonus = 0;
    for (var i = 1; i <= runTimes; i++) {
        var reelSampling = getReelRandom(Num);
        var winObj = tools.checkReelRate(reelSampling);
        for (var j = 0; j < Object.keys(winObj).length; j++) {
            var key = Object.keys(winObj)[j];
            var totalLine = winObj[key]['winBaseLine'] * winObj[key]['winCount'];

            totalWinBonus = totalWinBonus + totalLine;
        }
    }
    var newRTP = totalWinBonus / (runTimes * reelConsts.PLAYER_BET);

    console.log('oldRTP=', Object.keys(reelConsts.reelAllNumObj)[Num]);
    console.log('newRTP=', newRTP);
    console.log('========================================');
}

for (var i = 0; i < Object.keys(reelConsts.reelAllNumObj).length; i++) {
    main(10000000, i);
}