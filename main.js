'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var Tray = require("tray");
var Menu = require("menu");

require('crash-reporter').start();

var mainWindow = null;


app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {


	var appIcon = new Tray(__dirname + "/menu_icon.png");
	var contextMenu = Menu.buildFromTemplate([
		{label: '選択メニュー1', type: 'radio'},
		{label: '選択メニュー2', type: 'radio'},
		{type: 'separator'},
		{label: 'サブメニュー', submenu: [
			{label: 'サブメニュー1'},
			{label: 'サブメニュー2'}
			]},
		{label: '終了', accelerator: 'Command+Q', click: function() { app.quit(); }}
	]);
	appIcon.setContextMenu(contextMenu);
	// アイコンにマウスオーバーした時の説明
	appIcon.setToolTip('This is sample.');

	
	
  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({width: 570, height: 600, resizable: false});
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

	mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
