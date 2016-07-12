function formatDate(epochTime) {
    date = new Date(epochTime * 1000);
    var year = date.getFullYear(),
    month = date.getMonth() + 1, // months are zero indexed
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds(),
    hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
    minuteFormatted = minute < 10 ? "0" + minute : minute,
    morning = hour < 12 ? "am" : "pm";

    return month + "/" + day + "/" + year + " " + hourFormatted + ":" +
            minuteFormatted + morning;
}

function calcDuration(seconds) {
    var val;
    var text;
    if (seconds < 60) {
        val = seconds;
        text = "seconds";
    }
    else if (seconds < 60 * 60) {
        val = Math.round(seconds) / 60;
        text = "minutes";
    }
    else if (seconds < 60 * 60 * 24) {
        val = Math.round(seconds) / 60 / 60;
        text = "hours";
    }
    else if (seconds < 60 * 60 * 24 * 7) {
        val = Math.round(seconds) / 60 / 60 / 24
        text = "days";
    }
    else {
        val = Math.round(seconds) / 60 / 60 / 24 / 7;
        text = "weeks";
    }

    if (val == 1)
        text = text.substring(0, text.length-1);

    return val + " " + text;
}

function getPrimaryAccount() {
    if (primaryaccount == null || primaryaccount == "")
        return web3.eth.accounts[0];
    else
        return primaryaccount;
}

function getParentDAOs() {
    var parentDAOs = []
    var targetdao = daoaddress;
    while (true) {
        var parentDAO = web3.toAscii(web3.eth.getStorageAt(targetdao, 1));
        if (parentDAO == null && parentDAO != "")
            parentDAOs.push(parentDAO);
        else
            break;
    }
    return parentDAOs;
}