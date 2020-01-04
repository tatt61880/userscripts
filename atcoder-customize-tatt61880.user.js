// ==UserScript==
// @name        atcoder-customize-tatt61880
// @namespace   https://github.com/tatt61880
// @version     1.2.0
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
  const kRemoveBr = true; // ソースコード提出用テキストエリア下部の《※ 512 KiB まで》《※ ソースコードは「Main.拡張子」で保存されます》の間の改行を削除。
  const kStandingsDefault100 = false; // 1 ページあたり表示数のデフォルトを100に。
  const kInOutColorize = true; // 入出力の文字に色を付ける。
  // const kShowStandingsStatisticsInThead = true; // 正解者数 / 提出者数 を上部に表示
  const kShowStandingsStatisticsInThead = true; // ※ソートすると崩れることが判ったので封印。

  if (kFoldingFooter) foldingFooter();
  if (kRemoveBr) removeBr();
  if (kStandingsDefault100) standingsDefault100();
  if (kInOutColorize) inOutColorize();
  if (kShowStandingsStatisticsInThead) showStandingsStatisticsInThead();

  function foldingFooter() {
    const footerId = 'footer-tatt61880';
    const footer = $('.container > footer.footer').parent();
    footer.after(
      '<div style="text-align: center;">' +
        '<a id="atcoder-customize-tatt61880-footer-btn" class="btn-text" data-on-text="フッターを表示" data-off-text="フッターを非表示">フッターを表示</a> by tatt61880' +
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
      const state = $(this).text() == $(this).data('on-text');
      $(this).text($(this).data(state ? 'off-text' : 'on-text'));
      if (state) {
        $('#' + footerId).show();
        // 最下部にスクロールする。
        const documentElement = document.documentElement;
        const bottom =
          documentElement.scrollHeight - documentElement.clientHeight;
        window.scroll(0, bottom);
      } else {
        $('#' + footerId).hide();
      }
    });
  }

  function removeBr() {
    const br = $('#sourceCode')
      .children('p')
      .children('br');
    br.each(function(index, element) {
      const prevText = $(element)
        .prev()
        .text();
      const nextText = $(element)
        .next()
        .text();
      if (
        prevText == '※ 512 KiB まで' &&
        nextText == '※ ソースコードは「Main.拡張子」で保存されます'
      ) {
        $(element)
          .next()
          .text('/ ' + nextText);
        $(element).hide();
      }
    });
  }

  function standingsDefault100() {
    if (!location.href.match(/^https:\/\/atcoder\.jp\/contests\/.*\/standings/))
      return;

    $('.standings-per-page').each(function(index, element) {
      if ($(element).text() == '100') {
        element.click();
      }
    });
  }

  function inOutColorize() {
    if (!location.href.match(/^https:\/\/atcoder\.jp\/contests\/.*\/tasks.*$/))
      return;

    $('h3').each(function(index, element) {
      if (
        $(element)
          .text()
          .match(/^入力.*$/)
      ) {
        $(element).css('color', '#000080');
      } else if (
        $(element)
          .text()
          .match(/^出力.*$/)
      ) {
        $(element).css('color', '#008000');
      }
    });
  }

  function showStandingsStatisticsInThead() {
    if (!location.href.match(/^https:\/\/atcoder\.jp\/contests\/.*\/standings/))
      return;

    const elem = $('#standings-tbody > .standings-statistics');
    $('table > thead').prepend('<tr>' + elem.html() + '</tr>');
  }

  // 未完成 (完成しなさそう)
  // 入出力の表示変更
  if (false) {
    if (location.href.match(/^https:\/\/atcoder\.jp\/contests\/.*\/tasks.*$/)) {
      $('h3').each(function(index, element) {
        if (
          $(element)
            .text()
            .match(/^入力例.*$/)
        ) {
          $(element)
            .parents('.part')
            .css({ float: 'left', 'margin-right': '30px' });
        }
      });
    }
  }
})(jQuery);
