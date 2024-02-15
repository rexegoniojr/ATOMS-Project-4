export const calculateFileSize = (size) => {
    if (size) {
        if (size < 1024) return size + ' B'
        let i = Math.floor(Math.log(size) / Math.log(1024))
        let num = (size / Math.pow(1024, i))
        let round = Math.round(num)
        num = round < 10 ? num.toFixed(2) : round < 100 ? num.toFixed(1) : round
        return `${num} ${'KMGTPEZY'[i - 1]}B`
    }
}

export const mmddyy = (date) => {
    if (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, day, year].join('-');
    }
}

export const convertTime = (time) => {
    if (time) {
        var ts = time;
        var H = +ts.substr(0, 2);
        var h = (H % 12) || 12;
        h = (h < 10) ? ("0" + h) : h;
        var ampm = H < 12 ? " AM" : " PM";
        ts = h + ts.substr(2, 3) + ampm;
        return ts;
    }
}