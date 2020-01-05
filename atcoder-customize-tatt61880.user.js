// ==UserScript==
// @name        atcoder-customize-tatt61880
// @namespace   https://github.com/tatt61880
// @version     1.3.0
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

  if (kFoldingFooter) foldingFooter();
  if (kRemoveBr) removeBr();
  if (kStandingsDefault100) standingsDefault100();
  if (kInOutColorize) inOutColorize();
  if (kShowStandingsStatisticsInThead) showStandingsStatisticsInThead();
  if (kDrawACTimeBarGraph) drawACTimeBarGraph();

  function foldingFooter() {
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
    if (!location.href.match(/\/contests\/.*\/standings\b/)) return;

    $('.standings-per-page').each(function(index, element) {
      if ($(element).text() == '100') {
        element.click();
      }
    });
  }

  function inOutColorize() {
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
    if (!location.href.match(/\/contests\/.*\/standings\b/)) return;

    const elem = $('#standings-tbody > .standings-statistics');
    $('table > thead').prepend('<tr>' + elem.html() + '</tr>');
  }

  function drawACTimeBarGraph() {
    if (!location.href.match(/\/contests\/.*\/standings\b/)) return;
    function drawACTimeBarGraphSub() {
      const start = eval('startTime');
      const end = eval('endTime');
      const contestTimeSec = (end - start) / 1000;
      // console.log('contestTimeSec: ' + contestTimeSec);
      [].forEach.call(
        document.getElementsByClassName('standings-result'),
        function(x) {
          const elem = x.children[1];
          if (elem === undefined) return;
          const timeStr = elem.textContent;
          const timeSec =
            Number(timeStr.substr(0, timeStr.length - 3)) * 60 +
            Number(timeStr.substr(-2));
          const parcent = Math.round(100 * timeSec / contestTimeSec);
          const style =
            'background: ' +
            'linear-gradient(to right, rgb(250, 250, 150) ' +
            parcent +
            '%, transparent ' +
            parcent +
            '%);';
          elem.setAttribute('style', style);
        }
      );
    }

    $(document).ready(drawACTimeBarGraphSub);

    let timeoutId;
    $(document).on('mouseup', function() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(drawACTimeBarGraphSub, 500);
    });
  }

  // 未完成 (完成しなさそう)
  // 入出力の表示変更
  const kInOutPos = false;
  if (kInOutPos) inOutPos();
  function inOutPos() {
    if (!location.href.match(/^contests\/.*\/tasks.*$/)) return;

    $('h3').each(function(index, element) {
      if ($(element).text().match(/^入力例.*$/)) {
        $(element).parents('.part').css(
          {'float': 'left', 'margin-right': '30px'}
        );
      }
    });
  }
})(jQuery);
