// ==UserScript==
// @name        atcoder-customize-tatt61880
// @namespace   https://github.com/tatt61880
// @version     1.5.6
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
  const kResultsSummaryAdditionalInfo = true;

  try { foldingFooter(); } catch (ex) { }
  try { removeBr(); } catch (ex) { }
  try { standingsDefault100(); } catch (ex) { }
  try { inOutColorize(); } catch (ex) { }
  try { showStandingsStatisticsInThead(); } catch (ex) { }
  try { drawACTimeBarGraph(); } catch (ex) { }
  try { languageCheck(); } catch (ex) { }
  try { foldingSourcecode(); } catch (ex) { }
  try { resultsSummaryAdditionalInfo(); } catch (ex) { }

  function foldingFooter() { //{{{
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
  //}}}

  function removeBr() { //{{{
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
  //}}}

  function standingsDefault100() { //{{{
    if (!kStandingsDefault100) return;
    if (!location.href.match(/\/contests\/.*\/standings\b/)) return;

    $('.standings-per-page').each(function(index, element) {
      if ($(element).text() == '100') {
        element.click();
      }
    });
  }
  //}}}

  function inOutColorize() { //{{{
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
  //}}}

  function showStandingsStatisticsInThead() { //{{{
    if (!kShowStandingsStatisticsInThead) return;
    if (!location.href.match(/\/contests\/.*\/standings\b/)) return;

    const count = 0;
    showStandingsStatisticsInTheadSub();
    function showStandingsStatisticsInTheadSub() {
      const id = setTimeout(showStandingsStatisticsInTheadSub, 200);
      if (count > 300) clearTimeout(id);

      const elem1 = $('.standings-statistics');
      if (elem1.prop('outerHTML') === undefined) return;

      clearTimeout(id);

      $('table > thead').prepend(elem1.prop('outerHTML'));
      const elem2 = $('.standings-fa');
      $('table > thead').prepend(elem2.prop('outerHTML'));
    }
  }
  //}}}

  function drawACTimeBarGraph() { //{{{
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
  //}}}

  function languageCheck() { //{{{
    if (!kLanguageCheck) return;
    if (!location.href.match(/\/contests\//)) return;

    const myLang = 'C++ (GCC 9.2.1)';

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
  //}}}

  function foldingSourcecode() { //{{{
    if (!kFoldingSourcecode) return;
    if (!location.href.match(/\/submissions\/\d+$/)) return;

    let users = [];

    // 各ユーザーのテンプレートを定義して使用します。
    users.tatt61880 = [new RegExp('^//{{{'), new RegExp('^//}}}')];
    users.kmjp = [new RegExp(String.raw`^#include <bits/stdc\+\+\.h>`), new RegExp('^//-------------------------------------------------------$')];
    users.satanic0258 = [new RegExp(String.raw`^// need$`), new RegExp(String.raw`^// ------------>8------------------------------------->8------------$`)];

    const username = $('table').eq(0).children('tbody').children().eq(2).children().eq(1).text().replace(/\s/g, '');
    if (users[username] === undefined) return;
    const kRegexTemplateBegin = users[username][0];
    const kRegexTemplateEnd = users[username][1];

    const count = 0;
    foldingSourcecodeSub();
    function foldingSourcecodeSub() {
      const id = setTimeout(foldingSourcecodeSub, 200);
      if (count > 300) clearTimeout(id);
      if ($('.prettyprinted').length == 0) return;

      clearTimeout(id);

      let templateLines = 0;
      let lines = 0;
      const li = $('#submission-code > ol > li');
      const height = li.css('height');
      const showCss = {height: height, visibility: 'visible'};
      const hideCss = {height: 0, visibility: 'hidden'};
      let level = 0;
      const kOnText = '表示';
      function onText(text){
        return kOnText + ' ' + '-'.repeat(150 - text.length);
      }
      const kOffText = '非表示';
      li.each(function(index, element) {
        lines++;
        const text = $(element).text();
        if (
          text.match(kRegexTemplateBegin) &&
          !text.match(kRegexTemplateEnd)
        ) {
          level++;
          templateLines = 1;
        }

        if (templateLines) {
          if (templateLines == 1) {
            const span =
                  '<span> <a class="btn-text atcoder-folding-sourcecode-btn"' +
                  ' data-from="' + lines + '">' + onText(text) + '</a></span>';
            $(element).children().eq(-1).after(span);
            $(element).data('start', 1);
          }
          $(element).data('level', level);
          templateLines++;
        }
        if (text.match(kRegexTemplateEnd)) {
          level--;
          if (level == 0){
            templateLines = 0;
          }
        }
      });

      update(li);

      function update(li) {
        li.each(function(index, element) {
          let level = $(element).data('level');
          if (level === undefined) return true;
          if ($(element).data('start') !== undefined) level--;

          if (level) {
            $(element).css(hideCss);
          } else {
            $(element).css(showCss);
          }
        });
      }

      $('.atcoder-folding-sourcecode-btn').click(function() {
        const $this = $(this);
        const text = $this.parent().prev().text();
        const state = $this.text() != kOffText;
        $this.text(state ? kOffText : onText(text));
        const li = $('#submission-code > ol > li');
        const add = state ? -1 : 1;
        let level = 1;
        li.eq($this.data('from') - 1)
          .nextAll('li').each(function(index, element) {
            const currentLevel = $(element).data('level');
            if (level === undefined) return false;

            const text = $(element).text();
            if (
              text.match(kRegexTemplateBegin) &&
            !text.match(kRegexTemplateEnd)
            ) {
              level++;
            }

            $(element).data('level', currentLevel + add);
            if (text.match(kRegexTemplateEnd)) {
              level--;
              if (level == 0){
                return false;
              }
            }
          });
        update(li);
      });
    }
  }
  //}}}

  function resultsSummaryAdditionalInfo() { //{{{
    if (!kResultsSummaryAdditionalInfo) return;
    if (!location.href.match(/\/submissions\/\d+$/)) return;
    const date = $('table').eq(0).children('tbody').children().eq(0).children().eq(1).text();
    const problem = $('table').eq(0).children('tbody').children().eq(1).children().eq(1).text();
    const username = $('table').eq(0).children('tbody').children().eq(2).children().eq(1).text().replace(/\s/g, '');
    const lang = $('table').eq(0).children('tbody').children().eq(3).children().eq(1).text();
    const time = $('table').eq(0).children('tbody').children().eq(7).children().eq(1).text();
    const mem = $('table').eq(0).children('tbody').children().eq(8).children().eq(1).text();
    const $div = $('.col-sm-12').eq(1).children('div').eq(0);
    const $pos = $div.prev().prev();
    $pos.after('<span>' + date + ' / ' + problem + ' / ' + username + ' / ' + lang + ' / ' + time + ' / ' + mem + '</span>');
  }
  //}}}

  // 未完成 (完成しなさそう)
  // 入出力の表示変更
  const kInOutPos = false;
  if (kInOutPos) inOutPos();
  function inOutPos() { //{{{
    if (!location.href.match(/\/contests\/.*\/tasks.*$/)) return;

    $('h3').each(function(index, element) {
      if ($(element).text().match(/^入力例.*$/)) {
        $(element).parents('.part').css(
          {'float': 'left', 'margin-right': '30px'}
        );
      }
    });
  }
  //}}}
})(window.jQuery);
