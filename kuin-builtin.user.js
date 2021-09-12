// ==UserScript==
// @name        kuin-builtin
// @namespace   https://github.com/tatt61880
// @version     1.0.0
// @description Kuin APIのページの情報を、対象の型毎に切り替えることができるようにします。
// @author      tatt61880
// @match       https://kuina.ch/kuin/api_exe/builtin*
// @grant       none
// @updateURL   https://github.com/tatt61880/userscripts/raw/master/kuin-builtin.user.js
// @downloadURL https://github.com/tatt61880/userscripts/raw/master/kuin-builtin.user.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

(function($) {
  'use strict';

  const $h2s = $('h2');
  const typeSet = new Set();
  const nameTypeAll = 'All';
  let typeIdNext = 0;
  const typeIds = [];
  {
    // 順番を固定します。
    const types = [nameTypeAll, 'int', 'float', 'char', 'bool',
      'bit8', 'bit16', 'bit32', 'bit64',
      'list', 'stack', 'queue', 'dict', 'enum'];
    for (const type of types) {
      typeSet.add(type);
      typeIds[type] = typeIdNext++;
    }
  }

  for (let i = 0; i < $h2s.length; i++) {
    const $div = $('<div>');
    let $elem = $h2s.eq(i);
    let typeInfo = false;
    while ($elem.next()[0] !== undefined) {
      $div.append($elem.clone());
      const $prev = $elem;
      $elem = $elem.next();
      $prev.remove();
      if ($elem[0].nodeName == 'H2') break;
      if ($elem[0].className == 'navi_sub_bottom') break;
      if (!typeInfo && $elem[0].nodeName == 'DIV') {
        const match = $elem.text().match(/対象の型: ((?:[^,]+(?:, )?)*)/);
        if (match) {
          typeInfo = true;
          const types = match[1].split(', ');
          for (const type of types) {
            if (!typeSet.has(type)) {
              typeIds[type] = typeIdNext++;
              typeSet.add(type);
            }
            $div.addClass(`type${typeIds[type]}`);
          }
        }
      }
    }
    $elem.before($div);
  }

  {
    const $div = $('<div>', {'class': 'block'});
    let checked = ' checked';
    for (let type of typeSet) {
      const $radioButton = $(`<label><input type="radio" name="type" value="${type}"${checked}>${type} </label>`);
      checked = '';
      $div.append($radioButton);
      if (type == 'enum') {
        $div.append('<br>');
      }
    }
    $('h2').eq(0).parent().before($div);
  }

  $('input[name="type"]').change(function () {
    const selectedType = $(this).val();
    const selectedTypeId = typeIds[selectedType];
    if (selectedType == nameTypeAll) {
      for (let type of typeSet) {
        $(`.type${typeIds[type]}`).show();
      }
    } else {
      for (let type of typeSet) {
        $(`.type${typeIds[type]}`).hide();
      }
      $(`.type${selectedTypeId}`).show();
    }
  });
})(window.jQuery);
