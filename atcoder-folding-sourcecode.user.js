// ==UserScript==
// @name        atcoder-folding-sourcecode
// @namespace   https://github.com/tatt61880
// @version     0.9.2
// @description AtCoderで提出したソースコードのテンプレート部分を折りたたみます。
// @author      tatt61880
// @match       https://atcoder.jp/*/submissions/*
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/atcoder-folding-sourcecode.user.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/atcoder-folding-sourcecode.user.js
// ==/UserScript==

(function($) {
    'use strict';

    // 以下の2行を適宜変更して使用してください。
    const kRegexTemplateBegin = new RegExp('^//{{{$');
    const kRegexTemplateEnd = new RegExp('^//}}}$');

    if (location.href.match(/^https:\/\/atcoder\.jp\/contests\/.*\/submissions\/\d+$/)) {
        let count = 0;
        let exec = function() {
            let id = setTimeout(exec, 100);
            if (count > 50) {
                clearTimeout(id);
            }
            if ($('.prettyprinted').length) {
                clearTimeout(id);
                let templateLines = 0;
                $('#submission-code > ol').children('li').each(function(index, element) {
                    let text = $(element).text();
                    if (text.match(kRegexTemplateBegin)) templateLines = 1;
                    console.log(templateLines);
                    if (templateLines) {
                        if (templateLines == 1) {
                            $(element).children().eq(0).after('<span> <a id="atcoder-folding-sourcecode-button" class="btn-text" data-on-text="拡げる" data-off-text="折りたたむ">拡げる</a> </span>');
                        } else {
                            $(element).css({'height': 0, 'visibility': 'hidden'});
                        }
                        templateLines++;
                    }
                    if (text.match(kRegexTemplateEnd)) templateLines = 0;
                });
                $('#atcoder-folding-sourcecode-button').click(function(){
                    let state = ($(this).text() == $(this).data('on-text'));
                    if (state) {
                        $(this).text($(this).data('off-text'));
                    } else {
                        $(this).text($(this).data('on-text'));
                    }
                    // TODO
                });
            }
        }
        exec();
    }
})(jQuery);
