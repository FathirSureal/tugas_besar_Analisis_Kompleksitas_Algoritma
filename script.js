let data = [];

let recursiveTimes = [];
let iterativeTimes = [];
let inputSizes = [];

let chart = null;

function generateData() {
    const n = parseInt(document.getElementById("inputSize").value);
    data = [];

    for (let i = 0; i < n; i++) {
        data.push(Math.floor(Math.random() * 50000));
    }

    document.getElementById("resultBox").innerHTML =
        "Generated " + n + " data random";

    runBoth();
}

function runRecursive() {
    let arr = [...data];

    let start = performance.now();
    mergeSortRecursive(arr);
    let end = performance.now();

    return end - start;
}

function runIterative() {
    let arr = [...data];

    let start = performance.now();
    mergeSortIterative(arr);
    let end = performance.now();

    return end - start;
}

function runBoth() {
    let n = data.length;
    let tRec = runRecursive();
    let tIter = runIterative();

    inputSizes.push(n);
    recursiveTimes.push(tRec);
    iterativeTimes.push(tIter);

    sortGraphData();

    updateChart();

    document.getElementById("resultBox").innerHTML =
        `Size: ${n}<br>Recursive: ${tRec.toFixed(4)} ms<br>Iterative: ${tIter.toFixed(4)} ms`;
}

function sortGraphData() {
    let combined = inputSizes.map((size, i) => ({
        size,
        rec: recursiveTimes[i],
        iter: iterativeTimes[i]
    }));

    combined.sort((a, b) => a.size - b.size);

    inputSizes = combined.map(x => x.size);
    recursiveTimes = combined.map(x => x.rec);
    iterativeTimes = combined.map(x => x.iter);
}

function updateChart() {
    let ctx = document.getElementById("timeChart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: inputSizes,
            datasets: [
                {
                    label: 'Recursive (ms)',
                    data: recursiveTimes,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255,0,0,0.3)',
                    borderWidth: 2
                },
                {
                    label: 'Iterative (ms)',
                    data: iterativeTimes,
                    borderColor: 'cyan',
                    backgroundColor: 'rgba(0,255,255,0.3)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                legend: { labels: { color: '#fff' } }
            }
        }
    });
}
