
exports.initApp = () => {
    console.log('App Launched')
}

exports.saveStorage  = (key, value, cBack) => {
    const saveObj = {}
    saveObj[key] = value
    chrome.storage.local.set(saveObj, function() {
        console.log(`Object: ${JSON.stringify(saveObj)} has been set`);
        cBack()
    });
}

exports.saveObjToStorage  = (saveObj, cBack) => {
    chrome.storage.local.set(saveObj, function() {
        console.log(`Object: ${JSON.stringify(saveObj)} has been set`);
        cBack()
    });
}

exports.getFromStorage = (keyList, cBack) => {
    chrome.storage.local.get(keyList, function(result) {
        console.log(`Key: ${keyList} has been fetched ${JSON.stringify(result)}`);
        cBack(result)
    });
}

exports.getFromStorageSync = async (key) => {
    return  chrome.storage.local.get(key)
}

exports.removeFromStorage = (key, cBack) => {
    chrome.storage.local.remove(key, function() {
        console.log(`Key: ${key} has been deleted`);
        cBack()
    });
}

exports.setProxyByIp = (ip, options, cBack) => {

    console.log(`Proxy Ip ${ip} has been set`)
    cBack()
}

exports.navigateToOptions = () => {
    chrome.tabs.create({'url': "/index.html?#/options" } )
}

exports.executeSettingsUpdate = (appKey, valueChange, extras = {}, cBack) => {
    console.log('Executing action')
    switch (appKey) {
        case 'setGeoByIP':
        case 'setTimeByIP':
        case 'disableWebRtc':
        case 'disableFingerprint':
        case 'disableServerDNS':
        case 'customUserAgent':
        case 'autoProxyOnBoot':
        default:
            console.log('Default Action')
    }
    cBack()
}
// module.exports = SayHi
