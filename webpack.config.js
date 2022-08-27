const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: __dirname + "/src/app.js",
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.js',
	},

	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		compress: true,
		port: 12345,
	},

	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: "html-loader",
			},
			
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			filename: 'index.html',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'src/fonts', to: './fonts' },
				{ from: 'src/favicon.ico', to: './favicon.ico' },
				// { from: 'src/manifest.json', to: './manifest.json' },
				// { from: 'src/robots.txt', to: './robots.txt' },
			],
		}),
		new MiniCssExtractPlugin()
	]
};