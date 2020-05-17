// momentのimport
import moment from "moment";

// 検索ボタン
$("#search_form").submit(function () {
    // 検索範囲 From
    // 入力値の取得
    let from_date_select = $('#from_date_select').val();
    let from_time_select = $('#from_time_select').val();
    // 日付と時刻を結合してmomentオブジェクト
    let from_date_time = from_date_select + ' ' + from_time_select;
    let moment_from_date_time = moment(from_date_time);

    // 検索範囲 To
    // 入力値の取得
    let to_date_select = $('#to_date_select').val();
    let to_time_select = $('#to_time_select').val();
    // 日付と時刻を結合してmomentオブジェクト
    let to_date_time = to_date_select + ' ' + to_time_select;
    let moment_to_date_time = moment(to_date_time);

    // サーバに送る値を設定
    $('#hidden_from_date_time').val(moment_from_date_time.format("YYYY-MM-DD_HH:mm:SS"));
    $('#hidden_to_date_time').val(moment_to_date_time.format("YYYY-MM-DD_HH:mm:SS"));
});

var chart = c3.generate({
    bindto: '#chart',
    data: {
        columns: [
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 50, 20, 10, 40, 15, 25]
        ]
    }
});
