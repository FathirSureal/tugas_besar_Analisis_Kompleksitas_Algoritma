let chart;

function jalankanUji() {
    const input = document.getElementById("inputN").value;
    const ukuran = input.split(",").map(x => parseInt(x.trim()));
    const tabel = document.getElementById("tabelHasil");
    const status = document.getElementById("status");

    tabel.innerHTML = "";
    status.textContent = "Menjalankan eksperimen...";

    const labels = [];
    const rek = [];
    const iter = [];

    let idx = 0;

    function next() {
        if (idx >= ukuran.length) {
            status.textContent = "Eksperimen selesai.";
            tampilkanGrafik(labels, rek, iter);
            return;
        }

        const n = ukuran[idx];
        status.textContent = `Memproses n = ${n}`;

        fetch("http://localhost:8080/sort", {
            method: "POST",
            body: n
        })
        .then(res => res.json())
        .then(data => {
            labels.push(n);
            rek.push(data.rekursif);
            iter.push(data.iteratif);

            tabel.innerHTML += `
                <tr>
                    <td>${n}</td>
                    <td>${data.rekursif}</td>
                    <td>${data.iteratif}</td>
                </tr>
            `;

            idx++;
            next();
        })
        .catch(() => {
            status.textContent = "Tidak dapat terhubung ke server.";
        });
    }

    next();
}

function tampilkanGrafik(labels, rek, iter) {
    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("chart"), {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Merge Sort Rekursif",
                    data: rek,
                    tension: 0.3,
                    borderWidth: 2
                },
                {
                    label: "Merge Sort Iteratif",
                    data: iter,
                    tension: 0.3,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" }
            },
            scales: {
                x: {
                    title: { display: true, text: "Jumlah Data (n)" }
                },
                y: {
                    title: { display: true, text: "Waktu Eksekusi (µs)" }
                }
            }
        }
    });
}
