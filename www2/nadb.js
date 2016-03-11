//var API_BASE_URL = "http://localhost:8080/nadb/api"
//var API_BASE_URL = "http://nadb.local.com:8080/nadb/api"
var API_BASE_URL = "http://tjenester.nettavisen.no/nadb/api"

var authKey = "";
var nadb = {
    setAuthKey: function(key) {
      authKey = key;
    },
    insert : function (collectionName, jsonDocument, callback) {
        var postData = {
            collectionName : collectionName,
            jsonDocument : JSON.stringify(jsonDocument)
        };
        $.post(API_BASE_URL + "/insert", postData, function(result) {
            if(callback && $.isFunction(callback)) {
                callback(result);
            }
        }, "json");
    },
    update : function (collectionName, jsonQueryConfig, jsonDocument, callback) {
        var postData = {
            collectionName : collectionName,
            jsonQueryConfig : JSON.stringify(jsonQueryConfig),
            jsonDocument : JSON.stringify(jsonDocument),
            authKey : authKey
        };
        $.post(API_BASE_URL + "/update", postData, function(result) {
            if(callback && $.isFunction(callback)) {
                callback(result);
            }
        }, "json");
    },
    remove : function (collectionName, jsonQueryConfig, callback) {
        var postData = {
            collectionName : collectionName,
            jsonQueryConfig : JSON.stringify(jsonQueryConfig),
            authKey : authKey
        };
        $.post(API_BASE_URL + "/remove", postData, function(result) {
            if(callback && $.isFunction(callback)) {
                callback(result);
            }
        }, "json");
    },
    list : function (collectionName, jsonQueryConfig, callback) {
        var postData = {
            collectionName : collectionName,
            jsonQueryConfig :  JSON.stringify(jsonQueryConfig)
        };
        $.get(API_BASE_URL + "/list", postData, function(result) {
            if(callback && $.isFunction(callback)) {
                callback(result);
            }
        }, "json");
    },
    group : function (collectionName, jsonQueryConfig, callback) {
        var postData = {
            collectionName : collectionName,
            jsonQueryConfig :  JSON.stringify(jsonQueryConfig)
        };
        $.get(API_BASE_URL + "/group", postData, function(result) {
            if(callback && $.isFunction(callback)) {
                callback(result);
            }
        }, "json");
    },
    tellusProducts : function (jsonQueryConfig, callback) {
        var postData = {
            jsonQueryConfig :  JSON.stringify(jsonQueryConfig)
        };
        $.get(API_BASE_URL + "/tellusProducts", postData, function(result) {
            if(callback && $.isFunction(callback)) {
                callback(result);
            }
        }, "json");
    }
}
