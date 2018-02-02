/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

webView.url.common={};

webView.url.common.root = window.location.pathname.substr(1, window.location.pathname.lastIndexOf('/'));

webView.url.common.getDataTorrentURL = "getDataTorrentURL";
webView.url.common.getSparkConsoleURL = "getSparkConsoleURL";
webView.url.common.getSparkZeppelinURL = "getSparkZeppelinURL";
webView.url.common.getSparkProjectList = "getSparkProjectList";

webView.url.common.doLogout = "doLogout";
webView.url.common.getAllUsers = "getAllUsers";

