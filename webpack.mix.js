const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css');

mix.js("resources/assets/js/sample.js", "public/js");

// develop環境の時にソースマップを表示するための設定
if (!mix.inProduction()) {
    mix.webpackConfig({devtool: 'source-map'}).sourceMaps()
}

// キャッシュを更新
mix.version();

