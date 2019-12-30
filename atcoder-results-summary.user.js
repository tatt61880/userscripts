// ==UserScript==
// @name        atcoder-results-summary
// @namespace   https://github.com/tatt61880
// @version     1.0.0
// @description AtCoderの提出結果のAC/WA/TLE/REの数をまとめます。
// @author      tatt61880
// @match       https://atcoder.jp/*/submissions/*
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/atcoder-results-summary.user.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/atcoder-results-summary.user.js
// ==/UserScript==

(function($) {
    'use strict';

    const KEY_PREFIX = 'atcoder-results-summary-';

    if (location.href.match(/^https:\/\/atcoder\.jp\/contests\/.*\/submissions\/\d+$/)) {
        let result_nums = {};
        $('table').eq(2).children('tbody').children().each(function(index, element) {
            let result = $(element).children().eq(1).text();
            if (result_nums[result] === undefined) {
                result_nums[result] = 1;
            } else {
                result_nums[result]++;
            }
        });
        let results=[];
        for(var result in result_nums) results.push(result);
        results.sort();

        let summary = '';
        results.forEach(function(result){
            if(summary != '') summary += ' &nbsp; ';
            let label = result == 'AC' ? 'label-success' : 'label-warning';
            summary += '<span class=\'label ' + label + '\' aria-hidden=\'true\' data-toggle=\'tooltip\' data-placement=\'top\'>' + result + '</span>';
            summary += ' ' + result_nums[result];
        });
        $('.col-sm-12').eq(1).before('<div><p>' + summary + '</p></div>');
        scrollTo(0, 0); // atcoder-problem-navigatorと同時に使用した際、ページを開き直すとスクロール位置がずれるので対策。

        const key = KEY_PREFIX + location.href.match(/^https:\/\/atcoder\.jp\/contests\/.*\/submissions\/(\d+)$/)[1];
        localStorage[key] = JSON.stringify(summary);
    } else {
        $('table').eq(0).children('tbody').children().each(function(index, element) {
            let a = $(element).children().eq(9).children().eq(0);
            let time = $(element).children().eq(0).children().eq(0);
            let href = a.attr('href');
            const key = KEY_PREFIX + href.match(/(\d+)$/)[1];
            let storageData = localStorage[key];
            if (storageData !== undefined) {
                let summary = JSON.parse(storageData);
                time.after('<br>' + summary);
            }
        });
    }
})(jQuery);
