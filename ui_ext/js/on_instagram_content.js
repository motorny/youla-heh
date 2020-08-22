console.log("init for inst")


function injectCanvas() {
    var ctx = $('#yolocoChart');
    if ($('#yolocoChart').length) {
        console.log('already exists');
        return;
    }

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
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'url_updated') {
        const {url} = request;
        console.log('recieved url_updated')
        injectCanvas();
    }
});

injectCanvas();
