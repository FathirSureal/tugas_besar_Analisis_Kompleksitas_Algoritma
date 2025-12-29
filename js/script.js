// Base URL untuk API backend
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://your-heroku-app.herokuapp.com/api';\
    
// Elemen DOM
const elements = {
    // Stats
    totalPackages: document.getElementById('total-packages'),
    avgWeight: document.getElementById('avg-weight'),
    timeIterative: document.getElementById('time-iterative'),
    timeRecursive: document.getElementById('time-recursive'),
    
    // Input controls
    dataSize: document.getElementById('data-size'),
    dataSizeRange: document.getElementById('data-size-range'),
    sizeValue: document.getElementById('size-value'),
    sortCriteria: document.getElementById('sort-criteria'),
    
    // Buttons
    generateDataBtn: document.getElementById('generate-data'),
    runSingleBtn: document.getElementById('run-single'),
    runBatchBtn: document.getElementById('run-batch'),
    resetBtn: document.getElementById('reset-btn'),
    checkApiBtn: document.getElementById('check-api'),
    
    // Results
    iterativeResult: document.getElementById('iterative-result'),
    recursiveResult: document.getElementById('recursive-result'),
    iterativeTime: document.getElementById('iterative-time'),
    recursiveTime: document.getElementById('recursive-time'),
    comparisonSummary: document.getElementById('comparison-summary'),
    
    // Package table
    packageTableBody: document.getElementById('package-table-body'),
    
    // API status
    apiStatus: document.getElementById('api-status'),
    
    // Loading overlay
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingText: document.getElementById('loading-text'),
    progressFill: document.getElementById('progress-fill'),
    
    // Charts
    performanceChart: null,
    comparisonChart: null
};

// Data state
let currentPackages = [];
let batchTestResults = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    initCharts();
    checkApiStatus();
});

// Initialize event listeners
function initEventListeners() {
    // Sync range slider dengan number input
    elements.dataSizeRange.addEventListener('input', function() {
        elements.dataSize.value = this.value;
        elements.sizeValue.textContent = this.value;
    });
    
    elements.dataSize.addEventListener('input', function() {
        let value = parseInt(this.value);
        if (value < 100) value = 100;
        if (value > 50000) value = 50000;
        this.value = value;
        elements.dataSizeRange.value = value > 10000 ? 10000 : value;
        elements.sizeValue.textContent = value;
    });
    
    // Button event listeners
    elements.generateDataBtn.addEventListener('click', generatePackages);
    elements.runSingleBtn.addEventListener('click', runSorting);
    elements.runBatchBtn.addEventListener('click', runBatchTest);
    elements.resetBtn.addEventListener('click', resetApplication);
    elements.checkApiBtn.addEventListener('click', checkApiStatus);
}

// Initialize charts
function initCharts() {
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
    
    // Performance chart (line chart)
    elements.performanceChart = new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Merge Sort Iteratif',
                    data: [],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Merge Sort Rekursif',
                    data: [],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Perbandingan Waktu Eksekusi vs Ukuran Data',
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
                        text: 'Jumlah Paket',
                        font: { weight: 'bold' }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Waktu Eksekusi (ms)',
                        font: { weight: 'bold' }
                    },
                    beginAtZero: true
                }
            }
        }
    });
    
    // Comparison chart (bar chart)
    elements.comparisonChart = new Chart(comparisonCtx, {
        type: 'bar',
        data: {
            labels: ['Iteratif', 'Rekursif'],
            datasets: [{
                label: 'Waktu Eksekusi (ms)',
                data: [0, 0],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(231, 76, 60, 0.8)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Perbandingan Waktu Eksekusi Terkini',
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw.toFixed(4)} ms`;
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
}

// Check API status
async function checkApiStatus() {
    showLoading('Mengecek status API...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            const data = await response.json();
            elements.apiStatus.innerHTML = '<i class="fas fa-circle" style="color: #2ecc71;"></i> API Online';
            showNotification('API berhasil terhubung!', 'success');
        } else {
            throw new Error('API tidak merespon');
        }
    } catch (error) {
        elements.apiStatus.innerHTML = '<i class="fas fa-circle" style="color: #ff4757;"></i> API Offline';
        showNotification('Gagal menghubungi API. Pastikan backend berjalan di port 3000', 'error');
        console.error('API Error:', error);
    } finally {
        hideLoading();
    }
}

// Generate packages
async function generatePackages() {
    const size = parseInt(elements.dataSize.value);
    
    if (size < 100 || size > 50000) {
        showNotification('Jumlah paket harus antara 100 dan 50.000', 'error');
        return;
    }
    
    showLoading(`Mengenerate ${size} data paket...`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/generate-packages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ size })
        });
        
        if (!response.ok) {
            throw new Error('Gagal generate data');
        }
        
        const data = await response.json();
        currentPackages = data.packages;
        
        // Update stats
        elements.totalPackages.textContent = data.totalPackages;
        elements.avgWeight.textContent = `${data.statistics.averageWeight} kg`;
        
        // Update package table
        updatePackageTable(currentPackages);
        
        showNotification(`Berhasil generate ${size} data paket logistik`, 'success');
        
    } catch (error) {
        console.error('Error generating packages:', error);
        showNotification('Gagal generate data paket', 'error');
    } finally {
        hideLoading();
    }
}

// Run sorting
async function runSorting() {
    if (currentPackages.length === 0) {
        showNotification('Generate data paket terlebih dahulu!', 'warning');
        return;
    }
    
    const sortBy = elements.sortCriteria.value;
    
    showLoading(`Menjalankan pengurutan ${currentPackages.length} paket...`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/benchmark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                packages: currentPackages,
                sortBy: sortBy
            })
        });
        
        if (!response.ok) {
            throw new Error('Gagal menjalankan sorting');
        }
        
        const data = await response.json();
        
        // Update results
        updateResults(data);
        
        // Update charts
        updateComparisonChart(data);
        
        // Update stats
        elements.timeIterative.textContent = `${data.iterative.executionTime} ms`;
        elements.timeRecursive.textContent = `${data.recursive.executionTime} ms`;
        
        showNotification('Pengurutan selesai!', 'success');
        
    } catch (error) {
        console.error('Error running sort:', error);
        showNotification('Gagal menjalankan pengurutan', 'error');
    } finally {
        hideLoading();
    }
}

// Run batch test
async function runBatchTest() {
    const min = parseInt(document.getElementById('batch-min').value) || 500;
    const max = parseInt(document.getElementById('batch-max').value) || 5000;
    const step = parseInt(document.getElementById('batch-step').value) || 500;
    const sortBy = elements.sortCriteria.value;
    
    if (min >= max) {
        showNotification('Nilai minimum harus kurang dari maksimum', 'error');
        return;
    }
    
    // Generate sizes array
    const sizes = [];
    for (let size = min; size <= max; size += step) {
        sizes.push(size);
    }
    
    showLoading(`Menjalankan pengujian batch (${sizes.length} ukuran data)...`);
    updateProgress(0);
    
    try {
        const response = await fetch(`${API_BASE_URL}/batch-test`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sizes: sizes,
                sortBy: sortBy,
                iterations: 3
            })
        });
        
        if (!response.ok) {
            throw new Error('Gagal menjalankan batch test');
        }
        
        const data = await response.json();
        batchTestResults = data.results;
        
        // Update performance chart
        updatePerformanceChart(batchTestResults);
        
        showNotification(`Pengujian batch selesai! ${sizes.length} ukuran data diuji`, 'success');
        
    } catch (error) {
        console.error('Error running batch test:', error);
        showNotification('Gagal menjalankan pengujian batch', 'error');
    } finally {
        hideLoading();
    }
}

// Update results display
function updateResults(data) {
    // Update iterative results
    elements.iterativeResult.innerHTML = '';
    data.iterative.sortedPackages.slice(0, 10).forEach(pkg => {
        const packageElement = createPackageElement(pkg, data.sortBy);
        elements.iterativeResult.appendChild(packageElement);
    });
    
    // Update recursive results
    elements.recursiveResult.innerHTML = '';
    data.recursive.sortedPackages.slice(0, 10).forEach(pkg => {
        const packageElement = createPackageElement(pkg, data.sortBy);
        elements.recursiveResult.appendChild(packageElement);
    });
    
    // Update times
    elements.iterativeTime.textContent = `${data.iterative.executionTime} ms`;
    elements.recursiveTime.textContent = `${data.recursive.executionTime} ms`;
    
    // Update comparison summary
    const faster = data.comparison.fasterAlgorithm;
    const percent = data.comparison.percentageDifference;
    
    elements.comparisonSummary.innerHTML = `
        <h4><i class="fas fa-chart-bar"></i> Ringkasan Perbandingan</h4>
        <div class="summary-stats">
            <div class="stat-item">
                <i class="fas fa-tachometer-alt"></i>
                <span>Algoritma Tercepat:</span>
                <strong style="color: ${faster === 'Iteratif' ? '#3498db' : '#e74c3c'}">${faster}</strong>
            </div>
            <div class="stat-item">
                <i class="fas fa-percentage"></i>
                <span>Perbedaan:</span>
                <strong>${percent}%</strong>
            </div>
            <div class="stat-item">
                <i class="fas fa-sort-amount-down"></i>
                <span>Kriteria:</span>
                <strong>${getSortCriteriaName(data.sortBy)}</strong>
            </div>
            <div class="stat-item">
                <i class="fas fa-boxes"></i>
                <span>Jumlah Paket:</span>
                <strong>${data.iterative.totalPackages}</strong>
            </div>
        </div>
    `;
}

// Update package table
function updatePackageTable(packages) {
    elements.packageTableBody.innerHTML = '';
    
    packages.slice(0, 20).forEach(pkg => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${pkg.id}</td>
            <td><span class="package-type ${pkg.type.toLowerCase()}">${pkg.type}</span></td>
            <td>${pkg.weight} kg</td>
            <td><span class="priority-badge priority-${pkg.priority}">${pkg.priority}</span></td>
            <td>${pkg.distance} km</td>
            <td>${pkg.estimatedTime} jam</td>
        `;
        
        elements.packageTableBody.appendChild(row);
    });
}

// Create package element for result display
function createPackageElement(pkg, sortBy) {
    const div = document.createElement('div');
    div.className = 'package-item';
    
    let value;
    switch(sortBy) {
        case 'weight': value = `${pkg.weight} kg`; break;
        case 'priority': value = `Prioritas ${pkg.priority}`; break;
        case 'distance': value = `${pkg.distance} km`; break;
        default: value = pkg.value || pkg.sortValue;
    }
    
    div.innerHTML = `
        <div class="package-header">
            <span class="package-id">#${pkg.id}</span>
            <span class="package-type ${pkg.type?.toLowerCase()}">${pkg.type || 'Unknown'}</span>
        </div>
        <div class="package-value">
            <i class="fas fa-${getSortIcon(sortBy)}"></i>
            <span>${value}</span>
        </div>
    `;
    
    return div;
}

// Update performance chart
function updatePerformanceChart(results) {
    const labels = results.map(r => r.size);
    const iterativeData = results.map(r => r.averageIterative);
    const recursiveData = results.map(r => r.averageRecursive);
    
    elements.performanceChart.data.labels = labels;
    elements.performanceChart.data.datasets[0].data = iterativeData;
    elements.performanceChart.data.datasets[1].data = recursiveData;
    elements.performanceChart.update();
}

// Update comparison chart
function updateComparisonChart(data) {
    elements.comparisonChart.data.datasets[0].data = [
        parseFloat(data.iterative.executionTime),
        parseFloat(data.recursive.executionTime)
    ];
    elements.comparisonChart.update();
}

// Reset application
function resetApplication() {
    if (!confirm('Apakah Anda yakin ingin mereset semua data dan hasil?')) {
        return;
    }
    
    currentPackages = [];
    batchTestResults = [];
    
    // Reset stats
    elements.totalPackages.textContent = '0';
    elements.avgWeight.textContent = '0 kg';
    elements.timeIterative.textContent = '0 ms';
    elements.timeRecursive.textContent = '0 ms';
    
    // Reset results
    elements.iterativeResult.innerHTML = '<div class="empty-state">Belum dijalankan</div>';
    elements.recursiveResult.innerHTML = '<div class="empty-state">Belum dijalankan</div>';
    elements.iterativeTime.textContent = '- ms';
    elements.recursiveTime.textContent = '- ms';
    elements.comparisonSummary.innerHTML = `
        <h4><i class="fas fa-chart-bar"></i> Ringkasan Perbandingan</h4>
        <p>Jalankan pengurutan untuk melihat perbandingan performa</p>
    `;
    
    // Reset table
    elements.packageTableBody.innerHTML = `
        <tr>
            <td colspan="6" class="empty-table">Generate data paket terlebih dahulu</td>
        </tr>
    `;
    
    // Reset charts
    elements.performanceChart.data.labels = [];
    elements.performanceChart.data.datasets[0].data = [];
    elements.performanceChart.data.datasets[1].data = [];
    elements.performanceChart.update();
    
    elements.comparisonChart.data.datasets[0].data = [0, 0];
    elements.comparisonChart.update();
    
    showNotification('Aplikasi telah direset', 'info');
}

// Helper functions
function showLoading(message) {
    elements.loadingText.textContent = message;
    elements.loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
    updateProgress(0);
}

function updateProgress(percentage) {
    elements.progressFill.style.width = `${percentage}%`;
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification
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
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

function getSortCriteriaName(sortBy) {
    const names = {
        weight: 'Berat Paket',
        priority: 'Prioritas',
        distance: 'Jarak',
        value: 'Nilai Acak'
    };
    return names[sortBy] || sortBy;
}

function getSortIcon(sortBy) {
    const icons = {
        weight: 'weight-hanging',
        priority: 'exclamation-circle',
        distance: 'route',
        value: 'random'
    };
    return icons[sortBy] || 'sort-amount-down';
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 10px;
    background: white;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 10000;
    transform: translateX(150%);
    transition: transform 0.3s ease;
    max-width: 400px;
    min-width: 300px;
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-left: 5px solid #27ae60;
}

.notification.error {
    border-left: 5px solid #e74c3c;
}

.notification.warning {
    border-left: 5px solid #f39c12;
}

.notification.info {
    border-left: 5px solid #3498db;
}

.notification i:first-child {
    font-size: 1.5rem;
}

.notification.success i:first-child {
    color: #27ae60;
}

.notification.error i:first-child {
    color: #e74c3c;
}

.notification.warning i:first-child {
    color: #f39c12;
}

.notification.info i:first-child {
    color: #3498db;
}

.notification span {
    flex: 1;
    font-weight: 500;
}

.notification-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #7f8c8d;
    font-size: 1rem;
    padding: 5px;
    border-radius: 50%;
    transition: background 0.3s;
}

.notification-close:hover {
    background: #f1f2f6;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    flex-direction: column;
}

.loading-content {
    background: white;
    padding: 40px;
    border-radius: 15px;
    text-align: center;
    max-width: 400px;
    width: 90%;
}

.loading-content i {
    color: #3498db;
    margin-bottom: 20px;
}

.progress-bar {
    width: 100%;
    height: 10px;
    background: #ecf0f1;
    border-radius: 5px;
    margin-top: 20px;
    overflow: hidden;
}

.progress {
    height: 100%;
    background: linear-gradient(90deg, #3498db, #2ecc71);
    width: 0%;
    transition: width 0.3s;
}

.summary-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 15px;
}

.stat-item {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.stat-item i {
    color: #3498db;
    font-size: 1.2rem;
}

.package-item {
    background: white;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    border-left: 4px solid #3498db;
}

.package-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}

.package-id {
    font-weight: bold;
    color: #2c3e50;
}

.package-type {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
}

.package-type.dokumen { background: #e3f2fd; color: #1565c0; }
.package-type.small { background: #e8f5e9; color: #2e7d32; }
.package-type.medium { background: #fff3e0; color: #ef6c00; }
.package-type.large { background: #fce4ec; color: #c2185b; }
.package-type.xl { background: #e8eaf6; color: #303f9f; }

.package-value {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
}

.priority-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.9rem;
}

.priority-1 { background: #ff4757; color: white; }
.priority-2 { background: #ff6b81; color: white; }
.priority-3 { background: #ffa502; color: white; }
.priority-4 { background: #2ed573; color: white; }
.priority-5 { background: #7bed9f; color: #2d3436; }
`;

document.head.appendChild(notificationStyles);