// Algoritma Merge Sort Rekursif
function mergeSortRecursive(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    
    return merge(
        mergeSortRecursive(left),
        mergeSortRecursive(right)
    );
}

// Algoritma Merge Sort Iteratif
function mergeSortIterative(arr) {
    const n = arr.length;
    let currentSize;
    let leftStart;
    
    // Duplikat array untuk pengurutan
    const sortedArray = [...arr];
    
    // Mulai dengan subarray berukuran 1
    for (currentSize = 1; currentSize < n; currentSize = 2 * currentSize) {
        for (leftStart = 0; leftStart < n; leftStart += 2 * currentSize) {
            const mid = Math.min(leftStart + currentSize - 1, n - 1);
            const rightEnd = Math.min(leftStart + 2 * currentSize - 1, n - 1);
            
            mergeIterative(sortedArray, leftStart, mid, rightEnd);
        }
    }
    
    return sortedArray;
}

// Fungsi merge untuk rekursif
function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] <= right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }
    
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// Fungsi merge untuk iteratif
function mergeIterative(arr, l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;
    
    // Buat array sementara
    const L = new Array(n1);
    const R = new Array(n2);
    
    // Salin data ke array sementara
    for (let i = 0; i < n1; i++) {
        L[i] = arr[l + i];
    }
    for (let j = 0; j < n2; j++) {
        R[j] = arr[m + 1 + j];
    }
    
    // Merge array sementara
    let i = 0, j = 0, k = l;
    
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    // Salin elemen yang tersisa
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

// Generator data paket logistik
function generatePackageData(size) {
    const packages = [];
    
    // Jenis paket berdasarkan berat (kg)
    const packageTypes = [
        { type: "Dokumen", min: 0.1, max: 1 },
        { type: "Small", min: 1, max: 5 },
        { type: "Medium", min: 5, max: 20 },
        { type: "Large", min: 20, max: 50 },
        { type: "XL", min: 50, max: 100 }
    ];
    
    // Prioritas pengiriman (1: sangat penting, 5: reguler)
    const priorities = [1, 2, 3, 4, 5];
    
    for (let i = 0; i < size; i++) {
        const type = packageTypes[Math.floor(Math.random() * packageTypes.length)];
        const weight = Math.random() * (type.max - type.min) + type.min;
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        const distance = Math.floor(Math.random() * 1000) + 1; // km
        const estimatedTime = Math.floor(Math.random() * 120) + 1; // jam
        
        packages.push({
            id: i + 1,
            type: type.type,
            weight: parseFloat(weight.toFixed(2)),
            priority: priority,
            distance: distance,
            estimatedTime: estimatedTime,
            // Nilai untuk sorting (bisa berdasarkan berat, prioritas, atau jarak)
            sortValue: Math.random() * 1000
        });
    }
    
    return packages;
}

// Benchmark performance
function benchmarkSort(packages, sortType) {
    const startTime = process.hrtime.bigint();
    
    let sortedPackages;
    if (sortType === 'recursive') {
        sortedPackages = mergeSortRecursive(packages);
    } else {
        sortedPackages = mergeSortIterative(packages);
    }
    
    const endTime = process.hrtime.bigint();
    const executionTime = Number(endTime - startTime) / 1000000; // Convert ke ms
    
    return {
        sortedPackages: sortedPackages.slice(0, 100), // Hanya ambil 100 pertama untuk display
        executionTime: executionTime.toFixed(4),
        totalPackages: packages.length,
        sortType: sortType
    };
}

module.exports = {
    mergeSortRecursive,
    mergeSortIterative,
    generatePackageData,
    benchmarkSort
};