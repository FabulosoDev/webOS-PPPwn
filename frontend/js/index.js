var deviceInfo;
webOS.deviceInfo(function (info) {
    deviceInfo = info;
});

function Init() {
    webOS.fetchAppInfo(function (info) {
        if (info) {
            document.getElementById("appVersion").innerHTML = info.version;
        } else {
            console.error('Error occurs while getting appinfo.json.');
        }
    });
}
