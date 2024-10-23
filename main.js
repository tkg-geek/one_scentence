document.addEventListener("DOMContentLoaded", function () {
    const inputContainer = document.getElementById("input-container");
    const addButton = document.getElementById("add");
    const resetButton = document.getElementById("reset");
    const playButton = document.getElementById("play");
    const saveButton = document.getElementById("save");

    // テキストエリアを生成する関数
    function createTextArea(value = "") {
        const textAreaWrapper = document.createElement("div");
        textAreaWrapper.classList.add("cp_iptxt");

        const input = document.createElement("input");
        input.type = "text";
        input.classList.add("ef");
        input.value = value; // 既存の値をセット

        const focusLine = document.createElement("span");
        focusLine.classList.add("focus_line");

        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-btn");
        removeButton.setAttribute("aria-label", "Remove");
        removeButton.innerHTML = '<i class="fas fa-times"></i>';

        removeButton.onclick = function () {
            if (inputContainer.children.length > 1) {
                inputContainer.removeChild(textAreaWrapper);
            }
        };

        textAreaWrapper.appendChild(input);
        textAreaWrapper.appendChild(focusLine);
        textAreaWrapper.appendChild(removeButton);
        inputContainer.appendChild(textAreaWrapper);
    }

    // localStorageからデータを読み込んでテキストエリアを生成
    const loadTextAreas = () => {
        const textAreasCount = localStorage.length; // localStorageのデータ数を取得
        for (let i = 0; i < textAreasCount; i++) {
            const value = localStorage.getItem(`textArea_${i}`); // 保存された値を取得
            if (value) {
                createTextArea(value); // 値がある場合はテキストエリアを生成
            }
        }
        // 最初のテキストエリアを生成しない場合は、初期のテキストエリアを表示しない
    };

    // ページロード時にテキストエリアを生成
    loadTextAreas();

    // +ボタンでテキストエリアを追加
    addButton.onclick = function () {
        createTextArea(); // 引数なしで呼び出す
    };

    // リセットボタン
    resetButton.onclick = function () {
        while (inputContainer.firstChild) {
            inputContainer.removeChild(inputContainer.firstChild);
        }
        localStorage.clear(); // localStorageもクリア
        createTextArea(); // 最初のテキストエリアを再作成
    };

    // 保存ボタン
    saveButton.onclick = function () {
        const textAreas = Array.from(inputContainer.querySelectorAll("input[type='text']"));
        textAreas.forEach((input, index) => {
            const value = input.value.trim(); // 空白を除去して値を取得
            if (value) { // 値が空でない場合のみ保存
                localStorage.setItem(`textArea_${index}`, value);
            } else {
                localStorage.removeItem(`textArea_${index}`); // 空なら削除
            }
        });
    };

    // フルスクリーン表示ボタン
    playButton.onclick = function () {
        const textAreas = Array.from(inputContainer.querySelectorAll("input[type='text']"));
        let currentTextIndex = 0;

        const showFullScreenText = () => {
            const fullScreenText = textAreas[currentTextIndex]?.value;
            if (fullScreenText) {
                const fullScreenDiv = document.createElement("div");
                fullScreenDiv.classList.add("fullscreen");
                fullScreenDiv.innerHTML = `<div class="fullscreen-text">${fullScreenText}</div>`;

                // フルスクリーン表示をリクエスト
                document.body.appendChild(fullScreenDiv);
                fullScreenDiv.requestFullscreen();

                fullScreenDiv.onclick = function () {
                    currentTextIndex++;
                    if (currentTextIndex < textAreas.length) {
                        const nextText = textAreas[currentTextIndex]?.value;
                        if (nextText) {
                            fullScreenDiv.innerHTML = `<div class="fullscreen-text">${nextText}</div>`;
                        } else {
                            document.exitFullscreen();
                            document.body.removeChild(fullScreenDiv);
                        }
                    } else {
                        document.exitFullscreen();
                        document.body.removeChild(fullScreenDiv);
                    }
                };
            }
        };

        showFullScreenText();
    };
});
