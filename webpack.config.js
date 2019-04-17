const Encore = require('@symfony/webpack-encore');

const jsonImporter = require('node-sass-json-importer');

const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const CopyWebpackPlugin = require('copy-webpack-plugin')

Encore
    .setOutputPath('public/build/')

    .setPublicPath('/build')

    .addEntry('js/custom_image', './assets/js/custom_image.js')

    .addEntry('js/layout', './assets/js/layout.js')

    .addStyleEntry('css/global', './assets/css/global.scss')

    .enableSingleRuntimeChunk()
    //.disableSingleRuntimeChunk()
    /*.enableBuildNotifications(true, (options) => {
        options.alwaysNotify = true;
    })*/
    .addPlugin(new WebpackBuildNotifierPlugin({
        title: "Custom Image",
        //logo: path.resolve("./img/logo.png"),
        //  successIcon: path.resolve("./img/success.png"),
        warningSound: false
    }))

    .addPlugin(new CopyWebpackPlugin([
        {
            from: './assets/static',
            to: 'static'
        }
    ]))
    .configureBabel(function (babelConfig) {
        babelConfig.presets[0][1].corejs = 2;
    }, {})

    .enableSassLoader(function (options) {
        options.importer = jsonImporter()
    })

    .enableSourceMaps(!Encore.isProduction())

    .cleanupOutputBeforeBuild()

    .autoProvidejQuery()

    .enableVersioning(!Encore.isDevServer())
;


// export the final configuration
module.exports = Encore.getWebpackConfig();