// ==UserScript==
// @name        atcoder-results-summary
// @namespace   https://github.com/tatt61880
// @version     0.9.1
// @description AtCoderの提出結果のAC/WA/TLE/REの数をまとめます。
// @author      tatt61880
// @match       https://atcoder.jp/*/submissions/*
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/atcoder-results-summary.user.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/atcoder-results-summary.user.js
// ==/UserScript==

(function($) {
    'use strict';

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
        if(summary != '') summary += '&nbsp;&nbsp;&nbsp;';
        let label = result == 'AC' ? 'label-success' : 'label-warning';
        summary += '<span class=\'label ' + label + '\' aria-hidden=\'true\' data-toggle=\'tooltip\' data-placement=\'top\'>' + result + '</span>';
        summary += ' ' + result_nums[result];
    });
    $('.col-sm-12').eq(1).before('<div><p><span>' + summary + '</span></p></div>');
})(jQuery);
