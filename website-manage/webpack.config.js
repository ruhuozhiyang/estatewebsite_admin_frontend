//只要是插件，一定要放到plugins节点中去
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack=require('webpack');
const htmlWebpackPlugin=require('html-webpack-plugin'); 
//这个配置文件起始就是一个JS文件，通过Node中的模块操作，向外暴露了一个配置对象
module.exports={
    // 这里指定了入口文件，就不需要在package.json的文件中加上main的字段指定入口文件了。
    entry:path.join(__dirname,'./main.js'), 
    output:{
        path:path.join(__dirname,'./dist'),
        filename:'bundle.js'
    },
    devServer:{     //这是配置dev-server命令参数的第二种方式，相对来说更麻烦一些
        contentBase:'dist',
        hot:true,
        open: true, // 启动服务后是否自动打开浏览器，true-每次启动都会打开新的
        // host: '192.168.1.246', // 允许外部ip访问
        port: 3000, // 端口
        https: false, // 是否启用https
        //设置代理 处理跨域
        proxy: {
            '/api': {
                target: 'http://localhost:8080/api/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
    },
    plugins:[      //配置插件的节点
        new VueLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin(),   //new一个热更新的模块对象
        new htmlWebpackPlugin({         //这是在内存中生成html页面的插件
            template:path.join(__dirname,'./index.html'),   //指定模版页面，将来会根据指定模版页面去生存内存中的页面
            filename:'index.html'  //指定生成页面的名称
        })
    ],
    module:{       //这个节点用于配置所有第三方模块加载器
        rules:[    //所有第三方模块的匹配规则
            {test:/\.vue$/,use:['vue-loader']}, //配置处理.vue文件的第三方加载器
            {test:/\.css$/,use:['style-loader','css-loader']},//配置处理.css文件的第三方加载器
            {test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,use:['file-loader']},
            {// less文件解析，主要style-loader，css-loader，是less-loader能正常解析的前提
                test: /\.less$/,
                use: [
                // { loader: 'vue-style-loader' },
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                            lessOptions: {
                                javascriptEnabled: true,
                            },
                        },
                    },
                ],
            },
            {
                test:/\.js$/,
                use:['babel-loader'],
                exclude: /node_modules/,
            }
        ]
    },
    // resolve: {// 解析文件
    //     alias: {// 路径别名。导入路径匹配到ant-design-vue，以'./components'为实际路径解析
    //       'ant-design-vue': path.join(__dirname, './node_modules/ant-design-vue/es'),
    //     },
    //     extensions: ['.js', '.jsx', '.vue'], // 模块导入可以省略后缀
    // },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        },
    },
}