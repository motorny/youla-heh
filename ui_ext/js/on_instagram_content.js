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


function injectCanvas() {
    var ctx = $('#yolocoChart');
    var type, key;
    var curPath = window.location.pathname;
    var parts = curPath.split('/')
    var ID;
    if ($('#yolocoChart').length) {
        console.log('already exists');
        return;
    }

    if (parts.length > 2) {
        ID = parts[1];
    } else {
        return;
    }


    if (ID === 'p') {
        ID = parts[2];
        type = '/p/stats';
        key = 'post_id';
    } else {
        type = '/stats';
        key = 'profile_id';
    }


    setTimeout(() => {
        console.log('Type', type);
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
                updateCharts(type, data);
            }
        };

        var data = JSON.stringify({
            [key]: ID
        });
        xhr.send(data);
    }, 1000);

    var checkExist = setInterval(function () {
        if (!$('#yolocoChart').length) {
            var header = $("header.UE9AK");
            console.log('this is hdader', header)
            var canvas = $("<canvas id=\"yolocoChart\" width=\"935\" height=\"350\"></canvas>")
            header.after(canvas);
        } else {
            clearInterval(checkExist);
            populateChart($('#yolocoChart'))
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
            var container  = $("<div class=\"chart-container\" style=\"position: relative; width:600px; height=360px\">")
            var canvas = $("<canvas id=\"yolocoPostChart\"></canvas>")
            header.parent().append(container);
            container.append(canvas)
        } else {
            clearInterval(checkExist);
            populateChart($('#yolocoPostChart'))
        }
    }, 100);
}


function populateChart(context) {
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
            responsive:true,
            maintainAspectRatio:true
        }
    });
    document.yolocoPostChart = myChart;
        document.yolocoPostChart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });

    console.log('Sending request for profile')
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
    }
});

// injectCanvas();

chrome.storage.sync.get('grapghEnabled', function (data) {
    console.log(data.grapghEnabled)
});

