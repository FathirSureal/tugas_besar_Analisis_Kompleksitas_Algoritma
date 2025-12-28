let data = [];
let recursiveTimes = [];
let iterativeTimes = [];
let inputSizes = [];

function generateData() {
    const n = parseInt(document.getElementById("inputSize").value);
    data = [];

    for (let i = 0; i < n; i++) data.push(Math.floor(Math.random() * 10000));

    document.getElementById("output").textContent = 
        "Generated " + n + " angka random.";
}

function runRecursive() {
    if (!data.length) return alert("Generate data dulu!");

    let arr = [...data];
    let start = performance.now();
    let sorted = mergeSortRecursive(arr);
    let end = performance.now();

    const time = (end - start).toFixed(4);
    document.getElementById("output").textContent = 
        "Recursive time: " + time + " ms";

    return time;
}

function runIterative() {
    if (!data.length) return alert("Generate data dulu!");

    let arr = [...data];
    let start = performance.now();
    let sorted = mergeSortIterative(arr);
    let end = performance.now();

    const time = (end - start).toFixed(4);
    document.getElementById("output").textContent = 
        "Iterative time: " + time + " ms";

    return time;
}

function runBoth() {
    let n = data.length;

    let r = runRecursive();
    let i = runIterative();

    inputSizes.push(n);
    recursiveTimes.push(r);
    iterativeTimes.push(i);

    drawChart();
}

function drawChart() {
    const ctx = document.getElementById("timeChart").getContext("2d");

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: inputSizes,
            datasets: [
                {
                    label: 'Recursive',
                    data: recursiveTimes,
                    borderColor: 'red',
                    borderWidth: 2
                },
                {
                    label: 'Iterative',
                    data: iterativeTimes,
                    borderColor: 'blue',
                    borderWidth: 2
                }
            ]
        },
        options: { 
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
