const apiKey = '0ZGR38BJTLXE7527'; // Substitua pela sua chave da Alpha Vantage

// Alternância de tema claro/escuro
const chk = document.getElementById('chk');
chk.addEventListener('change', () => {
    document.body.classList.toggle('dark');
});

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
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
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
function fetchDataApi(period, company, metric) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_${period}&symbol=${company}&apikey=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const timeSeries = data[`Time Series (${period})`];
            if (!timeSeries) {
                console.error('Nenhum dado disponível');
                return;
            }
            const labels = Object.keys(timeSeries).reverse();
            const dataPoints = labels.map(label => parseFloat(timeSeries[label][metric === 'price' ? '4. close' : '5. volume']));
            updateChart(metric === 'price' ? lineChart : barChart, labels, dataPoints);
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
}

// Função para atualizar os gráficos com novos dados
function updateChart(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

// Função para atualizar os dados com valores aleatórios
function updateRandomData(chart) {
    const randomData = Array.from({ length: chart.data.labels.length }, () => Math.floor(Math.random() * 100));
    updateChart(chart, chart.data.labels, randomData);
}

// Função para carregar dados do arquivo JSON ou CSV
function loadFileData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const contents = e.target.result;
        try {
            const data = JSON.parse(contents);
            const labels = Object.keys(data);
            const values = Object.values(data);
            updateChart(lineChart, labels, values);
        } catch (err) {
            console.error('Erro ao ler o arquivo:', err);
        }
    };
    reader.readAsText(file);
}

// Event listeners
document.getElementById('fetchDataBtn').addEventListener('click', () => {
    const period = document.getElementById('periodSelect').value;
    const company = document.getElementById('company').value;
    const metric = document.getElementById('metric').value;
    fetchDataApi(period, company, metric);
});

document.getElementById('updateRandomDataBtn').addEventListener('click', () => {
    updateRandomData(lineChart);
    updateRandomData(barChart);
});

document.getElementById('fileInput').addEventListener('change', loadFileData);
