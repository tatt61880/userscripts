// ==UserScript==
// @name        atcoder-language-check
// @namespace   https://github.com/tatt61880
// @version     1.0.0
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
            $('#select-lang > div').each(function(index, elem){
                if ($(elem).css('display') == 'block') {
                    return $(elem).find('span.selection');
                }
            })
        } else {
            return $('#select-lang span.selection');
        }
    }

    function checkLanguage() {
        const lang = getElement().text();
        const isOk = (lang.indexOf(myLang) !== -1);
        $('#select-lang').css('background', isOk ? '#FFFFFF' : '#FF0000');
    }

    addEventListener('load', checkLanguage);

    let timeoutId;
    addEventListener('mouseup', function(){
        // イベントが連続して発火したときに、最後の1回の後だけ処理するようにします。
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkLanguage, 500);
    }, {
        passive : true
    });
    addEventListener('keydown', function(){
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkLanguage, 500);
    }, {
        passive : true
    });
})(jQuery);
