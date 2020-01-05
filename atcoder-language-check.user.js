// ==UserScript==
// @name        atcoder-language-check
// @namespace   https://github.com/tatt61880
// @version     1.3.0
// @description AtCoderでの提出時の言語チェック用です。
// @author      tatt61880
// @match       https://atcoder.jp/contests/*
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/atcoder-language-check.user.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/atcoder-language-check.user.js
// ==/UserScript==

(function($) {
  'use strict';
  const myLang = 'C++14 (GCC 5.4.1)';

  function getElement() {
    if (location.href.match('/submit')) {
      let res;
      $('#select-lang > div').each(function(index, elem) {
        if ($(elem).css('display') == 'block') {
          res = $(elem).find('span.selection');
          return false;
        }
      });
      return res;
    } else {
      return $('#select-lang span.selection');
    }
  }

  function checkLanguage() {
    const lang = getElement().text();
    const isOk = lang.indexOf(myLang) !== -1;
    $('#select-lang').css('background', isOk ? '#FFFFFF' : '#FF0000');
  }

  $(document).ready(checkLanguage);
  let timeoutId;
  $(document).on('mouseup keydown', function() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(checkLanguage, 500);
  });
})(jQuery);
