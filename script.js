const API_URL = "http://localhost:8080/sort";

let chartInstance = null;
let hasilEksperimen = [];

// ===============================
// FUNGSI UTAMA & SLIDER
// ===============================
function updateSliderValue(val) {
    document.getElementById("nValue").innerText = parseInt(val).toLocaleString('id-ID');
}

async function tambahDataKeGrafik() {
    const sliderVal = document.getElementById("inputSlider").value;
    const caseType = document.getElementById("dataCase").value; // Ambil nilai Dropdown
    const n = parseInt(sliderVal);
    const status = document.getElementById("status");
    const btn = document.querySelector(".primary-btn");

    // --- PERBAIKAN DI SINI ---
    // Sekarang kita cek: Apakah N DAN Case-nya sama persis?
    // Kalau N sama tapi Case beda (misal Average vs Worst), boleh masuk.
    const sudahAda = hasilEksperimen.some(data => data.n === n && data.case === caseType);
    
    if (sudahAda) {
        status.innerHTML = `<span style="color:#ef4444; font-weight:bold;">
            <i class="fa-solid fa-circle-exclamation"></i> Data n=${n} untuk ${caseType} sudah ada!
        </span>`;
        return;
    }
    // -------------------------

    status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Memproses n = ${n}...`;
    btn.disabled = true;
    btn.style.opacity = "0.7";

    try {
        // REQUEST KE BACKEND
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: n.toString() 
        });

        if (!res.ok) throw new Error("Server error");
        const data = await res.json();

        // KONVERSI KE MS (Bagi 1000)
        const rekursifMs = parseFloat(data.rekursif) / 1000;
        const iteratifMs = parseFloat(data.iteratif) / 1000;

        // SIMPAN DATA
        hasilEksperimen.push({
            n: n,
            case: caseType,
            rekursif: rekursifMs,
            iteratif: iteratifMs
        });

        // Urutkan data berdasarkan N agar grafik rapi
        hasilEksperimen.sort((a, b) => a.n - b.n);

        updateTabel();
        renderChart();
        
        status.innerHTML = `<i class="fa-solid fa-check"></i> Data berhasil ditambahkan.`;

    } catch (err) {
        console.error(err);
        status.innerText = "❌ Gagal terhubung ke backend";
    } finally {
        btn.disabled = false;
        btn.style.opacity = "1";
    }
}
// ===============================
// UPDATE TABEL (DENGAN ANALISIS)
// ===============================
function updateTabel() {
    const tabel = document.getElementById("tabelHasil");
    tabel.innerHTML = "";

    hasilEksperimen.forEach(item => {
        const row = document.createElement("tr");
        
        // Logika Hitung Persentase
        const rec = item.rekursif;
        const iter = item.iteratif;
        const isRecWin = rec < iter;
        
        const slowest = Math.max(rec, iter);
        const fastest = Math.min(rec, iter);
        let percent = 0;
        if(slowest > 0) percent = ((slowest - fastest) / slowest) * 100;

        const winnerHTML = isRecWin 
            ? `<span class="faster-tag">Rekursif</span> <span class="diff-text">(${percent.toFixed(2)}% lebih cepat)</span>`
            : `<span class="faster-tag" style="color:#ec4899; background:#fdf2f8;">Iteratif</span> <span class="diff-text">(${percent.toFixed(2)}% lebih cepat)</span>`;

        // Format Label Case
        let labelColor = "gray";
        if(item.case.includes("Worst")) labelColor = "#ef4444";
        if(item.case.includes("Best")) labelColor = "#10b981";

        row.innerHTML = `
            <td style="color:${labelColor}; font-weight:600; font-size:0.8rem;">${item.case}</td>
            <td style="font-weight:600">${item.n}</td>
            <td style="${isRecWin ? 'color:#4f46e5;font-weight:bold' : ''}">${rec.toFixed(4)}</td>
            <td style="${!isRecWin ? 'color:#ec4899;font-weight:bold' : ''}">${iter.toFixed(4)}</td>
            <td>${winnerHTML}</td>
        `;
        tabel.appendChild(row);
    });
}

function resetData() {
    hasilEksperimen = [];
    document.getElementById("tabelHasil").innerHTML = '<tr><td colspan="5" class="empty-state">Data direset. Silakan geser & tambah lagi.</td></tr>';
    renderChart();
    document.getElementById("status").innerText = "Siap menunggu perintah...";
}

// ===============================
// VISUALISASI CHART
// ===============================
function renderChart() {
    const ctx = document.getElementById("performanceChart").getContext('2d');
    if (chartInstance) chartInstance.destroy();

    const gradientRec = ctx.createLinearGradient(0, 0, 0, 400);
    gradientRec.addColorStop(0, 'rgba(79, 70, 229, 0.5)');
    gradientRec.addColorStop(1, 'rgba(79, 70, 229, 0.0)');

    const gradientIter = ctx.createLinearGradient(0, 0, 0, 400);
    gradientIter.addColorStop(0, 'rgba(236, 72, 153, 0.5)');
    gradientIter.addColorStop(1, 'rgba(236, 72, 153, 0.0)');

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: hasilEksperimen.map(d => d.n),
            datasets: [
                {
                    label: "Rekursif (ms)", // Label diubah ke ms
                    data: hasilEksperimen.map(d => d.rekursif),
                    borderColor: "#4f46e5",
                    backgroundColor: gradientRec,
                    borderWidth: 3,
                    pointBackgroundColor: "#fff",
                    pointBorderColor: "#4f46e5",
                    fill: true,
                    tension: 0.4
                },
                {
                    label: "Iteratif (ms)", // Label diubah ke ms
                    data: hasilEksperimen.map(d => d.iteratif),
                    borderColor: "#ec4899",
                    backgroundColor: gradientIter,
                    borderWidth: 3,
                    pointBackgroundColor: "#fff",
                    pointBorderColor: "#ec4899",
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: "top", labels: { usePointStyle: true, font: { family: "'Poppins', sans-serif" } } },
                tooltip: { 
                    backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ": " + context.parsed.y.toFixed(4) + " ms";
                        }
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, title: { display: true, text: "Jumlah Data (n)" } },
                y: { border: { dash: [4, 4] }, title: { display: true, text: "Waktu Eksekusi (ms)" } }
            }
        }
    });
}

// ===============================
// NAVIGASI & KESIMPULAN
// ===============================
function switchTab(tabName) {
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if(tabName === 'dashboard') {
        buttons[0].classList.add('active');
        document.getElementById('view-dashboard').classList.remove('hidden');
        document.getElementById('view-conclusion').classList.add('hidden');
    } else {
        buttons[1].classList.add('active');
        document.getElementById('view-dashboard').classList.add('hidden');
        document.getElementById('view-conclusion').classList.remove('hidden');
        generateConclusion();
    }
}

function generateConclusion() {
    const contentDiv = document.getElementById('analysis-content');
    const recPanel = document.getElementById('recommendation-content');
    
    // Reset Counters
    let winRec = 0; let winIter = 0;
    hasilEksperimen.forEach(d => d.rekursif < d.iteratif ? winRec++ : winIter++);

    document.getElementById('score-rekursif').innerText = winRec;
    document.getElementById('score-iteratif').innerText = winIter;
    document.getElementById('total-experiment').innerText = hasilEksperimen.length;

    if (hasilEksperimen.length === 0) {
        contentDiv.innerHTML = '<p class="placeholder-text">Belum ada data.</p>';
        return;
    }

    // 1. BUAT REKOMENDASI
    let recTitle = "";
    let recDesc = "";
    const maxN = Math.max(...hasilEksperimen.map(d => d.n));

    if (maxN > 50000) {
        recTitle = "Sangat Disarankan: Merge Sort Iteratif";
        recDesc = "Anda menguji data dalam jumlah sangat besar. Iteratif lebih aman untuk menghindari <strong>Stack Overflow</strong> yang rentan terjadi pada Rekursif saat n > 50.000.";
    } else if (winIter >= winRec) {
        recTitle = "Rekomendasi: Merge Sort Iteratif";
        recDesc = "Berdasarkan hasil uji coba Anda, Iteratif lebih unggul atau setara dalam kecepatan. Mengingat kompleksitas ruang (Space Complexity) O(n) yang lebih efisien tanpa stack frame, ini adalah pilihan solid.";
    } else {
        recTitle = "Rekomendasi: Merge Sort Rekursif (Kondisional)";
        recDesc = "Pada environment ini, Rekursif berjalan lebih cepat. Jika kode yang mudah dibaca (Clean Code) adalah prioritas dan data tidak ekstrem besar, Rekursif bisa dipilih.";
    }

    recPanel.innerHTML = `
        <div class="rec-title">💡 ${recTitle}</div>
        <div class="rec-desc">${recDesc}</div>
    `;

    // 2. BUAT DETAIL ANALISIS
    contentDiv.innerHTML = `
        <div class="conclusion-block">
            <p>Dari total <strong>${hasilEksperimen.length} percobaan</strong>, algoritma <strong>Iteratif</strong> menang ${winIter} kali dan <strong>Rekursif</strong> menang ${winRec} kali.</p>
            <p style="margin-top:10px;">Pengujian dilakukan pada rentang data n = ${Math.min(...hasilEksperimen.map(d=>d.n))} hingga ${maxN}.</p>
        </div>
    `;
}

// Export CSV Listener
document.getElementById("exportCsvBtn").addEventListener("click", () => {
    if (hasilEksperimen.length === 0) { alert("Belum ada data!"); return; }
    
    let csv = "Case,Jumlah Data,Waktu Rekursif (ms),Waktu Iteratif (ms)\n";
    hasilEksperimen.forEach(d => { 
        csv += `${d.case},${d.n},${d.rekursif.toFixed(4)},${d.iteratif.toFixed(4)}\n`; 
    });
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "hasil_eksperimen.csv"; a.click(); URL.revokeObjectURL(url);
});