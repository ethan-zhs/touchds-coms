const webpack = require('webpack')
const nodeExternals = require(require.resolve('webpack-node-externals'))
const { paths } = require('@touchds/com-utils/node')
const { resolve } = require('./utils')

module.exports = {
    mode: 'production',
    entry: resolve('src/index.js'),
    output: {
        path: paths.resolve('dist'),
        filename: 'index.js',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            configFile: resolve('babel.config.js')
                        }
                    }
                ],
                include: [paths.resolve(''), resolve('src')]
            },
            {
                test: /\.(tsx|ts)$/,
                use: [
                    {
                        loader: require.resolve('babel-loader')
                    },
                    {
                        loader: require.resolve('ts-loader'),
                        options: {
                            configFile: resolve('tsconfig.json')
                        }
                    }
                ],
                include: [paths.resolve(''), resolve('src')]
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]'
                            }
                        }
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            config: {
                                path: resolve('postcss.config.js')
                            }
                        }
                    }
                ],
                include: [paths.resolve(''), resolve('src')]
            },
            {
                test: /\.less$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]'
                            }
                        }
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            config: {
                                path: resolve('postcss.config.js')
                            }
                        }
                    },
                    require.resolve('less-loader')
                ],
                include: [paths.resolve(''), resolve('src')]
            },
            {
                test: /\.(jpe?g|png|ico|gif|woff|woff2|eot|ttf|otf|svg|swf)$/,
                use: [
                    {
                        loader: require.resolve('file-loader'),
                        options: {
                            limit: 4000,
                            name: 'images/[name][hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // 限制code splitting不分片
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ],

    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            '@babel/runtime': resolve('node_modules/@babel/runtime'),
            '@component-entry': paths.resolve('index.js'),
            '@component-packagejson': paths.resolve('package.json')
        }
    },
    externals: [
        // nodeExternals({
        //     // this WILL include `@touchds/com-load-script` in the bundle
        //     whitelist: ['@touchds/com-load-script']
        // })
    ]
}
