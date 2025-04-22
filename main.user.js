// ==UserScript==
// @name         Dead by Daylight Perk Japanese Name
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Dead by Daylight Wikiのパーク名に日本語名を追加 
// @author       beive60
// @match        https://deadbydaylight.fandom.com/wiki*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const jsonUrl = 'https://raw.githubusercontent.com/beive60/dbd_dictionary/refs/heads/main/perk.json';
    const tableSelectors = ['#mw-content-text > div > table:nth-child(72)', '#mw-content-text > div > table:nth-child(74)'];

    console.log('Userscript started.'); // デバッグログ

    GM_xmlhttpRequest({
        method: 'GET',
        url: jsonUrl,
        onload: function(response) {
            console.log('JSON request completed.'); // デバッグログ
            console.log('Response status:', response.status); // デバッグログ
            if (response.status === 200 && response.responseText) {
                console.log('Response text:', response.responseText); // デバッグログ
                try {
                    const perkList = JSON.parse(response.responseText);
                    console.log('Parsed JSON:', perkList); // デバッグログ
                    const perkNameMap = {};
                    perkList.forEach(perk => {
                        perkNameMap[perk.English] = perk.Japanese;
                    });
                    console.log('Perk name map:', perkNameMap); // デバッグログ

                    tableSelectors.forEach(tableSelector => {
                        const table = document.querySelector(tableSelector);
                        console.log('Table element (selector: ' + tableSelector + '):', table); // デバッグログ

                        if (table) {
                            const rows = table.querySelectorAll('tbody > tr');
                            console.log('Table rows (selector: ' + tableSelector + '):', rows); // デバッグログ
                            rows.forEach(row => {
                                const englishNameCell = row.querySelector('th:nth-child(2) > a');
                                console.log('English name cell (selector: ' + tableSelector + '):', englishNameCell); // デバッグログ
                                if (englishNameCell && englishNameCell.textContent) {
                                    const englishName = englishNameCell.textContent.trim();
                                    console.log('English name found (selector: ' + tableSelector + '):', englishName); // デバッグログ
                                    const japaneseName = perkNameMap[englishName];
                                    console.log('Japanese name found (selector: ' + tableSelector + '):', japaneseName); // デバッグログ
                                    if (japaneseName) {
                                        const japaneseNameDiv = document.createElement('div');
                                        japaneseNameDiv.style.fontSize = '0.8em';
                                        japaneseNameDiv.style.color = 'gray';
                                        japaneseNameDiv.textContent = `(${japaneseName})`;
                                        englishNameCell.parentNode.appendChild(japaneseNameDiv);
                                        console.log('Japanese name added to (selector: ' + tableSelector + '):', englishNameCell); // デバッグログ
                                    }
                                }
                            });
                        } else {
                            console.error('指定されたテーブルが見つかりませんでした (selector: ' + tableSelector + ')。');
                        }
                    });

                } catch (e) {
                    console.error('JSONファイルのパースに失敗しました:', e);
                }
            } else {
                console.error('JSONファイルの読み込みに失敗しました。');
            }
        },
        onerror: function(error) {
            console.error('JSONファイルの読み込み中にエラーが発生しました:', error);
        }
    });
})();
