// ==UserScript==
// @name        atcoder-standings
// @namespace   https://github.com/tatt61880
// @version     1.1.2
// @description AtCoderの順位表のAC時刻に棒グラフ表示を追加します。
// @author      tatt61880
// @match       https://atcoder.jp/*/standings
// @grant       none
// @updateURL   https://raw.githubusercontent.com/tatt61880/userscripts/master/atcoder-standings.user.js
// @downloadURL https://raw.githubusercontent.com/tatt61880/userscripts/master/atcoder-standings.user.js
// ==/UserScript==

(function() {
    'use strict';
    function drawACTimeBarGraph(){
        'use strict';
        let contestTimeSec = (endTime - startTime) / 1000;
        // console.log('contestTimeSec: ' + contestTimeSec);
        [].forEach.call(document.getElementsByClassName("standings-result"),function(x){
            var elem = x.children[1];
            if(elem === undefined) return;
            var timeStr = elem.textContent;
            var timeSec = Number(timeStr.substr(0, timeStr.length - 3)) * 60 + Number(timeStr.substr(-2));
            var parcent = Math.round(100 * timeSec / contestTimeSec);
            var style = 'background: linear-gradient(to right, rgb(250, 250, 150) ' + parcent + '%, transparent ' + parcent + '%);';
            elem.setAttribute('style', style);
        });
    }

    addEventListener('load', drawACTimeBarGraph);

    var timeoutId;
    addEventListener('mouseup', function(){
        clearTimeout(timeoutId);
        timeoutId = setTimeout(drawACTimeBarGraph, 500);
    });
})();
