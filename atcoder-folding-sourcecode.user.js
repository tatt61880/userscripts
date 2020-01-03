// ==UserScript==
// @name        atcoder-folding-sourcecode
// @namespace   https://github.com/tatt61880
// @version     1.0.4
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
/* for debug
    const kRegexTemplateBegin = new RegExp('^#if 0$');
    const kRegexTemplateEnd = new RegExp('^#endif$');
*/

    if (location.href.match(/^https:\/\/atcoder\.jp\/contests\/.*\/submissions\/\d+$/)) {
        let count = 0;
        const exec = function() {
            const id = setTimeout(exec, 100);
            if (count > 50) {
                clearTimeout(id);
            }
            if ($('.prettyprinted').length) {
                clearTimeout(id);
                let templateLines = 0;
                let lines = 0;
                const height = $('#submission-code > ol > li').css('height');
                const showCss = {'height': height, 'visibility': 'visible'};
                const hideCss = {'height': 0, 'visibility': 'hidden'};
                $('#submission-code > ol > li').each(function(index, element) {
                    lines++;
                    const text = $(element).text();
                    if (text.match(kRegexTemplateBegin) && !text.match(kRegexTemplateEnd)) templateLines = 1;
                    if (templateLines) {
                        if (templateLines == 1) {
                            $(element).children().eq(-1).after('<span> <a class="btn-text atcoder-folding-sourcecode-btn" data-on-text="拡げる" data-off-text="折りたたむ" data-from="' + lines + '">拡げる</a></span>');
                        } else {
                            $(element).css(hideCss);
                        }
                        templateLines++;
                    }
                    if (text.match(kRegexTemplateEnd)) templateLines = 0;
                });

                $('.atcoder-folding-sourcecode-btn').click(function(){
                    const state = ($(this).text() == $(this).data('on-text'));
                    $(this).text($(this).data(state ? 'off-text' : 'on-text'));
                    $('#submission-code > ol > li').eq($(this).data('from') - 1).nextAll('li').each(function(index, element) {
                        $(element).css(state ? showCss : hideCss);
                        const text = $(element).text();
                        if (text.match(kRegexTemplateEnd)) return false;
                    });
                });
            }
        }
        exec();
    }
})(jQuery);
