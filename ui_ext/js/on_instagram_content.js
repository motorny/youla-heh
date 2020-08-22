console.log("init for inst")

function updatePostCharts(data) {
    if (!document.yolocoPostChart) {
        alert('missing chart');
        return;
    }
    console.log('Updating post chart with data:', data);

    chartData = [data.posCnt, data.negCnt, data.spamCnt]

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

    var chartMonthlyData = data.monthly_dynamic

    document.yolocoProfileChart.data.datasets.forEach((dataset) => {
        dataset.data = chartMonthlyData
    });
    document.yolocoProfileChart.update();

    var chartTop = data.top_profile_analysis;
    console.log(chartTop);

    document.yolocoProfileChart2.data.datasets[0].data = chartTop.total
    document.yolocoProfileChart2.data.datasets[1].data = chartTop.posCnt
    document.yolocoProfileChart2.data.datasets[2].data = chartTop.negCnt
    document.yolocoProfileChart2.data.datasets[2].data = chartTop.spamCnt
    document.yolocoProfileChart2.update();

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
            var container = $("<div class=\"chart-container\" style=\"position: relative;  height: 150px\">")
            var canvas = $("<canvas id=\"yolocoProfileChart\"></canvas>")
            var container2 = $("<div class=\"chart-container\" style=\"position: relative;  height: 250px\">")
            var canvas2 = $("<canvas id=\"yolocoProfileChart2\"></canvas>")
            header.after(container2);
            container2.append(canvas2);
            header.after(container);
            container.append(canvas);
        } else {
            clearInterval(checkExist);
            populateProfileChart($('#yolocoProfileChart'), $('#yolocoProfileChart2'))
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
            var container = $("<div class=\"chart-container\" style=\"position: relative; margin-right:335px\">")
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

Array.prototype.rotate = function (n) {
    while (this.length && n < 0) n += this.length;
    this.push.apply(this, this.splice(0, n));
    return this;
}

function populateProfileChart(context, context2) {
    console.log('drawing on profile canvas');
    var cd = new Date();
    var monthi = cd.getMonth();
    var myChart = new Chart(context, {
        type: 'bar',
        data: {
            labels: monhtsArr.rotate(11-monthi),
            datasets: [{
                label: 'Количество постов',
                data: [],
                backgroundColor: 'rgba(207,34,219,0.38)',
                borderColor: 'rgb(207,34,219)',

            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    var topCharts = new Chart(context2, {
        type: 'line',
        data: {
            labels: [1,2,3,4,5],
            datasets: [{
                label: 'Общее количество',
                data: [],
                backgroundColor: 'rgba(73,219,209,0.51)',
                borderColor: 'rgb(0,201,185)',

            },
            {
                label: 'Позитивные',
                data: [],
                backgroundColor: 'rgba(40,219,34,0.38)',
                borderColor: 'rgb(0,189,9)',

            },
            {
                label: 'Негативные',
                data: [],
                backgroundColor: 'rgba(219,71,34,0.65)',
                borderColor: 'rgb(217,12,53)',

            },
            {
                label: 'Спам',
                data: [],
                backgroundColor: 'rgba(245,220,51,0.65)',
                borderColor: 'rgb(231,223,0)',

            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });


    document.yolocoProfileChart = myChart;
    document.yolocoProfileChart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });

    document.yolocoProfileChart2 = topCharts;
    document.yolocoProfileChart2.data.datasets.forEach((dataset) => {
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
            labels: ['Позитивные', 'Негативные', 'Спам'],
            datasets: [{
                label: 'Количество комментариев',
                data: [],
                backgroundColor:
                    [
                        'rgba(5,250,25,0.39)',
                        'rgba(250,54,5,0.42)',
                        'rgba(250,226,5,0.38)',
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

