// ==UserScript==
// @name        atcoder-standings-to-submissions
// @namespace   https://github.com/tatt61880
// @version     1.1.0
// @description AtCoderの終了後のコンテストの順位表のAC時刻の箇所をダブルクリックすることで、提出コードのページを表示するようにします。
// @author      tatt61880
// @match       https://atcoder.jp/contests/*/standings*
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/atcoder-standings-to-submissions.user.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/atcoder-standings-to-submissions.user.js
// ==/UserScript==

(function($) {
  'use strict';

  $(document).dblclick(function (event) {
    const $td = $(event.target).parent();
    if ($td.attr('class') != 'standings-result') return;
    const $tr = $td.parent();
    const index = $tr.children().index($td);
    const userid = $tr.children().eq(1).children('a').attr('href').replace(/.*\//, '');
    if (index < 3) return;
    const $thead = $('thead');
    let problems = [];
    let problemsId = 0;
    $thead.children().each(function(index, element) {
      if ($(element).children().eq(0).text() != '順位') return true;
      $(element).children().each(function(index, element) {
        const $href = $(element).children('a').attr('href');
        if ($href === undefined) return true;
        problems[problemsId++] = $href;
      });
    });

    const problem = problems[index - 3];
    const contestId = problem.replace(/\/contests\/(.*)\/tasks\/.*/, '$1');
    const problemId = problem.replace(/.*\//, '');

    const url = 'https://atcoder.jp/contests/' + contestId + '/submissions?f.Language=&f.Status=AC&f.Task=' + problemId + '&f.User=' + userid + '&orderBy=created';

    $.ajax({type: 'GET', url: url, dataType: 'html'}).then(
      function (data) {
        const prev = data;
        data = data.replace(/[\d\D]*?href="(.*?)">詳細<[\d\D]*/, '$1');
        if (data == prev) {
          window.alert('[atcoder-standings-to-submissions.user.js]\nデータがありません。');
          return;
        }
        const href = 'https://atcoder.jp' + data;
        window.open(href, '_blank') ;
      },

      function () {
        window.alert('[atcoder-standings-to-submissions.user.js]\n' + url + ' の読み込みに失敗しました。');
      });
  });
})(jQuery);
