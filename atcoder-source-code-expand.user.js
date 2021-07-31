// ==UserScript==
// @name        atcoder-source-code-expand
// @namespace   https://github.com/tatt61880
// @version     1.0.0
// @description AtCoderの提出結果詳細の表示時に「拡げる」を自動で押します。
// @author      tatt61880
// @match       https://atcoder.jp/*/submissions*
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/atcoder-source-code-expand.user.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/atcoder-source-code-expand.user.js
// ==/UserScript==

(function($) {
  'use strict';

  $('.source-code-expand-btn').click();
})(window.jQuery);
