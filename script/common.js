window.onload = function () {

  /*
    tdを取得 $board
    結果表示画面  $result
  */
  const $board = document.getElementsByTagName('td');
  const $result = document.getElementById('js-result');
  const $resultWhite = document.getElementById('js-result-white');
  const $resultBlack = document.getElementById('js-result-black');

  // 先手　true: 黒、false：白
  //TODO: trueとかわかりにくいからもう少し直接的な表現であればコメントを書かなくていいのでは？
  let player = true;

  // game終了までのカウンター
  let playCount = 15;

  let othelloWhite = 0;
  let othelloBlack = 0;

  // tableの全てにclickイベントを付与する
  for (let i = 0; i < $board.length; i++) {
    $board[i].addEventListener('click', function () {
      // 配列に変換する
      const board = [...$board];

      // クリックした位置の取得
      const tableIndex = board.indexOf(this);
      putOthello(tableIndex);
    });
  }


  /**
  * @param {number} index
  */
  function putOthello(index) {
    // すでにオセロが置かれていた場合は処理をさせない
    if ($board[index].innerHTML) return false;

    const othello = (player) ? '●' : '◯';
    $board[index].innerHTML = othello;
    player = !player;
    playCount--;
    checkBoard(playCount);
    checkPutOthello(index);
  }

  /**
  * @param {number} count
  */
  // gameが終了したときの処理
  function checkBoard(count) {
    if (count !== 0) return false;
    $result.classList.add('is-show');
    getResults();
  }

  // indexは0~63, 斜め位置は左上は-9、右下は+9, 右上は-7、左下は+7と横と縦をチェックする方法
  // 行と列の番号を取得してそこからチェックすべき箇所を配列で作る、作った配列をチェックしていく
  // オセロがおける位置かチェック　全てが同じ色でない
  function checkPutOthello(index) {
    const columnIndex = getColumnIndex(index);
    const leftLength = getGridCount(columnIndex, 'left');
    const rightLength = getGridCount(columnIndex, 'right');

    const columnLine = generateArray(index,leftLength, rightLength);
    let rowLine = [];
    let crossLine = [];

    // 周辺のindex
    const around = [index - 9, index - 8, index - 7, index + 7, index + 8, index + 9];

    // 石を設置できる箇所であるかチェック
    // 一つでも違う色の石があるのかを確認する
    // 取得したindexをもとにチェックすべき箇所のindexの配列をつくる
    // 左上:index-9 上:index-8 右上:index-7  左下:index+7 下:index+8 右下:index+9

    console.log(index);
    console.log(columnLine);
  }

  // 結果を計算&表示する（それぞれのオセロの数を出す）
  function getResults() {
    const othello = [0, 0];
    for (let i = 0; i < $board.length; i++) {
      if ($board[i].innerHTML === '●') othello[0] += 1;
      if ($board[i].innerHTML === '◯') othello[1] += 1;
    }

    $resultBlack.prepend(othello[0]);
    $resultWhite.prepend(othello[1]);
  }

  // 列indexを取得する　縦の位置を知るために行のindexも返すように変更する
  function getColumnIndex(index) {
    const column = {
      0:[0, 8, 16, 24, 32, 40, 48, 56],
      1:[1 ,9 ,17 ,25 ,33 ,41 ,49 ,57],
      2:[2, 10, 18, 26, 34, 42, 50, 58],
      3:[3 ,11 ,19 ,43 ,51 ,59],
      4:[4 ,12 ,20 ,44 ,52 ,60],
      5:[5 ,13 ,21 ,29 ,37 ,45 ,53 ,61],
      6:[6 ,14 ,22 ,30 ,38 ,46 ,54 ,62],
      7:[7 ,15 ,23 ,31 ,39 ,47 ,55 ,63],
    }

    const row = {
      0:[0, 1, 2, 3, 4, 5, 6, 7],
      1:[8 ,9 ,10 ,11 ,12 ,13 ,14, 15],
      2:[16, 17, 18, 19, 20, 21, 22, 23],
      3:[24 ,25 ,26 ,27 ,28 ,29, 30, 31],
      4:[32 ,33 ,34 ,35 ,36 ,37, 38, 39],
      5:[40 ,41 ,42 ,43 ,44 ,45 ,46 ,47],
      6:[48 ,49 ,50 ,51 ,52 ,53 ,54 ,55],
      7:[56 ,57 ,58 ,59 ,60 ,61 ,62 ,63],
    }

    for (let i = 0; i < 8; i++) {
      for (let n = 0; n < column[i].length; n++) {
        if (column[i][n] === index) {
          return i;
        }
      }
    }
  }

  // 列の位置から左右の端までを計算する　※関数名微妙
  function getGridCount(columnIndex, direction) {
    let count = 0;
    if (direction === 'right') {
      for (let i = columnIndex; i < 7; i++) {
        count++;
      }
    } else {
      for (let i = columnIndex; i > 0 ; i--) {
        count++;
      }
    }
    return count;
  }

  // チェックする配列を作る
  function generateArray(index, leftLength, rightLength) {
    let array = [];
    for (let i = 0; i < leftLength; i++) {
      array[array.length] = index - (i + 1);
    }

    for (let i = 0; i < rightLength; i++) {
      array[array.length] = index + (i + 1);
    }

    array.sort(compareNumber);

    return array;
  }

  // 数値の比較処理
  function compareNumber(a, b) {
    return a - b;
  }

  // 結果が出た後閉じるボタンを押すとゲームがリセットされる（リスタート）
}
