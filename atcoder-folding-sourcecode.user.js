// ==UserScript==
// @name        atcoder-folding-sourcecode
// @namespace   https://github.com/tatt61880
// @version     1.2.5
// @description AtCoderで提出したソースコードのテンプレート部分を折りたたみます。
// @author      tatt61880
// @include     /^https:\/\/atcoder\.jp\/contests\/.*\/submissions\/\d+/
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/atcoder-folding-sourcecode.user.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/atcoder-folding-sourcecode.user.js
// ==/UserScript==

(function($) {
  'use strict';

  // 以下の2行を適宜変更して使用してください。
  const kRegexTemplateBegin = new RegExp('^//{{{$');
  const kRegexTemplateEnd = new RegExp('^//}}}$');

  /* 上記以外の例
    const kRegexTemplateBegin = new RegExp('^#if 0$');
    const kRegexTemplateEnd = new RegExp('^#endif$');
    */

  if (!location.href.match(/\/submissions\/\d+$/)) return;

  const count = 0;
  const exec = function() {
    const id = setTimeout(exec, 100);
    if (count > 50) clearTimeout(id);
    if ($('.prettyprinted').length) {
      clearTimeout(id);
      let templateLines = 0;
      let lines = 0;
      const height = $('#submission-code > ol > li').css('height');
      const showCss = {height: height, visibility: 'visible'};
      const hideCss = {height: 0, visibility: 'hidden'};
      $('#submission-code > ol > li').each(function(index, element) {
        lines++;
        const text = $(element).text();
        if (
          !templateLines &&
            text.match(kRegexTemplateBegin) &&
            !text.match(kRegexTemplateEnd)
        ) {
          templateLines = 1;
        }
        if (templateLines) {
          if (templateLines == 1) {
            const span =
              '<span> <a class="btn-text atcoder-folding-sourcecode-btn"' +
              ' data-on-text="表示" data-off-text="非表示"' +
              ' data-from="' +
              lines +
              '">表示</a></span>';
            $(element).children().eq(-1).after(span);
          } else {
            $(element).css(hideCss);
          }
          templateLines++;
        }
        if (text.match(kRegexTemplateEnd)) templateLines = 0;
      });

      $('.atcoder-folding-sourcecode-btn').click(function(e) {
        let $this = $(this);
        const state = $this.text() == $this.data('on-text');
        $this.text($this.data(state ? 'off-text' : 'on-text'));
        $('#submission-code > ol > li').eq($this.data('from') - 1)
            .nextAll('li').each(function(index, element) {
              $(element).css(state ? showCss : hideCss);
              const text = $(element).text();
              if (text.match(kRegexTemplateEnd)) return false;
            });
      });
    }
  };
  exec();
})(jQuery);
