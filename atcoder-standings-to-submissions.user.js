// ==UserScript==
// @name        atcoder-standings-to-submissions
// @namespace   https://github.com/tatt61880
// @version     1.4.4
// @description AtCoderの終了後のコンテストの順位表のAC時刻の箇所をダブルクリックすることで、提出コードのページを表示するようにします。
// @author      tatt61880
// @match       https://atcoder.jp/contests/*/standings*
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/atcoder-standings-to-submissions.user.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/atcoder-standings-to-submissions.user.js
// ==/UserScript==

(function($) {
  'use strict';

  function isStandingResult($td) {
    return $td.attr('class') == 'standings-result';
  }
  function isStandingFa($td) {
    return $td.parent().attr('class') == 'standings-fa';
  }
  function isVirtual() {
    return location.href.match(/\/standings\/virtual\b/);
  }

  function getProblemUrl(event) {
    const $td = $(event.target).parent();
    if (!isStandingResult($td) && !isStandingFa($td)) return null;
    const $tr = $td.parent();

    let problems = [];
    let problemsId = 0;
    const idx = $tr.children().index($td) - (isStandingFa($td) ? 1 : (isVirtual() ? 4 : 3));
    if (idx < 0) return null;
    $('thead').children().each(function(index, element) {
      const text1 = $(element).children().eq(0).text();
      if (text1 != '順位' && text1 != 'Rank') return true;
      $(element).children().each(function(index, element) {
        const $href = $(element).children('a').attr('href');
        if ($href === undefined) return true;
        problems[problemsId++] = $href;
      });
    });
    return problems[idx];
  }

  function getUserId(event) {
    const $td = $(event.target).parent();
    const $tr = $td.parent();
    if (isStandingResult($td)) {
      const userId = $tr.children().eq(1).children('a').attr('href').replace(/.*\//, '');
      return userId;
    } else if (isStandingFa($td)) {
      const userId = $td.children().eq(0).children().eq(0).text().trim();
      return userId;
    }
    return null;
  }

  function getContestId(problemUrl) {
    return problemUrl.replace(/\/contests\/(.*)\/tasks\/.*/, '$1');
  }

  function getProblemId(problemUrl) {
    return problemUrl.replace(/.*\//, '');
  }

  $(document).click(function (event) {
    const $td = $(event.target).parent();
    if ($td.attr('class') != 'standings-result') return;
    let key_event = event;
    if (!key_event.altKey) return;

    const problemUrl = getProblemUrl(event);
    if (problemUrl == null) return;
    const userId = getUserId(event);
    const contestId = getContestId(problemUrl);
    const problemId = getProblemId(problemUrl);

    const url = 'https://atcoder.jp/contests/' + contestId + '/submissions?desc=true&f.Language=&f.Task=' + problemId + '&f.User=' + userId + '&orderBy=created';
    window.open(url, '_blank') ;
  });

  $(document).dblclick(function (event) {
    const problemUrl = getProblemUrl(event);
    if (problemUrl == null) return;
    const userId = getUserId(event);
    const contestId = getContestId(problemUrl);
    const problemId = getProblemId(problemUrl);

    const url = 'https://atcoder.jp/contests/' + contestId + '/submissions?f.Language=&f.Status=AC&f.Task=' + problemId + '&f.User=' + userId + '&orderBy=created';

    $.ajax({type: 'GET', url: url, dataType: 'html'}).then(
      function (data) {
        const prev = data;
        data = data.replace(/[\d\D]*?href="(.*?)">(詳細|Detail)<[\d\D]*/, '$1');
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
