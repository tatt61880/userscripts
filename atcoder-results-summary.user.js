// ==UserScript==
// @name        atcoder-results-summary
// @namespace   https://github.com/tatt61880
// @version     1.3.1
// @description AtCoderの提出結果(AC/RE/TLE/WAなど)の数をまとめます。
// @author      tatt61880
// @match       https://atcoder.jp/*/submissions*
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/atcoder-results-summary.user.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/atcoder-results-summary.user.js
// ==/UserScript==

/*
デバッグ用の参考
・1回の提出で AC/RE/TLE/WA が全て出ている提出。
https://atcoder.jp/contests/ddcc2016-qual/submissions/968862
*/

(function($) {
  'use strict';

  const KEY_PREFIX = 'atcoder-results-summary.user.js-';

  function createSummaryHtml(resultNums) {
    const results = [];
    for (const result in resultNums) {
      if ({}.hasOwnProperty.call(resultNums, result)) {
        results.push(result);
      }
    }
    results.sort();

    let summary = '';
    results.forEach(function(result) {
      if (summary != '') summary += ' &nbsp; ';
      const label = result == 'AC' ? 'label-success' : 'label-warning';
      summary +=
                '<span class=\'label ' + label + '\'>' + result + '</span>';
      summary += ' ' + resultNums[result];
    });
    return summary;
  }

  if (location.href.match(/\/submissions\/\d+$/)) {
    const resultNums = {};
    $('table').eq(2).children('tbody').children().each(function(index, elem) {
      const result = $(elem).children().eq(1).text();
      if (resultNums[result] === undefined) {
        resultNums[result] = 1;
      } else {
        resultNums[result]++;
      }
    });

    const elem = $('.col-sm-12').eq(1);
    const p = elem.children('p');
    p.eq(1).before('<p>' + createSummaryHtml(resultNums) + '</p>');
    p.eq(0).css('display', 'none');
    elem.children('hr').eq(0).css('display', 'none');

    // atcoder-problem-navigator.user.js と同時に使用した際、
    // ページを開き直すとスクロール位置がずれるので対策。
    window.scrollTo(0, 0);

    const key = KEY_PREFIX + location.href.match(/\/submissions\/(\d+)$/)[1];
    localStorage[key] = JSON.stringify(resultNums);
  } else {
    $('table').eq(0).children('tbody').children('tr').each(
      function(index, elem) {
        const href = $(elem).children().eq(-1).children().eq(0).attr('href');
        if (href !== undefined) {
          const key = KEY_PREFIX + href.match(/(\d+)$/)[1];
          const storageData = localStorage[key];
          if (storageData !== undefined) {
            const resultNums = JSON.parse(storageData);
            const time = $(elem).children().eq(0).children().eq(0);
            time.after('<br>' + createSummaryHtml(resultNums));
          }
        }
      });
  }
})(jQuery);
