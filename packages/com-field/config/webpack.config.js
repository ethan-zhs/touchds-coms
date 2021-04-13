const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MonacoWebpackPlugin = require(require.resolve('monaco-editor-webpack-plugin'))
const paths = require('./paths')

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    entry: ['webpack-hot-middleware/client?reload=true', paths.resolve('src/view/index.tsx')],
    output: {
        path: paths.resolve('dist'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    }
                ],
                exclude: /node_modules/,
                include: paths.resolve('src')
            },
            {
                test: /\.(tsx|ts)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    },
                    'awesome-typescript-loader'
                ],
                exclude: /node_modules/,
                include: paths.resolve('src')
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
                include: [
                    paths.resolve('src'),
                    paths.resolve('node_modules/github-markdown-css'),
                    paths.resolve('node_modules/monaco-editor')
                ]
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
                include: paths.resolve('src')
            },
            {
                test: /\.md$/,
                use: ['frontmatter-markdown-loader']
            },
            {
                test: /\.(jpe?g|png|ico|gif|woff|woff2|eot|ttf|otf|svg|swf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 4000,
                            name: 'images/[name][hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    plugins: [
        // webpack热更新组件
        new webpack.HotModuleReplacementPlugin(),

        new MonacoWebpackPlugin({
            languages: ['json']
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: paths.resolve('src/view/index.html'), // 模板路径
            inject: true, // js插入位置
            chunksSortMode: 'none',
            chunks: ['manifest', 'vendor', 'main'],
            hash: true
        })
    ]
}
