console.log("init for inst")

function updatePostCharts(data) {
    if (!document.yolocoPostChart) {
        alert('missing chart');
        return;
    }
    console.log('Updating post chart with data:', data);

    chartData = [data.posCnt, data.negCnt]

    document.yolocoPostChart.data.datasets.forEach((dataset) => {
        dataset.data = chartData
    });
    document.yolocoPostChart.update();
}

function updateProfileCharts(data) {
    if (!document.yolocoProfileChart) {
        alert('missing chart');
        return;
    }
    console.log('Updating post chart with data:', data);

    chartData = data.monthly_dynamic

    document.yolocoProfileChart.data.datasets.forEach((dataset) => {
        dataset.data = chartData
    });
    document.yolocoProfileChart.update();
}


function injectProfileCanvas() {
    if ($('#yolocoProfileChart').length) {
        console.log('already exists');
        return;
    }

    var curPath = window.location.pathname;
    var parts = curPath.split('/')
    var ID;

    if (parts.length > 2) {
        ID = parts[1];
    } else {
        // not a post or a profile
        return;
    }
    if (ID === 'p') {
        // this is post
        return;
    }


    var checkExist = setInterval(function () {
        if (!$('#yolocoProfileChart').length) {
            var header = $("header.vtbgv");
            var container = $("<div class=\"chart-container\" style=\"position: relative;  height=500px\">")
            var canvas = $("<canvas id=\"yolocoProfileChart\"></canvas>")
            header.after(container);
            container.append(canvas)
        } else {
            clearInterval(checkExist);
            populateProfileChart($('#yolocoProfileChart'))
        }
    }, 100);
}


function injectPostCanvas() {
    if ($('#yolocoChart').length) {
        console.log('already exists');
        return;
    }

    var curPath = window.location.pathname;
    var parts = curPath.split('/')
    var ID;

    if (parts.length > 2) {
        ID = parts[1];
    } else {
        // not a post or a profile
        return;
    }
    if (ID === 'p') {
        ID = parts[2];
    } else {
        // not a post
        return;
    }


    var checkExist = setInterval(function () {
        if (!$('#yolocoPostChart').length) {
            var header = $("header.UE9AK");
            var container = $("<div class=\"chart-container\" style=\"position: relative; width:600px; height=360px\">")
            var canvas = $("<canvas id=\"yolocoPostChart\"></canvas>")
            header.parent().append(container);
            container.append(canvas)
        } else {
            clearInterval(checkExist);
            populatePostChart($('#yolocoPostChart'))
        }
    }, 100);
}


var monhtsArr = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
];

Array.prototype.rotate = function(n) {
    while (this.length && n < 0) n += this.length;
    this.push.apply(this, this.splice(0, n));
    return this;
}

function populateProfileChart(context) {
    console.log('drawing on profile canvas');
    var cd = new Date();
    var monthi = cd.getMonth();
    var myChart = new Chart(context, {
        type: 'line',
        data: {
            labels: monhtsArr.rotate(monthi + 1),
            datasets: [{
                label: 'Количество постов',
                data: [],
                backgroundColor: 'rgba(207,34,219,0.38)',
                borderColor: 'rgb(207,34,219)',

            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
    document.yolocoProfileChart = myChart;
    document.yolocoProfileChart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });

    console.log('Sending request for profile')
    var curPath = window.location.pathname;
    var parts = curPath.split('/')
    var ID = parts[1];
    console.log("Id:", ID);

    var xhr = new XMLHttpRequest();
    var url = "https://194-67-110-28.cloudvps.regruhosting.ru/inst/stats";
    xhr.open("POST", url, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            data = xhr.response;
            console.log('data recieved', data);
            updateProfileCharts(data);
        }
    };

    var data = JSON.stringify({
        "profile_id": ID
    });
    xhr.send(data);
}


function populatePostChart(context) {
    console.log('drawing on canvas');
    var myChart = new Chart(context, {
        type: 'doughnut',
        data: {
            labels: ['Позитивные', 'Негативные'],
            datasets: [{
                label: 'Количество комментариев',
                data: [],
                backgroundColor:
                    [
                        'rgb(5,250,25)',
                        'rgb(250,119,5)',
                    ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
    document.yolocoPostChart = myChart;
    document.yolocoPostChart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });

    console.log('Sending request for post')
    var curPath = window.location.pathname;
    var parts = curPath.split('/')
    var ID = parts[2];
    console.log("Id:", ID);

    var xhr = new XMLHttpRequest();
    var url = "https://194-67-110-28.cloudvps.regruhosting.ru/inst/p/stats";
    xhr.open("POST", url, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            data = xhr.response;
            console.log('data recieved', data);
            updatePostCharts(data);
        }
    };

    var data = JSON.stringify({
        "post_id": ID
    });
    xhr.send(data);

}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request)
    if (request.message === 'url_updated') {
        const {url} = request;
        console.log('UPDATE')
        // injectCanvas();
    } else if (request.message === 'enableStats') {
        injectPostCanvas();
        injectProfileCanvas();
    }
});

chrome.storage.sync.get('grapghEnabled', function (data) {
    console.log(data.grapghEnabled)
});

