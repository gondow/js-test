/*
  並列にN個までAjax要求を出したい．そのための簡易ライブラリ．
  */

var queue = []; // 待ち行列，任意に大きくなれる
var max_request = 5; // 発行できる最大の並列タスク数
var num_pending = 0; // 現在実行中の並列タスク数 <= max_request

function slow_task (callback) {
    var timeout_sec = Math.floor (Math.random() * 4) + 3;  // 3〜6秒
    console.log ("timeout_sec = " + timeout_sec);
    setTimeout (callback, timeout_sec * 1000);
}

function enqueue (task_closure) {
    // まず単純にキューに追加する
    // console.log ("num_pending = " + num_pending);
    queue.push (task_closure);
    console.log ("queue.length = " + queue.length);
    dequeue (); // 余裕があれば，キュー中のタスクを実行
}

// タスクが終了する際に必ず呼ばなくてはいけない
function dequeue () {
    if (num_pending >= max_request && queue.length > 0) {
	console.log ("!!!dequeue blocked: num_pending = " + num_pending);
    }
    while (num_pending < max_request && queue.length > 0) {
	var task_closure2 = queue.shift (); // キューから取り出して
	// console.log ("task_closure2 = " + task_closure2);
	num_pending++;
	console.log ("num_pending(++) = " + num_pending);
	task_closure2 (); // それを実行
    }
}

function finalize_task () {
    num_pending--;
    console.log ("num_pending(--) = " + num_pending);
    dequeue ();
}

function initialize_task (task, arg) {
    enqueue (function () { task (arg, finalize_task) ; });
}

function task (name, callback) {
    console.log ("begin = " + name);
    slow_task (function () { console.log ("end = " + name); callback (); });
}

initialize_task (task, "hoge1");
initialize_task (task, "hoge2");
initialize_task (task, "hoge3");
initialize_task (task, "hoge4");
initialize_task (task, "hoge5");
initialize_task (task, "hoge6");
initialize_task (task, "hoge7");
initialize_task (task, "hoge8");
initialize_task (task, "hoge9");
