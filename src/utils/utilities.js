//custom time picker with 24 hr and 55 min (5 min each)
const customTimePicker = (hourSelectEl, minuteSelectEl) => {
    for (var i = 0; i < 24; i++) {
        var opt = document.createElement('option');
        if (i < 10) {
            opt.value = '0' + i;
            opt.innerHTML = '0' + i;
        }
        else {
            opt.value = i;
            opt.innerHTML = i;
        }
        hourSelectEl.appendChild(opt);
    }
    for (var i = 0; i < 12; i++) {
        var opt = document.createElement('option');
        if (i * 5 < 10) {
            opt.value = '0' + (i * 5);
            opt.innerHTML = '0' + (i * 5);
        }
        else {
            opt.value = (i * 5);
            opt.innerHTML = (i * 5);
        }
        minuteSelectEl.appendChild(opt);
    }
}

//calculate different datetime with current datetime in min
const calTime = (d, h, m) => {
    var date1 = new Date(d + ` ${h}:${m}:00`);
    var date2 = new Date();
    var difDate = date1.getTime() - date2.getTime();
    return Math.round(difDate / (1000 * 60));
};

//convert date time format
const convertDateFormat = (date) =>{
    var d = new Date(date);
    var strArray = d.toString().split(" ").slice(0, 4)
    return `${strArray[0]} ${strArray[2]} ${strArray[1]} ${strArray[3]}`
}

//calculate the code color for each task by its different time from current time
const colorScale = (perc) => {
    var r, g, b = 0;
    if (perc < 50) {
        r = 255;
        g = Math.round(5.1 * perc);
    } else {
        g = 255;
        r = Math.round(510 - 5.1 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return "#" + ("000000" + h.toString(16)).slice(-6);
};

export {customTimePicker, calTime, colorScale, convertDateFormat}