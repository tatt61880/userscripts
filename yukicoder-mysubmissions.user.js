// ==UserScript==
// @name        yukicoder-mysubmissions
// @namespace   https://github.com/tatt61880
// @version     1.0.1
// @description yukicoderの「提出一覧」の横に「自分の提出一覧」を追加します。
// @author      tatt61880
// @match       https://yukicoder.me/problems/*
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/yukicoder-mysubmissions.users.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/yukicoder-mysubmissions.users.js
// ==/UserScript==

(function($) {
  'use strict';

  if (!location.href.match(/^https:\/\/yukicoder\.me\/problems\/.*$/)) return;
  $('a').each(function(index, element) {
    const text = $(element).text();
    if (text == '提出一覧') {
      const url = $(element).attr('href');
      if (url.match(/^\/problems\/no\/(\d+)\/submissions$/)){
        const id = url.replace(/^\/problems\/no\/(\d+)\/submissions$/, '$1');
        $(element).after('<a href="https://yukicoder.me/problems/no/' + id + '/submissions?my_submission=enabled">自分の提出一覧</a>');
      }
    }
  });
})(jQuery);
