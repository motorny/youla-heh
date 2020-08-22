console.log("init for inst")

function updateCharts(data) {
    if (!document.yoloco_chart) {
        alert('missing chart');
        return;
    }

    chartData = [data.postitiveRate, 1.0 - data.postitiveRate]

    document.yoloco_chart.data.datasets.forEach((dataset) => {
        dataset.data = chartData
    });
    document.yoloco_chart.update();
}


function injectCanvas() {
    var ctx = $('#yolocoChart');
    if ($('#yolocoChart').length) {
        console.log('already exists');
        return;
    }

    setTimeout(() => {
        var type, key;
        var curPath = window.location.pathname;
        var parts = curPath.split('/')
        var ID;
        if (parts.length > 2)
            ID = parts[1];
        if (ID === 'p')
        {
            ID = parts[2];
            type = '/p/stats';
            key = 'post_id';
        } else
        {
            type = '/stats';
            key = 'profile_id';
        }
        console.log('Type',type);
        console.log('ID', ID);

        var xhr = new XMLHttpRequest();
        var url = "https://194-67-110-28.cloudvps.regruhosting.ru/inst" + type;
        xhr.open("POST", url, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                data = xhr.response;
                console.log('data recieved', data);
                updateCharts(data);
            }
        };

        var data = JSON.stringify({
            [key]: ID
        });
        xhr.send(data);
    }, 1000);

    var checkExist = setInterval(function () {
        if (!$('#yolocoChart').length) {
            var header = $("main header");
            console.log('this is hdader', header)
            var canvas = $("<canvas id=\"yolocoChart\" width=\"935\" height=\"350\"></canvas>")
            header.after(canvas);
        } else {
            clearInterval(checkExist);
            populateChart($('#yolocoChart'))
        }
    }, 100);
}

function populateChart(context) {
    console.log('populating');
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
    });
    document.yoloco_chart = myChart;
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'url_updated') {
        const {url} = request;
        console.log('recieved url_updated')
        injectCanvas();
    }
});

injectCanvas();

chrome.storage.sync.get('grapghEnabled', function (data) {
    console.log(data.grapghEnabled)
});

