// ==UserScript==
// @name        atcoder-customize-tatt61880
// @namespace   https://github.com/tatt61880
// @version     1.3.9
// @description AtCoderのサイトをtatt61880の好みに合わせて細かく調整します。
// @author      tatt61880
// @match       https://atcoder.jp/*
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/atcoder-customize-tatt61880.user.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/atcoder-customize-tatt61880.user.js
// ==/UserScript==

(function($) {
  'use strict';

  const kFoldingFooter = true; // footerの折りたたみ。
  const kRemoveBr = true; // ソースコード提出用テキストエリア下部の余分な改行(※)を削除
  // (※)《※ 512 KiB まで》《※ ソースコードは「Main.拡張子」で保存されます》の間の改行
  const kStandingsDefault100 = false; // 1 ページあたり表示数のデフォルトを100に。
  const kInOutColorize = true; // 入出力の文字に色を付ける。
  const kShowStandingsStatisticsInThead = true; // 正解者数 / 提出者数 を上部に表示
  const kDrawACTimeBarGraph = true; // 順位表に棒グラフ追加
  const kLanguageCheck = true; // 提出言語が普段と違うときに、目立つようにする。
  const kFoldingSourcecode = true; // ソースコードのテンプレート部分の折りたたみ。

  try { foldingFooter(); } catch (ex) { }
  try { removeBr(); } catch (ex) { }
  try { standingsDefault100(); } catch (ex) { }
  try { inOutColorize(); } catch (ex) { }
  try { showStandingsStatisticsInThead(); } catch (ex) { }
  try { drawACTimeBarGraph(); } catch (ex) { }
  try { languageCheck(); } catch (ex) { }
  try { foldingSourcecode(); } catch (ex) { }

  function foldingFooter() {
    if (!kFoldingFooter) return;
    const footerId = 'footer-tatt61880';
    const footer = $('.container > footer.footer').parent();
    footer.after(
      '<div style="text-align: center;">' +
        '<a id="atcoder-customize-tatt61880-footer-btn" class="btn-text"' +
        ' data-on-text="フッターを表示"' +
        ' data-off-text="フッターを非表示">フッターを表示</a>' +
        ' by tatt61880' +
        '</div>' +
        '<div id="' +
        footerId +
        '">' +
        footer.prop('outerHTML') +
        '</div>'
    );
    $('#' + footerId).hide();
    footer.remove();

    $('#atcoder-customize-tatt61880-footer-btn').click(function() {
      const $this = $(this);
      const state = $this.text() == $this.data('on-text');
      $this.text($this.data(state ? 'off-text' : 'on-text'));
      if (state) {
        $('#' + footerId).show();
        // 最下部にスクロールします。
        const elem = document.documentElement;
        const bottom = elem.scrollHeight - elem.clientHeight;
        window.scroll(0, bottom);
      } else {
        $('#' + footerId).hide();
      }
    });
  }

  function removeBr() {
    if (!kRemoveBr) return;
    const br = $('#sourceCode').children('p').children('br');
    br.each(function(index, element) {
      const prevText = $(element).prev().text();
      const nextText = $(element).next().text();
      if (prevText == '※ 512 KiB まで' &&
        nextText == '※ ソースコードは「Main.拡張子」で保存されます'
      ) {
        $(element).next().text('/ ' + nextText);
        $(element).hide();
      }
    });
  }

  function standingsDefault100() {
    if (!kStandingsDefault100) return;
    if (!location.href.match(/\/contests\/.*\/standings\b/)) return;

    $('.standings-per-page').each(function(index, element) {
      if ($(element).text() == '100') {
        element.click();
      }
    });
  }

  function inOutColorize() {
    if (!kInOutColorize) return;
    if (!location.href.match(/\/contests\/.*\/tasks.*$/)) return;

    $('h3').each(function(index, element) {
      if ($(element).text().match(/^入力.*$/)) {
        $(element).css('color', '#000080');
      } else if ($(element).text().match(/^出力.*$/)) {
        $(element).css('color', '#008000');
      }
    });
  }

  function showStandingsStatisticsInThead() {
    if (!kShowStandingsStatisticsInThead) return;
    if (!location.href.match(/\/contests\/.*\/standings\b/)) return;

    const elem1 = $('#standings-tbody > .standings-statistics');
    $('table > thead').prepend(elem1.prop('outerHTML'));
    const elem2 = $('#standings-tbody > .standings-fa');
    $('table > thead').prepend(elem2.prop('outerHTML'));
  }

  function drawACTimeBarGraph() {
    if (!kDrawACTimeBarGraph) return;
    if (!location.href.match(/\/contests\/.*\/standings\b/)) return;

    function drawACTimeBarGraphSub() {
      const start = eval('startTime');
      const end = eval('endTime');
      const contestTimeSec = (end - start) / 1000;
      // console.log('contestTimeSec: ' + contestTimeSec);
      $('.standings-result').each(function(index, element) {
        const elem = element.children[1];
        if (elem === undefined) return;
        const timeStr = elem.textContent;
        const timeSec =
              Number(timeStr.substr(0, timeStr.length - 3)) * 60 +
              Number(timeStr.substr(-2));
        const parcent = Math.round(100 * timeSec / contestTimeSec);
        const style =
              'background: linear-gradient(to right, rgb(250, 250, 150) ' +
              parcent + '%, transparent ' + parcent + '%);';
        elem.setAttribute('style', style);
      });
    }

    $(document).ready(drawACTimeBarGraphSub);

    let timeoutId;
    $(document).on('mouseup', function() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(drawACTimeBarGraphSub, 500);
    });
  }

  function languageCheck() {
    if (!kLanguageCheck) return;
    if (!location.href.match(/\/contests\//)) return;

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
  }

  function foldingSourcecode() {
    if (!kFoldingSourcecode) return;
    // 以下の2行を適宜変更して使用してください。
    const kRegexTemplateBegin = new RegExp('^//{{{$');
    const kRegexTemplateEnd = new RegExp('^//}}}$');

    /* 上記以外の例
    const kRegexTemplateBegin = new RegExp('^// template begin$');
    const kRegexTemplateEnd = new RegExp('^// template end$');
    */

    if (!location.href.match(/\/submissions\/\d+$/)) return;

    const count = 0;
    foldingSourcecodeSub();
    function foldingSourcecodeSub() {
      const id = setTimeout(foldingSourcecodeSub, 100);
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

        $('.atcoder-folding-sourcecode-btn').click(function() {
          const $this = $(this);
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
    }
  }

  // 未完成 (完成しなさそう)
  // 入出力の表示変更
  const kInOutPos = false;
  if (kInOutPos) inOutPos();
  function inOutPos() {
    if (!location.href.match(/\/contests\/.*\/tasks.*$/)) return;

    $('h3').each(function(index, element) {
      if ($(element).text().match(/^入力例.*$/)) {
        $(element).parents('.part').css(
          {'float': 'left', 'margin-right': '30px'}
        );
      }
    });
  }
})(jQuery);
