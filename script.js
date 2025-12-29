// ============================================
// LOGISTICS SORTING APPLICATION - FULL CLIENT SIDE
// ============================================

// Konfigurasi Aplikasi
const CONFIG = {
    appName: "LogisticsSort",
    version: "1.0.0",
    maxPackages: 1000,
    algorithms: {
        'merge-iterative': { name: 'Merge Sort Iteratif', color: '#3498db', complexity: 'O(n log n)' },
        'merge-recursive': { name: 'Merge Sort Rekursif', color: '#e74c3c', complexity: 'O(n log n)' },
        'quick': { name: 'Quick Sort', color: '#27ae60', complexity: 'O(n log n)' },
        'bubble': { name: 'Bubble Sort', color: '#f39c12', complexity: 'O(n²)' },
        'insertion': { name: 'Insertion Sort', color: '#9b59b6', complexity: 'O(n²)' },
        'selection': { name: 'Selection Sort', color: '#1abc9c', complexity: 'O(n²)' }
    },
    sortOptions: {
        'weight': { name: 'Berat Paket', unit: 'kg', icon: 'fa-weight-hanging' },
        'priority': { name: 'Prioritas', unit: '', icon: 'fa-star' },
        'distance': { name: 'Jarak', unit: 'km', icon: 'fa-road' },
        'time': { name: 'Waktu Estimasi', unit: 'jam', icon: 'fa-clock' }
    }
};

// Data Master
const DATA = {
    cities: [
        'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
        'Makassar', 'Palembang', 'Denpasar', 'Yogyakarta', 'Malang',
        'Bekasi', 'Tangerang', 'Depok', 'Bogor', 'Surakarta',
        'Pontianak', 'Manado', 'Balikpapan', 'Samarinda', 'Padang'
    ],
    packageTypes: [
        { name: 'Dokumen', weightRange: [0.1, 1], color: '#3498db', icon: 'fa-file' },
        { name: 'Kecil', weightRange: [1, 5], color: '#27ae60', icon: 'fa-box' },
        { name: 'Sedang', weightRange: [5, 20], color: '#f39c12', icon: 'fa-box-open' },
        { name: 'Besar', weightRange: [20, 50], color: '#e74c3c', icon: 'fa-pallet' },
        { name: 'XL', weightRange: [50, 100], color: '#9b59b6', icon: 'fa-truck-loading' }
    ],
    packageNames: [
        'Paket Express', 'Kiriman Prioritas', 'Logistik Reguler',
        'Kargo Berat', 'Dokumen Penting', 'Barang Elektronik',
        'Pengiriman Cepat', 'Kargo Laut', 'Udara Express',
        'Same Day Delivery', 'Next Day Delivery', 'Economy Shipping'
    ],
    statuses: [
        { name: 'pending', color: '#ffc107', label: 'Menunggu' },
        { name: 'processing', color: '#17a2b8', label: 'Diproses' },
        { name: 'delivered', color: '#28a745', label: 'Terkirim' }
    ]
};

// State Aplikasi
let AppState = {
    packages: [],
    sortedPackages: [],
    results: {},
    currentPage: 1,
    itemsPerPage: 15,
    searchQuery: '',
    displayMode: 'all', // 'all' or 'sorted'
    charts: {
        performance: null,
        complexity: null
    },
    testHistory: []
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log(`${CONFIG.appName} v${CONFIG.version} - Initializing...`);
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize charts
    initializeCharts();
    
    // Generate sample data
    setTimeout(() => {
        generatePackages(50);
        showNotification('Aplikasi siap digunakan!', 'success');
    }, 500);
    
    // Update GitHub link
    document.getElementById('github-repo').textContent = window.location.hostname.includes('github.io') 
        ? window.location.hostname + window.location.pathname 
        : 'github.com/username/logistics-sorting';
});

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Slider untuk jumlah paket
    const countSlider = document.getElementById('package-count');
    const countValue = document.getElementById('count-value');
    
    countSlider.addEventListener('input', function() {
        countValue.textContent = this.value;
    });
    
    // Tombol Generate Data
    document.getElementById('btn-generate').addEventListener('click', function() {
        const count = parseInt(countSlider.value);
        generatePackages(count);
    });
    
    // Tombol Jalankan Sorting
    document.getElementById('btn-sort').addEventListener('click', function() {
        runSelectedAlgorithm();
    });
    
    // Tombol Bandingkan Semua
    document.getElementById('btn-compare').addEventListener('click', function() {
        compareAllAlgorithms();
    });
    
    // Tombol Reset
    document.getElementById('btn-reset').addEventListener('click', function() {
        if (confirm('Reset semua data dan hasil?')) {
            resetApplication();
        }
    });
    
    // Tombol Tampilkan Semua/Terurut
    document.getElementById('btn-show-all').addEventListener('click', function() {
        AppState.displayMode = 'all';
        updatePackageTable();
        updateTableControls();
    });
    
    document.getElementById('btn-show-sorted').addEventListener('click', function() {
        AppState.displayMode = 'sorted';
        updatePackageTable();
        updateTableControls();
    });
    
    // Pencarian
    document.getElementById('search-package').addEventListener('input', function(e) {
        AppState.searchQuery = e.target.value.toLowerCase();
        AppState.currentPage = 1;
        updatePackageTable();
    });
    
    // Pagination
    document.getElementById('btn-prev').addEventListener('click', function() {
        if (AppState.currentPage > 1) {
            AppState.currentPage--;
            updatePackageTable();
        }
    });
    
    document.getElementById('btn-next').addEventListener('click', function() {
        const totalPages = Math.ceil(getDisplayPackages().length / AppState.itemsPerPage);
        if (AppState.currentPage < totalPages) {
            AppState.currentPage++;
            updatePackageTable();
        }
    });
    
    // Tombol Deploy Guide
    document.getElementById('btn-deploy').addEventListener('click', function() {
        showDeployGuide();
    });
}

// ============================================
// DATA GENERATION
// ============================================

function generatePackages(count) {
    showLoading(`Membuat ${count} data paket logistik...`);
    
    AppState.packages = [];
    
    for (let i = 0; i < count; i++) {
        const pkgType = DATA.packageTypes[Math.floor(Math.random() * DATA.packageTypes.length)];
        const weight = (Math.random() * (pkgType.weightRange[1] - pkgType.weightRange[0]) + pkgType.weightRange[0]).toFixed(2);
        
        let origin, destination;
        do {
            origin = DATA.cities[Math.floor(Math.random() * DATA.cities.length)];
            destination = DATA.cities[Math.floor(Math.random() * DATA.cities.length)];
        } while (origin === destination);
        
        const packageData = {
            id: i + 1,
            name: `${DATA.packageNames[Math.floor(Math.random() * DATA.packageNames.length)]} #${String(i + 1).padStart(4, '0')}`,
            weight: parseFloat(weight),
            type: pkgType.name,
            typeColor: pkgType.color,
            typeIcon: pkgType.icon,
            priority: Math.floor(Math.random() * 5) + 1,
            origin: origin,
            destination: destination,
            distance: Math.floor(Math.random() * 990) + 10,
            estimatedTime: Math.floor(Math.random() * 71) + 1,
            status: DATA.statuses[Math.floor(Math.random() * DATA.statuses.length)].name,
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        };
        
        AppState.packages.push(packageData);
    }
    
    // Reset state
    AppState.sortedPackages = [...AppState.packages];
    AppState.currentPage = 1;
    AppState.searchQuery = '';
    AppState.displayMode = 'all';
    
    // Update UI
    updateDashboard();
    updatePackageTable();
    updateTableControls();
    hideLoading();
    
    showNotification(`Berhasil membuat ${count} paket logistik!`, 'success');
    
    // Log untuk debugging
    console.log(`Generated ${count} packages:`, AppState.packages.slice(0, 3));
}

// ============================================
// SORTING ALGORITHMS
// ============================================

// Merge Sort Iteratif
function mergeSortIterative(arr, key) {
    const n = arr.length;
    const sorted = [...arr];
    
    for (let size = 1; size < n; size *= 2) {
        for (let left = 0; left < n; left += 2 * size) {
            const mid = Math.min(left + size, n);
            const right = Math.min(left + 2 * size, n);
            
            // Merge process
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

// Insertion Sort
function insertionSort(arr, key) {
    const sorted = [...arr];
    
    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        let j = i - 1;
        
        while (j >= 0 && sorted[j][key] > current[key]) {
            sorted[j + 1] = sorted[j];
            j--;
        }
        
        sorted[j + 1] = current;
    }
    
    return sorted;
}

// Selection Sort
function selectionSort(arr, key) {
    const sorted = [...arr];
    
    for (let i = 0; i < sorted.length; i++) {
        let minIdx = i;
        
        for (let j = i + 1; j < sorted.length; j++) {
            if (sorted[j][key] < sorted[minIdx][key]) {
                minIdx = j;
            }
        }
        
        if (minIdx !== i) {
            [sorted[i], sorted[minIdx]] = [sorted[minIdx], sorted[i]];
        }
    }
    
    return sorted;
}

// ============================================
// SORTING EXECUTION
// ============================================

function runSelectedAlgorithm() {
    if (AppState.packages.length === 0) {
        showNotification('Generate data paket terlebih dahulu!', 'warning');
        return;
    }
    
    const algorithmId = document.getElementById('algorithm').value;
    const sortType = document.getElementById('sort-type').value;
    const key = sortType;
    
    showLoading(`Menjalankan ${CONFIG.algorithms[algorithmId].name}...`);
    
    setTimeout(() => {
        const startTime = performance.now();
        let sortedResult;
        
        switch (algorithmId) {
            case 'merge-iterative':
                sortedResult = mergeSortIterative(AppState.packages, key);
                break;
            case 'merge-recursive':
                sortedResult = mergeSortRecursive(AppState.packages, key);
                break;
            case 'quick':
                sortedResult = quickSort(AppState.packages, key);
                break;
            case 'bubble':
                sortedResult = bubbleSort(AppState.packages, key);
                break;
            case 'insertion':
                sortedResult = insertionSort(AppState.packages, key);
                break;
            case 'selection':
                sortedResult = selectionSort(AppState.packages, key);
                break;
            default:
                sortedResult = [...AppState.packages];
        }
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        // Simpan hasil
        AppState.results[algorithmId] = {
            time: executionTime,
            sorted: sortedResult
        };
        
        // Update sorted packages untuk display
        AppState.sortedPackages = sortedResult;
        
        // Update UI
        updateAlgorithmResult(algorithmId, executionTime);
        updateCharts();
        hideLoading();
        
        // Update table jika mode sorted
        if (AppState.displayMode === 'sorted') {
            updatePackageTable();
        }
        
        showNotification(
            `${CONFIG.algorithms[algorithmId].name} selesai dalam ${executionTime.toFixed(2)} ms!`,
            'success'
        );
        
    }, 50);
}

function compareAllAlgorithms() {
    if (AppState.packages.length === 0) {
        showNotification('Generate data paket terlebih dahulu!', 'warning');
        return;
    }
    
    const sortType = document.getElementById('sort-type').value;
    const key = sortType;
    
    showLoading('Membandingkan semua algoritma...', true);
    AppState.results = {};
    
    const algorithms = Object.keys(CONFIG.algorithms);
    let completed = 0;
    
    algorithms.forEach((algoId, index) => {
        setTimeout(() => {
            const startTime = performance.now();
            let sortedResult;
            
            switch (algoId) {
                case 'merge-iterative':
                    sortedResult = mergeSortIterative(AppState.packages, key);
                    break;
                case 'merge-recursive':
                    sortedResult = mergeSortRecursive(AppState.packages, key);
                    break;
                case 'quick':
                    sortedResult = quickSort(AppState.packages, key);
                    break;
                case 'bubble':
                    sortedResult = bubbleSort(AppState.packages, key);
                    break;
                case 'insertion':
                    sortedResult = insertionSort(AppState.packages, key);
                    break;
                case 'selection':
                    sortedResult = selectionSort(AppState.packages, key);
                    break;
            }
            
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            
            AppState.results[algoId] = {
                time: executionTime,
                sorted: sortedResult
            };
            
            // Update UI progress
            completed++;
            updateProgress((completed / algorithms.length) * 100);
            updateAlgorithmResult(algoId, executionTime);
            
            // Jika semua selesai
            if (completed === algorithms.length) {
                setTimeout(() => {
                    hideLoading();
                    updateComparisonSummary();
                    updateCharts();
                    showNotification('Perbandingan semua algoritma selesai!', 'success');
                }, 500);
            }
        }, index * 300); // Delay untuk visual effect
    });
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

function updateDashboard() {
    if (AppState.packages.length === 0) {
        document.getElementById('stat-packages').textContent = '0';
        document.getElementById('stat-weight').textContent = '0 kg';
        document.getElementById('stat-distance').textContent = '0 km';
        document.getElementById('stat-time').textContent = '0 jam';
        return;
    }
    
    const totalWeight = AppState.packages.reduce((sum, pkg) => sum + pkg.weight, 0);
    const totalDistance = AppState.packages.reduce((sum, pkg) => sum + pkg.distance, 0);
    const totalTime = AppState.packages.reduce((sum, pkg) => sum + pkg.estimatedTime, 0);
    
    document.getElementById('stat-packages').textContent = AppState.packages.length;
    document.getElementById('stat-weight').textContent = (totalWeight / AppState.packages.length).toFixed(2) + ' kg';
    document.getElementById('stat-distance').textContent = totalDistance + ' km';
    document.getElementById('stat-time').textContent = totalTime + ' jam';
}

function updateAlgorithmResult(algorithmId, time) {
    const algoName = algorithmId.split('-')[1] || algorithmId;
    const timeElement = document.getElementById(`time-${algoName}`);
    const statusElement = document.getElementById(`status-${algoName}`);
    
    if (timeElement) {
        timeElement.textContent = `${time.toFixed(2)} ms`;
        timeElement.style.color = '#27ae60';
        timeElement.style.fontWeight = 'bold';
    }
    
    if (statusElement) {
        statusElement.textContent = 'Selesai';
        statusElement.style.color = '#27ae60';
    }
}

function updateComparisonSummary() {
    const container = document.getElementById('comparison-result');
    if (!container) return;
    
    let fastestAlgo = null;
    let fastestTime = Infinity;
    let slowestAlgo = null;
    let slowestTime = 0;
    
    Object.entries(AppState.results).forEach(([algoId, result]) => {
        if (result.time < fastestTime) {
            fastestTime = result.time;
            fastestAlgo = CONFIG.algorithms[algoId].name;
        }
        if (result.time > slowestTime) {
            slowestTime = result.time;
            slowestAlgo = CONFIG.algorithms[algoId].name;
        }
    });
    
    const sortType = document.getElementById('sort-type').value;
    const sortName = CONFIG.sortOptions[sortType].name;
    
    let html = `
        <h3><i class="fas fa-trophy"></i> Hasil Perbandingan</h3>
        <div class="summary-details">
            <div class="summary-item">
                <i class="fas fa-bolt" style="color: #27ae60;"></i>
                <div>
                    <strong>Tercepat:</strong> ${fastestAlgo}
                    <small>(${fastestTime.toFixed(2)} ms)</small>
                </div>
            </div>
            <div class="summary-item">
                <i class="fas fa-turtle" style="color: #e74c3c;"></i>
                <div>
                    <strong>Tertinggal:</strong> ${slowestAlgo}
                    <small>(${slowestTime.toFixed(2)} ms)</small>
                </div>
            </div>
            <div class="summary-item">
                <i class="fas fa-sort-amount-down" style="color: #3498db;"></i>
                <div>
                    <strong>Kriteria:</strong> ${sortName}
                </div>
            </div>
            <div class="summary-item">
                <i class="fas fa-boxes" style="color: #9b59b6;"></i>
                <div>
                    <strong>Jumlah Paket:</strong> ${AppState.packages.length}
                </div>
            </div>
        </div>
        
        <div class="complexity-analysis">
            <h4><i class="fas fa-chart-bar"></i> Analisis Kompleksitas</h4>
            <ul>
                <li>Merge Sort (O(n log n)) - Stabil untuk semua kasus</li>
                <li>Quick Sort (O(n log n)) - Tercepat untuk data acak</li>
                <li>Bubble Sort (O(n²)) - Hanya cocok untuk data kecil</li>
                <li>Insertion/Selection Sort (O(n²)) - Cocok untuk data hampir terurut</li>
            </ul>
        </div>
    `;
    
    container.innerHTML = html;
}

function updatePackageTable() {
    const tbody = document.getElementById('table-body');
    if (!tbody) return;
    
    const packages = getDisplayPackages();
    const startIdx = (AppState.currentPage - 1) * AppState.itemsPerPage;
    const endIdx = startIdx + AppState.itemsPerPage;
    const pagePackages = packages.slice(startIdx, endIdx);
    
    tbody.innerHTML = '';
    
    if (pagePackages.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="empty">
                    <i class="fas fa-search"></i>
                    <p>${AppState.searchQuery ? 'Tidak ditemukan paket dengan kata kunci tersebut' : 'Tidak ada data paket'}</p>
                </td>
            </tr>
        `;
    } else {
        pagePackages.forEach(pkg => {
            const statusInfo = DATA.statuses.find(s => s.name === pkg.status);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${pkg.id}</td>
                <td>
                    <div class="package-name">
                        <i class="fas ${pkg.typeIcon}"></i>
                        <span>${pkg.name}</span>
                    </div>
                </td>
                <td><strong>${pkg.weight} kg</strong></td>
                <td>
                    <span class="package-type" style="background:${pkg.typeColor}20;color:${pkg.typeColor}">
                        ${pkg.type}
                    </span>
                </td>
                <td>
                    <span class="priority priority-${pkg.priority}">
                        ${pkg.priority}
                    </span>
                </td>
                <td>
                    <div class="route-info">
                        <span class="origin">${pkg.origin}</span>
                        <i class="fas fa-arrow-right"></i>
                        <span class="destination">${pkg.destination}</span>
                    </div>
                </td>
                <td>${pkg.distance} km</td>
                <td>${pkg.estimatedTime} jam</td>
                <td>
                    <span class="status ${pkg.status}" style="background:${statusInfo.color}20;color:${statusInfo.color}">
                        ${statusInfo.label}
                    </span>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    updateTableInfo();
}

function getDisplayPackages() {
    let packages = AppState.displayMode === 'sorted' ? AppState.sortedPackages : AppState.packages;
    
    // Filter berdasarkan search query
    if (AppState.searchQuery) {
        packages = packages.filter(pkg => 
            pkg.name.toLowerCase().includes(AppState.searchQuery) ||
            pkg.type.toLowerCase().includes(AppState.searchQuery) ||
            pkg.origin.toLowerCase().includes(AppState.searchQuery) ||
            pkg.destination.toLowerCase().includes(AppState.searchQuery)
        );
    }
    
    return packages;
}

function updateTableInfo() {
    const packages = getDisplayPackages();
    const totalPages = Math.ceil(packages.length / AppState.itemsPerPage);
    const startIdx = (AppState.currentPage - 1) * AppState.itemsPerPage + 1;
    const endIdx = Math.min(startIdx + AppState.itemsPerPage - 1, packages.length);
    
    document.getElementById('page-info').textContent = `Halaman ${AppState.currentPage} dari ${totalPages}`;
    document.getElementById('showing-count').textContent = `${startIdx}-${endIdx}`;
    document.getElementById('total-count').textContent = packages.length;
    
    // Update pagination buttons
    document.getElementById('btn-prev').disabled = AppState.currentPage <= 1;
    document.getElementById('btn-next').disabled = AppState.currentPage >= totalPages;
}

function updateTableControls() {
    const showAllBtn = document.getElementById('btn-show-all');
    const showSortedBtn = document.getElementById('btn-show-sorted');
    
    if (AppState.displayMode === 'all') {
        showAllBtn.classList.add('active');
        showSortedBtn.classList.remove('active');
    } else {
        showAllBtn.classList.remove('active');
        showSortedBtn.classList.add('active');
    }
}

// ============================================
// CHARTS
// ============================================

function initializeCharts() {
    // Performance Chart
    const perfCtx = document.getElementById('chart-performance').getContext('2d');
    AppState.charts.performance = new Chart(perfCtx, {
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
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Perbandingan Performa Algoritma',
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.label}: ${context.raw.toFixed(2)} ms`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Waktu (ms)',
                        font: { weight: 'bold' }
                    }
                },
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45
                    }
                }
            }
        }
    });
    
    // Complexity Chart
    const compCtx = document.getElementById('chart-complexity').getContext('2d');
    AppState.charts.complexity = new Chart(compCtx, {
        type: 'line',
        data: {
            labels: ['10', '50', '100', '500', '1000'],
            datasets: [
                {
                    label: 'O(n log n)',
                    data: [2, 15, 35, 180, 400],
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'O(n²)',
                    data: [10, 250, 1000, 25000, 100000],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Kompleksitas Algoritma vs Ukuran Data',
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.raw.toFixed(0)} ms`
                    }
                }
            },
            scales: {
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Waktu (ms) - Skala Log',
                        font: { weight: 'bold' }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Jumlah Paket (n)',
                        font: { weight: 'bold' }
                    }
                }
            }
        }
    });
}

function updateCharts() {
    // Update performance chart
    if (AppState.charts.performance) {
        const perfData = Object.keys(CONFIG.algorithms).map(algoId => {
            return AppState.results[algoId] ? AppState.results[algoId].time : 0;
        });
        
        AppState.charts.performance.data.datasets[0].data = perfData;
        AppState.charts.performance.update();
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showLoading(message, showProgress = false) {
    const overlay = document.getElementById('loading');
    const text = document.getElementById('loading-text');
    const progress = document.getElementById('progress-bar');
    const detail = document.getElementById('loading-detail');
    
    if (overlay && text) {
        text.textContent = message;
        overlay.style.display = 'flex';
        
        if (showProgress) {
            progress.style.width = '0%';
            detail.textContent = 'Memulai...';
        } else {
            detail.textContent = '';
        }
    }
}

function hideLoading() {
    const overlay = document.getElementById('loading');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function updateProgress(percent) {
    const progress = document.getElementById('progress-bar');
    const detail = document.getElementById('loading-detail');
    
    if (progress) {
        progress.style.width = percent + '%';
    }
    
    if (detail) {
        detail.textContent = `Progress: ${Math.round(percent)}%`;
    }
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
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
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

function resetApplication() {
    AppState = {
        packages: [],
        sortedPackages: [],
        results: {},
        currentPage: 1,
        itemsPerPage: 15,
        searchQuery: '',
        displayMode: 'all',
        charts: AppState.charts,
        testHistory: []
    };
    
    // Reset UI
    updateDashboard();
    updatePackageTable();
    updateTableControls();
    
    // Reset algorithm results
    Object.keys(CONFIG.algorithms).forEach(algoId => {
        const algoName = algoId.split('-')[1] || algoId;
        const timeElement = document.getElementById(`time-${algoName}`);
        const statusElement = document.getElementById(`status-${algoName}`);
        
        if (timeElement) {
            timeElement.textContent = '- ms';
            timeElement.style.color = '';
            timeElement.style.fontWeight = '';
        }
        
        if (statusElement) {
            statusElement.textContent = 'Belum dijalankan';
            statusElement.style.color = '';
        }
    });
    
    // Reset comparison
    document.getElementById('comparison-result').innerHTML = `
        <h3><i class="fas fa-trophy"></i> Hasil Perbandingan</h3>
        <p>Jalankan "Bandingkan Semua" untuk melihat perbandingan lengkap</p>
    `;
    
    // Reset charts
    updateCharts();
    
    showNotification('Aplikasi telah direset', 'info');
}

function showDeployGuide() {
    const guide = `
        <h3><i class="fas fa-cloud-upload-alt"></i> Panduan Deploy ke GitHub Pages</h3>
        <div class="deploy-steps">
            <ol>
                <li>Buat repository baru di GitHub (nama: logistics-sorting)</li>
                <li>Upload semua file ke repository</li>
                <li>Buka Settings → Pages</li>
                <li>Pilih: Source → Deploy from a branch</li>
                <li>Branch: main, Folder: / (root)</li>
                <li>Save, tunggu beberapa menit</li>
                <li>Akses di: https://username.github.io/logistics-sorting</li>
            </ol>
        </div>
        <p><strong>Note:</strong> Aplikasi ini 100% client-side, tidak butuh backend!</p>
    `;
    
    showNotification(guide, 'info');
}

// ============================================
// STYLES DINAMIS (diinject ke DOM)
// ============================================

const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
.active {
    background: #3498db !important;
    color: white !important;
}

.package-name {
    display: flex;
    align-items: center;
    gap: 10px;
}

.package-name i {
    color: #666;
}

.route-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.route-info .origin {
    color: #e74c3c;
    font-weight: 600;
}

.route-info .destination {
    color: #27ae60;
    font-weight: 600;
}

.route-info i {
    color: #95a5a6;
}

.summary-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    margin: 20px 0;
}

.summary-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
}

.summary-item i {
    font-size: 1.5rem;
}

.complexity-analysis {
    margin-top: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}

.complexity-analysis ul {
    margin-left: 20px;
    margin-top: 10px;
}

.complexity-analysis li {
    margin: 5px 0;
    color: #666;
}

.deploy-steps {
    background: white;
    padding: 15px;
    border-radius: 8px;
    margin: 10px 0;
    max-height: 300px;
    overflow-y: auto;
}

.deploy-steps ol {
    margin-left: 20px;
}

.deploy-steps li {
    margin: 8px 0;
    color: #333;
}
`;
document.head.appendChild(dynamicStyles);

console.log(`${CONFIG.appName} initialized successfully!`);