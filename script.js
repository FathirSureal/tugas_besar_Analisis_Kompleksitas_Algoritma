// ============================================
// MAIN APPLICATION - SORTING PAKET LOGISTIK
// ============================================

// Konfigurasi
const CONFIG = {
    maxPackages: 1000,
    algorithms: {
        'merge-iterative': { name: 'Merge Sort (Iteratif)', color: '#3498db' },
        'merge-recursive': { name: 'Merge Sort (Rekursif)', color: '#e74c3c' },
        'quick': { name: 'Quick Sort', color: '#27ae60' },
        'bubble': { name: 'Bubble Sort', color: '#f39c12' }
    }
};

// State aplikasi
let state = {
    packages: [],
    results: {},
    charts: {
        performance: null,
        complexity: null
    },
    testResults: []
};

// Data kota di Indonesia untuk asal & tujuan
const INDONESIAN_CITIES = [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
    'Makassar', 'Palembang', 'Denpasar', 'Yogyakarta', 'Malang',
    'Bekasi', 'Tangerang', 'Depok', 'Bogor', 'Surakarta',
    'Pontianak', 'Manado', 'Balikpapan', 'Samarinda', 'Padang'
];

const PACKAGE_TYPES = [
    { name: 'Dokumen', minWeight: 0.1, maxWeight: 1, color: '#3498db' },
    { name: 'Kecil', minWeight: 1, maxWeight: 5, color: '#27ae60' },
    { name: 'Sedang', minWeight: 5, maxWeight: 20, color: '#f39c12' },
    { name: 'Besar', minWeight: 20, maxWeight: 50, color: '#e74c3c' },
    { name: 'Sangat Besar', minWeight: 50, maxWeight: 100, color: '#9b59b6' }
];

const PACKAGE_NAMES = [
    'Paket Express', 'Kiriman Cepat', 'Logistik Prioritas',
    'Pengiriman Reguler', 'Kargo Berat', 'Dokumen Penting',
    'Barang Pecah Belah', 'Elektronik', 'Pakaian', 'Makanan',
    'Obat-obatan', 'Perhiasan', 'Buku', 'Alat Kantor', 'Sparepart'
];

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Setup event listeners
    setupEventListeners();
    
    // Setup charts
    setupCharts();
    
    // Load sample data
    setTimeout(() => {
        generatePackages(50);
    }, 500);
}

function setupEventListeners() {
    // Slider untuk jumlah paket
    const sizeSlider = document.getElementById('data-size');
    const sizeValue = document.getElementById('size-value');
    
    sizeSlider.addEventListener('input', function() {
        sizeValue.textContent = this.value;
    });
    
    // Tombol generate
    document.getElementById('generate-btn').addEventListener('click', function() {
        const size = parseInt(sizeSlider.value);
        generatePackages(size);
    });
    
    // Tombol sort
    document.getElementById('sort-btn').addEventListener('click', function() {
        runSorting();
    });
    
    // Tombol reset
    document.getElementById('reset-btn').addEventListener('click', function() {
        resetApplication();
    });
    
    // Tombol batch test
    document.getElementById('batch-test-btn').addEventListener('click', function() {
        runBatchTest();
    });
    
    // Tombol update chart
    document.getElementById('update-chart').addEventListener('click', function() {
        updateCharts();
    });
    
    // Tombol source code
    document.getElementById('source-code').addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://github.com/yourusername/logistics-sorting', '_blank');
    });
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('results-modal').style.display = 'none';
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('results-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// ============================================
// DATA GENERATION FUNCTIONS
// ============================================

function generatePackages(count) {
    showLoading(`Membuat ${count} data paket...`);
    
    state.packages = [];
    
    for (let i = 0; i < count; i++) {
        const packageType = PACKAGE_TYPES[Math.floor(Math.random() * PACKAGE_TYPES.length)];
        const weight = (Math.random() * (packageType.maxWeight - packageType.minWeight) + packageType.minWeight).toFixed(2);
        
        const packageData = {
            id: i + 1,
            name: `${PACKAGE_NAMES[Math.floor(Math.random() * PACKAGE_NAMES.length)]} #${String(i + 1).padStart(4, '0')}`,
            weight: parseFloat(weight),
            type: packageType.name,
            typeColor: packageType.color,
            priority: Math.floor(Math.random() * 5) + 1,
            origin: INDONESIAN_CITIES[Math.floor(Math.random() * INDONESIAN_CITIES.length)],
            destination: INDONESIAN_CITIES[Math.floor(Math.random() * INDONESIAN_CITIES.length)],
            distance: Math.floor(Math.random() * 990) + 10,
            estimatedTime: Math.floor(Math.random() * 71) + 1,
            status: ['pending', 'processing', 'delivered'][Math.floor(Math.random() * 3)],
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        };
        
        // Pastikan asal dan tujuan berbeda
        while (packageData.origin === packageData.destination) {
            packageData.destination = INDONESIAN_CITIES[Math.floor(Math.random() * INDONESIAN_CITIES.length)];
        }
        
                state.packages.push(packageData);
    }
    
    // Update UI
    updateDashboard();
    updatePackageTable();
    hideLoading();
    
    showNotification(`Berhasil membuat ${count} paket logistik!`, 'success');
}

// ============================================
// SORTING ALGORITHMS IMPLEMENTATION
// ============================================

// Merge Sort Iteratif
function mergeSortIterative(arr, key) {
    const n = arr.length;
    const sorted = [...arr];
    
    for (let size = 1; size < n; size *= 2) {
        for (let left = 0; left < n; left += 2 * size) {
            const mid = Math.min(left + size, n);
            const right = Math.min(left + 2 * size, n);
            
            // Merge
            let i = left, j = mid, k = 0;
            const temp = [];
            
            while (i < mid && j < right) {
                if (sorted[i][key] <= sorted[j][key]) {
                    temp.push(sorted[i++]);
                } else {
                    temp.push(sorted[j++]);
                }
            }
            
            while (i < mid) temp.push(sorted[i++]);
            while (j < right) temp.push(sorted[j++]);
            
            for (let m = 0; m < temp.length; m++) {
                sorted[left + m] = temp[m];
            }
        }
    }
    
    return sorted;
}

// Merge Sort Rekursif
function mergeSortRecursive(arr, key) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSortRecursive(arr.slice(0, mid), key);
    const right = mergeSortRecursive(arr.slice(mid), key);
    
    return merge(left, right, key);
}

function merge(left, right, key) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i][key] <= right[j][key]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
}

// Quick Sort
function quickSort(arr, key) {
    if (arr.length <= 1) return arr;
    
    const pivot = arr[Math.floor(arr.length / 2)][key];
    const left = [];
    const right = [];
    const equal = [];
    
    for (const item of arr) {
        if (item[key] < pivot) left.push(item);
        else if (item[key] > pivot) right.push(item);
        else equal.push(item);
    }
    
    return [...quickSort(left, key), ...equal, ...quickSort(right, key)];
}

// Bubble Sort
function bubbleSort(arr, key) {
    const sorted = [...arr];
    const n = sorted.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (sorted[j][key] > sorted[j + 1][key]) {
                [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
            }
        }
    }
    
    return sorted;
}

// ============================================
// SORTING EXECUTION
// ============================================

function runSorting() {
    if (state.packages.length === 0) {
        showNotification('Generate data paket terlebih dahulu!', 'warning');
        return;
    }
    
    const algorithm = document.getElementById('sort-algorithm').value;
    const sortBy = document.getElementById('sort-by').value;
    const key = getKeyFromSortBy(sortBy);
    
    showLoading(`Menjalankan ${CONFIG.algorithms[algorithm].name}...`);
    
    // Jalankan sorting
    setTimeout(() => {
        const startTime = performance.now();
        let sortedPackages;
        
        switch (algorithm) {
            case 'merge-iterative':
                sortedPackages = mergeSortIterative(state.packages, key);
                break;
            case 'merge-recursive':
                sortedPackages = mergeSortRecursive(state.packages, key);
                break;
            case 'quick':
                sortedPackages = quickSort(state.packages, key);
                break;
            case 'bubble':
                sortedPackages = bubbleSort(state.packages, key);
                break;
            default:
                sortedPackages = [...state.packages];
        }
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        // Simpan hasil
        state.results[algorithm] = {
            time: executionTime,
            count: sortedPackages.length,
            sorted: sortedPackages.slice(0, 50) // Simpan 50 pertama untuk display
        };
        
        // Update UI
        updateAlgorithmResults();
        updatePackageTable(sortedPackages);
        updateCharts();
        
        hideLoading();
        
        showNotification(
            `${CONFIG.algorithms[algorithm].name} selesai dalam ${executionTime.toFixed(2)} ms!`,
            'success'
        );
        
    }, 100);
}

function getKeyFromSortBy(sortBy) {
    switch (sortBy) {
        case 'weight': return 'weight';
        case 'priority': return 'priority';
        case 'distance': return 'distance';
        case 'time': return 'estimatedTime';
        default: return 'weight';
    }
}

// ============================================
// BATCH TESTING
// ============================================

function runBatchTest() {
    if (state.packages.length === 0) {
        showNotification('Generate data paket terlebih dahulu!', 'warning');
        return;
    }
    
    const sortBy = document.getElementById('sort-by').value;
    const key = getKeyFromSortBy(sortBy);
    const sizes = [50, 100, 200, 500, 1000];
    
    showLoading('Menjalankan batch test...', true);
    
    state.testResults = [];
    
    // Jalankan test untuk setiap size
    sizes.forEach((size, index) => {
        // Generate subset data
        const subset = state.packages.slice(0, Math.min(size, state.packages.length));
        
        const results = {
            size: size,
            algorithms: {}
        };
        
        // Test setiap algoritma
        Object.keys(CONFIG.algorithms).forEach(algo => {
            const startTime = performance.now();
            
            switch (algo) {
                case 'merge-iterative':
                    mergeSortIterative(subset, key);
                    break;
                case 'merge-recursive':
                    mergeSortRecursive(subset, key);
                    break;
                case 'quick':
                    quickSort(subset, key);
                    break;
                case 'bubble':
                    bubbleSort(subset, key);
                    break;
            }
            
            const endTime = performance.now();
            results.algorithms[algo] = endTime - startTime;
        });
        
        state.testResults.push(results);
        
        // Update progress
        updateProgress(((index + 1) / sizes.length) * 100);
    });
    
    hideLoading();
    showResultsModal();
    updateCharts();
    
    showNotification('Batch test selesai! Lihat hasil analisis.', 'success');
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

function updateDashboard() {
    if (state.packages.length === 0) return;
    
    const totalWeight = state.packages.reduce((sum, pkg) => sum + pkg.weight, 0);
    const totalDistance = state.packages.reduce((sum, pkg) => sum + pkg.distance, 0);
    const totalTime = state.packages.reduce((sum, pkg) => sum + pkg.estimatedTime, 0);
    
    document.getElementById('total-packages').textContent = state.packages.length;
    document.getElementById('avg-weight').textContent = (totalWeight / state.packages.length).toFixed(2) + ' kg';
    document.getElementById('total-distance').textContent = totalDistance + ' km';
    document.getElementById('total-time').textContent = totalTime + ' jam';
}

function updatePackageTable(packages = state.packages) {
    const tbody = document.getElementById('packages-body');
    tbody.innerHTML = '';
    
    const displayPackages = packages.slice(0, 20); // Tampilkan 20 pertama
    
    displayPackages.forEach(pkg => {
        const row = document.createElement('tr');
        
        // Priority color
        let priorityClass = '';
        if (pkg.priority === 1) priorityClass = 'priority-1';
        else if (pkg.priority === 2) priorityClass = 'priority-2';
        else if (pkg.priority === 3) priorityClass = 'priority-3';
        else if (pkg.priority === 4) priorityClass = 'priority-4';
        else priorityClass = 'priority-5';
        
        row.innerHTML = `
            <td>${pkg.id}</td>
            <td><strong>${pkg.name}</strong></td>
            <td>${pkg.weight} kg</td>
            <td><span class="package-type" style="background:${pkg.typeColor}20;color:${pkg.typeColor}">${pkg.type}</span></td>
            <td><span class="priority-badge ${priorityClass}">${pkg.priority}</span></td>
            <td>${pkg.origin} → ${pkg.destination}</td>
            <td>${pkg.distance} km</td>
            <td>${pkg.estimatedTime} jam</td>
            <td><span class="status ${pkg.status}">${pkg.status}</span></td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Jika tidak ada data
    if (displayPackages.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="empty">Tidak ada data paket</td>
            </tr>
        `;
    }
}

function updateAlgorithmResults() {
    // Update waktu untuk setiap algoritma
    Object.keys(CONFIG.algorithms).forEach(algo => {
        const result = state.results[algo];
        if (result) {
            document.getElementById(`time-${algo.split('-')[1] || algo}`).textContent = 
                `${result.time.toFixed(2)} ms`;
            document.getElementById(`count-${algo.split('-')[1] || algo}`).textContent = 
                result.count;
        }
    });
}

// ============================================
// CHARTS FUNCTIONS
// ============================================

function setupCharts() {
    // Performance Chart
    const perfCtx = document.getElementById('performanceChart').getContext('2d');
    state.charts.performance = new Chart(perfCtx, {
        type: 'bar',
        data: {
            labels: Object.values(CONFIG.algorithms).map(a => a.name),
            datasets: [{
                label: 'Waktu Eksekusi (ms)',
                data: [],
                backgroundColor: Object.values(CONFIG.algorithms).map(a => a.color),
                borderColor: Object.values(CONFIG.algorithms).map(a => a.color + 'CC'),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Perbandingan Waktu Sorting',
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw.toFixed(2)} ms`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Waktu (ms)'
                    }
                }
            }
        }
    });
    
    // Complexity Chart
    const compCtx = document.getElementById('complexityChart').getContext('2d');
    state.charts.complexity = new Chart(compCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Merge Sort (Iteratif)',
                    data: [],
                    borderColor: CONFIG.algorithms['merge-iterative'].color,
                    backgroundColor: CONFIG.algorithms['merge-iterative'].color + '20',
                    borderWidth: 3,
                    tension: 0.4
                },
                {
                    label: 'Merge Sort (Rekursif)',
                    data: [],
                    borderColor: CONFIG.algorithms['merge-recursive'].color,
                    backgroundColor: CONFIG.algorithms['merge-recursive'].color + '20',
                    borderWidth: 3,
                    tension: 0.4
                },
                {
                    label: 'Quick Sort',
                    data: [],
                    borderColor: CONFIG.algorithms['quick'].color,
                    backgroundColor: CONFIG.algorithms['quick'].color + '20',
                    borderWidth: 3,
                    tension: 0.4
                },
                {
                    label: 'Bubble Sort',
                    data: [],
                    borderColor: CONFIG.algorithms['bubble'].color,
                    backgroundColor: CONFIG.algorithms['bubble'].color + '20',
                    borderWidth: 3,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Scaling Performance vs Ukuran Data',
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(2)} ms`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Jumlah Paket'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Waktu (ms)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
    
    updateCharts();
}

function updateCharts() {
    // Update performance chart
    if (state.charts.performance) {
        const perfData = Object.keys(CONFIG.algorithms).map(algo => {
            return state.results[algo] ? state.results[algo].time : 0;
        });
        
        state.charts.performance.data.datasets[0].data = perfData;
        state.charts.performance.update();
    }
    
    // Update complexity chart dari batch test
    if (state.charts.complexity && state.testResults.length > 0) {
        const sizes = state.testResults.map(r => r.size);
        
        // Update labels
        state.charts.complexity.data.labels = sizes;
        
        // Update data untuk setiap algoritma
        const algorithms = ['merge-iterative', 'merge-recursive', 'quick', 'bubble'];
        algorithms.forEach((algo, index) => {
            const data = state.testResults.map(r => r.algorithms[algo] || 0);
            state.charts.complexity.data.datasets[index].data = data;
        });
        
        state.charts.complexity.update();
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showLoading(message, showProgress = false) {
    document.getElementById('loading-message').textContent = message;
    document.getElementById('loading-modal').style.display = 'flex';
    
    if (showProgress) {
        document.getElementById('progress-bar').style.width = '0%';
    }
}

function hideLoading() {
    document.getElementById('loading-modal').style.display = 'none';
}

function updateProgress(percent) {
    document.getElementById('progress-bar').style.width = percent + '%';
    document.getElementById('loading-detail').textContent = `Progress: ${Math.round(percent)}%`;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Icons berdasarkan type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        max-width: 400px;
        border-left: 5px solid ${
            type === 'success' ? '#27ae60' :
            type === 'error' ? '#e74c3c' :
            type === 'warning' ? '#f39c12' : '#3498db'
        };
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => notification.remove(), 300);
    });
}

function showResultsModal() {
    const modal = document.getElementById('results-modal');
    const content = document.getElementById('results-content');
    
    if (state.testResults.length === 0) {
        content.innerHTML = '<p>Tidak ada hasil batch test.</p>';
        return;
    }
    
    let html = `
        <h3>Hasil Batch Test</h3>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Jumlah Paket</th>
                    <th>Merge Iteratif</th>
                    <th>Merge Rekursif</th>
                    <th>Quick Sort</th>
                    <th>Bubble Sort</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    state.testResults.forEach(result => {
        html += `
            <tr>
                <td><strong>${result.size}</strong></td>
                <td>${result.algorithms['merge-iterative']?.toFixed(2) || '0'} ms</td>
                <td>${result.algorithms['merge-recursive']?.toFixed(2) || '0'} ms</td>
                <td>${result.algorithms['quick']?.toFixed(2) || '0'} ms</td>
                <td>${result.algorithms['bubble']?.toFixed(2) || '0'} ms</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        
        <div class="analysis">
            <h4>Analisis:</h4>
            <ul>
                <li>Quick Sort umumnya paling cepat untuk data acak</li>
                <li>Bubble Sort menunjukkan kompleksitas O(n²) yang jelas</li>
                <li>Merge Sort stabil untuk semua kasus</li>
                <li>Iteratif vs Rekursif: perbedaan minimal untuk n kecil</li>
            </ul>
        </div>
    `;
    
    content.innerHTML = html;
    modal.style.display = 'flex';
}

function resetApplication() {
    if (!confirm('Reset semua data dan hasil?')) return;
    
    state.packages = [];
    state.results = {};
    state.testResults = [];
    
    // Reset UI
    updateDashboard();
    updatePackageTable();
    updateCharts();
    
    // Reset algorithm results
    Object.keys(CONFIG.algorithms).forEach(algo => {
        const algoName = algo.split('-')[1] || algo;
        document.getElementById(`time-${algoName}`).textContent = '- ms';
        document.getElementById(`count-${algoName}`).textContent = '0';
    });
    
    showNotification('Aplikasi telah direset', 'info');
}

// ============================================
// ADDITIONAL CSS FOR NOTIFICATIONS
// ============================================

const style = document.createElement('style');
style.textContent = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 10000;
    transform: translateX(150%);
    transition: transform 0.3s ease;
    max-width: 400px;
}

.notification i:first-child {
    font-size: 1.2rem;
}

.notification.success i:first-child { color: #27ae60; }
.notification.error i:first-child { color: #e74c3c; }
.notification.warning i:first-child { color: #f39c12; }
.notification.info i:first-child { color: #3498db; }

.notification span {
    flex: 1;
}

.notification-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #95a5a6;
    padding: 5px;
    border-radius: 50%;
}

.notification-close:hover {
    background: #f8f9fa;
}

.results-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
}

.results-table th {
    background: #f8f9fa;
    padding: 10px;
    text-align: center;
    border: 1px solid #dee2e6;
}

.results-table td {
    padding: 10px;
    text-align: center;
    border: 1px solid #dee2e6;
}

.results-table tr:nth-child(even) {
    background: #f8f9fa;
}

.analysis {
    margin-top: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.analysis ul {
    margin-left: 1.5rem;
    margin-top: 0.5rem;
}

.priority-1 { background: #ff6b6b; color: white; }
.priority-2 { background: #ffa726; color: white; }
.priority-3 { background: #42a5f5; color: white; }
.priority-4 { background: #66bb6a; color: white; }
.priority-5 { background: #bdbdbd; color: #333; }

.status.pending { background: #fff3cd; color: #856404; }
.status.processing { background: #d1ecf1; color: #0c5460; }
.status.delivered { background: #d4edda; color: #155724; }
`;
document.head.appendChild(style);
