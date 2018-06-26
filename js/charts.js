var ctxB = document.getElementById("barChart").getContext('2d');
var ctxB2 = document.getElementById("barChart2").getContext('2d');
var ctxB3 = document.getElementById("barChart3").getContext('2d');
fetch('http://localhost:8080/chart1')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    var myBarChart = new Chart(ctxB, {
        type: 'bar',
        data: {
            labels: myJson.contracts,
            datasets: [{
                label: 'RON Value',
                data: myJson.values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
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
            title: {
                display: true,
                text: 'The most valuable contracts'
                },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
  });

fetch('http://localhost:8080/chart2')
.then(function(response) {
    return response.json();
})
.then(function(myJson) {
var myBarChart = new Chart(ctxB2, {
    type: 'bar',
    data: {
        labels: myJson.years,
        datasets: [{
            label: 'Number of contracts',
            data: myJson.counts,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
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
        title: {
            display: true,
            text: 'Concluded contracts per year'
            },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
});

fetch('http://localhost:8080/chart3')
.then(function(response) {
    return response.json();
})
.then(function(myJson) {
var myBarChart = new Chart(ctxB3, {
    type: 'bar',
    data: {
        labels: myJson.partners,
        datasets: [{
            label: 'Number of years',
            data: myJson.durations,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
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
        title: {
            display: true,
            text: 'Long-term contracts'
            },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
});