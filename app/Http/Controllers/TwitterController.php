<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Abraham\TwitterOAuth\TwitterOAuth;

class TwitterController extends Controller
{
    public function index(Request $request)
    {
        //ツイートを5件取得
        $result = \Twitter::get('statuses/home_timeline', array("count" => 5));

        //ViewのTwitter.blade.phpに渡す
        return view('twitter', [
            "result" => $result
        ]);
    }

    public function search(Request $request)
    {
        // 検索文字列
        $keyword = $request['keyword'];
        // 日時（From）
        $from_date_time = ' since:' . $request['from_date_time'] . '_JST';
        // 日時（To）
        $to_date_time = ' until:' . $request['to_date_time'] . '_JST';

        // APIに送る検索文字列
        $query = $keyword . $from_date_time . $to_date_time;

        // ツイートを取得する
        $result = [];
        $max_id = null;

        // 確認用
        // dump(\Twitter::get('application/rate_limit_status', array('resources'=>'search'))->resources->search->{'/search/tweets'});

        // 最低1回は検索するようにループする
        do {
            // max_idが設定されている場合はリクエストパラメータに追加する
            if (isset($max_id)) {
                $tweets = \Twitter::get('search/tweets', array('q' => $query, 'count' => 100,'max_id' => $max_id));
            } else {
                // 初回はmax_idを指定しない
                $tweets = \Twitter::get('search/tweets', array('q' => $query, 'count' => 100));
            }

            if (!empty($tweets->statuses)) {
                // レスポンスの配列に取得したツイートを追加していく
                $result = array_merge($result,$tweets->statuses);
                $max_id = end($tweets->statuses)->id;
            }

            // 検索制限になった場合は処理を終える
            $limit = \Twitter::get('application/rate_limit_status', array('resources'=>'search'))->resources->search->{'/search/tweets'}->remaining;
            if ($limit == 0) {
            break;
            }
        } while (count($tweets->statuses) == 100);

        // 確認用
        // dump(\Twitter::get('application/rate_limit_status', array('resources'=>'search'))->resources->search->{'/search/tweets'});

        // 取得したツイートの時刻を日本時間に直す
        foreach ($result as $key => $value) {
            $t = new \DateTime($value->created_at);
            $t->setTimeZone(new \DateTimeZone('Asia/Tokyo'));
            $value->created_at = date('Y-m-d H:i', strtotime((string)$t->format(\DateTime::COOKIE)));
        }

        // ViewのTwitter.blade.phpに渡す
        return view('twitter', [
            "result" => $result
            ]);
    }
}
