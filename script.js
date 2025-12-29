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
   