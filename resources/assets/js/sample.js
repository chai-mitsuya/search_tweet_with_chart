// momentのimport
import moment from "moment";

// sessionStorage に保存したデータを取得する
let serach_conditions_json = sessionStorage.getItem('serach_conditions');
// JOSNから配列に変換
let serach_conditions = JSON.parse(serach_conditions_json);

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

    // セッションに検索条件を保存する
    let serach_conditions = {
        keyward: $('input[name="keyword"]').val(),
        date_from_hidden:$('#hidden_from_date_time').val(),
        date_to_hidden:$('#hidden_to_date_time').val(),
    };
    sessionStorage.setItem('serach_conditions', JSON.stringify(serach_conditions));
});

// グラフの表示
if ($('#chart_data_hidden').val() != null) {
    // グラフの情報を取得する
    let chart_data_array = JSON.parse($('#chart_data_hidden').val());

    // 検索範囲
    let from_date_moment = moment(serach_conditions['date_from_hidden'] .replace('_', ' '));
    from_date_moment.format("YYYY-MM-DD HH:mm");
    let to_date_moment = moment(serach_conditions['date_to_hidden'].replace('_', ' '));
    to_date_moment.format("YYYY-MM-DD HH:mm");

    // 差分を分で取得する
    let duration_minutes = to_date_moment.diff(from_date_moment) / 60000;

    // グラフの間隔
    let time_value = 1;
    let time_unit = 'hours';

    if (duration_minutes <= 180) {
        // 〜３時間 ５分間隔
        time_value = 5;
        time_unit = 'minutes';
    }
    else if (duration_minutes <= 300) {
        // ４時間〜５時間 １０分間隔
        time_value = 10;
        time_unit = 'minutes';
    }
    else if (duration_minutes <= 660) {
        // ６時間〜１１時間 １５分間隔
        time_value = 15;
        time_unit = 'minutes';
    }
    else if (duration_minutes <= 1440) {
        // １２時間〜１日 ３０分間隔
        time_value = 30;
        time_unit = 'minutes';
    }
    else if (duration_minutes <= 5760) {
        // ２日〜４日 ２時間間隔
        time_value = 2;
        time_unit = 'hours';
    }
    else if (duration_minutes <= 10080) {
        // ５日〜７日 ４時間間隔
        time_value = 4;
        time_unit = 'hours';
    }

    let to_time = moment.duration(time_value, time_unit);

    // x軸となる配列(最初の日付は再フォーマットしないと表示がおかしくなる)
    let x_axis = ['times', moment(from_date_moment.format("YYYY-MM-DD HH:mm"))];

    // ループの判定用変数
    let clone_date_moment = null;
    while (clone_date_moment < to_date_moment) {
        // 時間を定義
        let tmp_date_moment = moment(from_date_moment.add(to_time).format("YYYY-MM-DD HH:mm").toString());
        // 配列に格納
        x_axis.push(tmp_date_moment);
        // ループの判定用
        clone_date_moment = tmp_date_moment.clone();
        // 検索範囲以上の時間になったらループを抜ける
        if (clone_date_moment > to_date_moment) {
            x_axis.push(to_date_moment);
            break;
        }
    }

    // データとなる配列
    let text = serach_conditions['keyward'];
    let data_array = [text];

    // x軸でループ
    x_axis.forEach((value, index) => {
        if (value != 'times') {
            let check_date_from = moment(x_axis[index]);
            let check_date_to = moment(x_axis[index + 1]);
            // カウント
            let conut = 0;
            for (let index = 0; index < chart_data_array.length; index++) {
                let chart_target = moment(chart_data_array[index]);
                if (check_date_from < chart_target && chart_target < check_date_to) {
                    conut = conut + 1;
                }
            }
            data_array.push(conut);
        }
    });

    // グラフの生成
    var chart = c3.generate({
        bindto: '#chart',
        data: {
          x: 'times',
          xFormat: '%m-%d %H:%M',
          columns: [
            x_axis,
            data_array
          ]
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%m-%d %H:%M'
                }
            }
        }
    });
}
