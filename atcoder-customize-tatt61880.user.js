// ==UserScript==
// @name        atcoder-customize-tatt61880
// @namespace   https://github.com/tatt61880
// @version     1.1.1
// @description AtCoderのサイトをtatt61880の好みに合わせて細かく調整します。
// @author      tatt61880
// @match       https://atcoder.jp/*
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/atcoder-customize.user.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/atcoder-customize.user.js
// ==/UserScript==

(function($) {
    'use strict';

    const kFoldingFooter = true; // footerの折りたたみ。
    const kRemoveBr = true; // ソースコード提出用テキストエリア下部の《※ 512 KiB まで》《※ ソースコードは「Main.拡張子」で保存されます》の間の改行を削除。

    if (kFoldingFooter) {
        const footerId = 'footer-tatt61880';
        const footer = $('footer').parent();
        footer.after('<div style="text-align: center;">'
                     + '<a id="atcoder-customize-tatt61880-footer-btn" class="btn-text" data-on-text="フッターを表示" data-off-text="フッターを非表示">フッターを表示</a> by tatt61880'
                     + '</div>'
                     + '<div id="' + footerId + '">' + footer.html() + '</div>');
        $('#' + footerId).hide();
        footer.remove();

        $('#atcoder-customize-tatt61880-footer-btn').click(function(){
            const state = ($(this).text() == $(this).data('on-text'));
            $(this).text($(this).data(state ? 'off-text' : 'on-text'));
            if (state) {
                $('#' + footerId).show();
                // 最下部にスクロールする。
                const documentElement = document.documentElement;
                const bottom = documentElement.scrollHeight - documentElement.clientHeight;
                window.scroll(0, bottom);
            } else {
                $('#' + footerId).hide();
            }
        });
    }

    if (kRemoveBr) {
        const br = $('#sourceCode').children('p').children('br');
        br.each(function(index, element) {
            const prevText = $(element).prev().text();
            const nextText = $(element).next().text();
            if (prevText == '※ 512 KiB まで' && nextText == '※ ソースコードは「Main.拡張子」で保存されます') {
                $(element).next().text('/ ' + nextText);
                $(element).hide();
            }
        });
    }

    // 1 ページあたり表示数のデフォルトを100に。
    if (true) {
        if (location.href.match(/^https:\/\/atcoder\.jp\/contests\/.*\/standings/)) {
            $(".standings-per-page").eq(3)[0].click();
        }
    }

    // TODO: 正解者数 / 提出者数 を上部にも表示

})(jQuery);
