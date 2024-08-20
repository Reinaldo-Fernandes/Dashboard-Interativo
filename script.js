const apiKey = '0ZGR38BJTLXE7527'; // Substitua pela sua chave da Alpha Vantage
const symbol = 'IBM'; // Símbolo da empresa que você deseja acompanhar

// Configuração inicial dos gráficos
const ctxLine = document.getElementById('lineChart').getContext('2d');
const ctxBar = document.getElementById('barChart').getContext('2d');

let lineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Variação de Preço',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            fill: true,
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

let barChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Volume de Negociações',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Função para buscar dados da API
function fetchData(period) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_${period.toUpperCase()}&symbol=${symbol}&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const timeSeries = data[`Time Series (${period.toUpperCase()})`];
            const labels = Object.keys(timeSeries).reverse();
            const prices = labels.map(label => parseFloat(timeSeries[label]['4. close']));
            const volumes = labels.map(label => parseInt(timeSeries[label]['5. volume'], 10));

            updateChart(lineChart, labels, prices);
            updateChart(barChart, labels, volumes);
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
}

// Função para atualizar os gráficos com novos dados
function updateChart(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

// Atualizar gráficos ao clicar no botão "Buscar Dados"
document.getElementById('fetchData').addEventListener('click', () => {
    const period = document.getElementById('period').value;
    let periodText = '';

    switch (period) {
        case '1m':
            periodText = 'DAILY';
            break;
        case '3m':
            periodText = 'DAILY';
            break;
        case '6m':
            periodText = 'DAILY';
            break;
        case '1y':
            periodText = 'WEEKLY';
            break;
    }

    fetchData(periodText);
});

// Atualizar dados aleatórios ao clicar no botão "Atualizar Dados"
document.getElementById('updateData').addEventListener('click', () => {
    const randomData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 100));
    updateChartData(lineChart, randomData);
    updateChartData(barChart, randomData);
});

// Função para atualizar os dados aleatórios
function updateChartData(chart, data) {
    chart.data.datasets[0].data = data;
    chart.update();
}

document.getElementById('fetchData').addEventListener('click', () => {
    const period = document.getElementById('period').value;
    const company = document.getElementById('company').value;
    const metric = document.getElementById('metric').value;

    let periodText = '';
    switch (period) {
        case '1m':
            periodText = 'DAILY';
            break;
        case '3m':
            periodText = 'DAILY';
            break;
        case '6m':
            periodText = 'DAILY';
            break;
        case '1y':
            periodText = 'WEEKLY';
            break;
    }

    fetchData(periodText, company, metric);
});

function fetchData(period, company, metric) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_${period.toUpperCase()}&symbol=${company}&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const timeSeries = data[`Time Series (${period.toUpperCase()})`];
            const labels = Object.keys(timeSeries).reverse();
            const dataPoints = labels.map(label => parseFloat(timeSeries[label][metric === 'price' ? '4. close' : '5. volume']));

            updateChart(metric === 'price' ? lineChart : barChart, labels, dataPoints);
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
}
