// ==UserScript==
// @name        atcoder-folding-sourcecode
// @namespace   https://github.com/tatt61880
// @version     0.9.0
// @description AtCoderで提出したソースコードのテンプレート部分を折りたたみます。
// @author      tatt61880
// @match       https://atcoder.jp/*/submissions/*
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/atcoder-folding-sourcecode.user.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/atcoder-folding-sourcecode.user.js
// ==/UserScript==

(function($) {
    'use strict';

    const regexTemplateBegin = new RegExp('^//{{{$');
    const regexTemplateEnd = new RegExp('^//}}}$');
    if (location.href.match(/^https:\/\/atcoder\.jp\/contests\/.*\/submissions\/\d+$/)) {
        var count = 0;
        var countup = function() {
            console.log(count++);
            var id = setTimeout(countup, 200);
            if (count > 10) {
                clearTimeout(id);
            }
            if ($('.prettyprinted').length) {
                let displayFlag = true;
                $('#submission-code > ol').children('li').each(function(index, element) {
                    let text = $(element).children().text();
                    if (text.match(regexTemplateBegin)) displayFlag = false;
                    if (!displayFlag) {
                        $(element).css({'height': 0, 'visibility': 'hidden'});
                    }
                    if (text.match(regexTemplateEnd)) displayFlag = true;
                });
                clearTimeout(id);
            }
        }
        countup();
    }
})(jQuery);
