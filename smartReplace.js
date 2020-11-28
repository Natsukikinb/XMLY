const download = require("download");
async function replaceWithSecrets(content, Secrets) {
    if (!Secrets || !Secrets) return content;
    const replacements = [];
    await init_notify(Secrets, content, replacements);
        if (Secrets.JD_COOKIE && content.indexOf("require('./jdCookie.js')") > 0) {
            replacements.push({ key: "require('./jdCookie.js')", value: JSON.stringify(Secrets.JD_COOKIE.split("&")) });
        }
        if (Secrets.JD_COOKIE && content.indexOf('require("./jdCookie.js")') > 0) {
            replacements.push({ key: 'require("./jdCookie.js")', value: JSON.stringify(Secrets.JD_COOKIE.split("&")) });
        }
        if (Secrets.DETECT_URL) {
            replacements.push({ key: /url = \[\]/, value: "url = " + JSON.stringify(Secrets.DETECT_URL.split("\n")) });
            replacements.push({ key: /price = \[\]/, value: "price = " + JSON.stringify(Secrets.DETECT_PRICE.split("\n")) });
        }
        if (Secrets.COOKIE_DKYD) {
            replacements.push({ key: "$util.getdata(DUOKAN_COOKIE_KEY)", value: JSON.stringify(Secrets.COOKIE_DKYD.split("\n")[0]) });
            replacements.push({ key: "$util.getdata(DUOKAN_DEVICE_ID_KEY)", value: JSON.stringify(Secrets.COOKIE_DKYD.split("\n")[1]) });
        }
        if (Secrets.COOKIE_ELM) {
            replacements.push({ key: "sy.getdata(cookieKey)", value: JSON.stringify(Secrets.COOKIE_ELM) });
        }
        if (Secrets.JD_COOKIE && content.indexOf("京东赚赚") > 0) {
            replacements.push({ key: ', $.getdata("jdzz_token2") || "";', value: "" });
            replacements.push({ key: '$.getdata("jdzz_token1")', value: JSON.stringify(Secrets.JD_TOKEN) });
        }
        if (Secrets.COOKIE_QQYD) {
            replacements.push({ key: "$.getdata(qqreadurlKey)", value: JSON.stringify(Secrets.COOKIE_QQYD.split("\n")[0]) });
            replacements.push({ key: "$.getdata(qqreadheaderKey)", value: JSON.stringify(Secrets.COOKIE_QQYD.split("\n")[1]) });
            replacements.push({ key: "$.getdata(qqreadtimeurlKey)", value: JSON.stringify(Secrets.COOKIE_QQYD.split("\n")[2]) });
            replacements.push({ key: "$.getdata(qqreadtimeheaderKey)", value: JSON.stringify(Secrets.COOKIE_QQYD.split("\n")[3]) });
            //replacements.push({ key: "qqreadsign();", value: "{qqreadsign(); qqreadsign2();}" });
            //replacements.push({ key: "11&&sign.data.videoDoneFlag==0", value: "99" });
        }
        await downloader(content);//检查所需额外js
    /*
        if (Secrets.MarketCoinToBeanCount && !isNaN(Secrets.MarketCoinToBeanCount)) {
            let coinToBeanCount = parseInt(Secrets.MarketCoinToBeanCount);
            if (coinToBeanCount >= 0 && coinToBeanCount <= 20 && content.indexOf("$.getdata('coinToBeans')") > 0) {
                console.log("蓝币兑换京豆操作已注入");
                replacements.push({ key: "$.getdata('coinToBeans')", value: coinToBeanCount });
            }
        }
     */

/******************** 转换器 ********************/
let isQuantumultX=$task!=undefined;let isSurge=$httpClient!=undefined;let isLoon=isSurge&&typeof $loon!=undefined;var $task=isQuantumultX?$task:{};var $httpClient=isSurge?$httpClient:{};var $prefs=isQuantumultX?$prefs:{};var $persistentStore=isSurge?$persistentStore:{};var $notify=isQuantumultX?$notify:{};var $notification=isSurge?$notification:{};if(isQuantumultX){var errorInfo={error:"",};$httpClient={get:(url,cb)=>{var urlObj;if(typeof url=="string"){urlObj={url:url,}}else{urlObj=url}
$task.fetch(urlObj).then((response)=>{cb(undefined,response,response.body)},(reason)=>{errorInfo.error=reason.error;cb(errorInfo,response,"")})},post:(url,cb)=>{var urlObj;if(typeof url=="string"){urlObj={url:url,}}else{urlObj=url}
url.method="POST";$task.fetch(urlObj).then((response)=>{cb(undefined,response,response.body)},(reason)=>{errorInfo.error=reason.error;cb(errorInfo,response,"")})},}}
if(isSurge){$task={fetch:(url)=>{return new Promise((resolve,reject)=>{if(url.method=="POST"){$httpClient.post(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error,})}else{resolve(null,{error:error,})}})}else{$httpClient.get(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error,})}else{resolve(null,{error:error,})}})}})},}}
if(isQuantumultX){$persistentStore={read:(key)=>{return $prefs.valueForKey(key)},write:(val,key)=>{return $prefs.setValueForKey(val,key)},}}
if(isSurge){$prefs={valueForKey:(key)=>{return $persistentStore.read(key)},setValueForKey:(val,key)=>{return $persistentStore.write(val,key)},}}
if(isQuantumultX){$notify=((notify)=>{return function(title,subTitle,detail,url=undefined){detail=url===undefined?detail:`${detail}\n点击链接跳转: ${url}`;notify(title,subTitle,detail)}})($notify);$notification={post:(title,subTitle,detail,url=undefined)=>{detail=url===undefined?detail:`${detail}\n点击链接跳转: ${url}`;$notify(title,subTitle,detail)},}}
if(isSurge&&!isLoon){$notification.post=((notify)=>{return function(title,subTitle,detail,url=undefined){detail=url===undefined?detail:`${detail}\n点击链接跳转: ${url}`;notify.call($notification,title,subTitle,detail)}})($notification.post);$notify=(title,subTitle,detail,url=undefined)=>{detail=url===undefined?detail:`${detail}\n点击链接跳转: ${url}`;$notification.post(title,subTitle,detail)}}
if(isLoon){$notify=(title,subTitle,detail,url=undefined)=>{$notification.post(title,subTitle,detail,url)}}
/******************** 转换器 ********************/
    return batchReplace(content, replacements);
}
function batchReplace(content, replacements) {
    for (var i = 0; i < replacements.length; i++) {
        content = content.replace(replacements[i].key, replacements[i].value);
    }
    return content;
}

async function init_notify(Secrets, content, replacements) {
    if (!Secrets.PUSH_KEY && !Secrets.BARK_PUSH && !Secrets.TG_BOT_TOKEN) {
        if (content.indexOf("require('./sendNotify')") > 0) {
            replacements.push({
                key: "require('./sendNotify')",
                value:
                    "{sendNotify:function(){},serverNotify:function(){},BarkNotify:function(){},tgBotNotify:function(){}}",
            });
        }
    }/* else {
        await download_notify();
        if (content.indexOf("京东多合一签到") > 0 && content.indexOf("@NobyDa") > 0) {
            console.log("京东多合一签到通知注入成功");
            replacements.push({
                key: "var LogDetails = false;",
                value: `const lxk0301Notify = require('./sendNotify');var LogDetails = false;`,
            });
            replacements.push({
                key: `if (!$nobyda.isNode) $nobyda.notify("", "", Name + one + two + three + four + disa + notify);`,
                value: `console.log("通知开始");lxk0301Notify.sendNotify("京东多合一签到", one + two + three + notify);console.log("通知结束");`,
            });
        }
    }*/
}
async function downloader(content) {
    if (content.indexOf("jdFruitShareCodes") > 0) {
        await download_jdFruit();
    }
}

async function download_notify() {
    await download("https://github.com/lxk0301/scripts/raw/master/sendNotify.js", "./", {
        filename: "sendNotify.js",
    });
    console.log("下载通知代码完毕");
}

module.exports = {
    replaceWithSecrets,
};
