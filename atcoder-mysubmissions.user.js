// ==UserScript==
// @name        atcoder-mysubmissions
// @namespace   https://github.com/tatt61880
// @version     1.0.0
// @description atcoderの「提出一覧」の横に「自分の提出一覧」を追加します。
// @author      tatt61880
// @match       https://atcoder.jp/contests/*/tasks/*
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/atcoder-mysubmissions.user.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/atcoder-mysubmissions.user.js
// ==/UserScript==

(function($) {
  'use strict';

  if (!location.href.match(/^https:\/\/atcoder\.jp\/contests\/.*\/tasks\/.*$/)) return;

  let href = location.href;
  href = href.replace('/tasks/', '/submissions/me?f.Task=');
  $('#task-statement').prev().append(' / <a href="' + href + '">自分の提出一覧</a>');
})(window.jQuery);
