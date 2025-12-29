const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generatePackageData, benchmarkSort } = require('./algorithms/mergeSort');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route untuk generate data paket
app.post('/api/generate-packages', (req, res) => {
    try {
        const { size } = req.body;
        
        if (!size || size < 1 || size > 100000) {
            return res.status(400).json({ 
                error: 'Size harus antara 1 dan 100000' 
            });
        }
        
        const packages = generatePackageData(size);
        
        res.json({
            success: true,
            packages: packages.slice(0, 50), // Kirim 50 pertama untuk preview
            totalPackages: packages.length,
            statistics: {
                byType: countByType(packages),
                byPriority: countByPriority(packages),
                averageWeight: calculateAverageWeight(packages)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route untuk benchmark sorting
app.post('/api/benchmark', (req, res) => {
    try {
        const { packages, sortBy } = req.body;
        
        if (!packages || !Array.isArray(packages)) {
            return res.status(400).json({ 
                error: 'Data paket tidak valid' 
            });
        }
        
        // Ekstrak nilai sorting berdasarkan kriteria
        let packagesToSort;
        if (sortBy === 'weight') {
            packagesToSort = packages.map(p => p.weight);
        } else if (sortBy === 'priority') {
            packagesToSort = packages.map(p => p.priority);
        } else if (sortBy === 'distance') {
            packagesToSort = packages.map(p => p.distance);
        } else {
            packagesToSort = packages.map(p => p.sortValue);
        }
        
        // Benchmark recursive sort
        const recursiveResult = benchmarkSort([...packagesToSort], 'recursive');
        
        // Benchmark iterative sort
        const iterativeResult = benchmarkSort([...packagesToSort], 'iterative');
        
        // Map kembali hasil sorting ke objek paket
        const mapSortedValues = (sortedValues, originalPackages, sortBy) => {
            const valueMap = {};
            originalPackages.forEach(pkg => {
                valueMap[pkg[sortBy === 'weight' ? 'weight' : 
                           sortBy === 'priority' ? 'priority' : 
                           sortBy === 'distance' ? 'distance' : 'sortValue']] = pkg;
            });
            
            return sortedValues.map(val => valueMap[val] || { value: val });
        };
        
        res.json({
            success: true,
            recursive: {
                ...recursiveResult,
                sortedPackages: mapSortedValues(
                    recursiveResult.sortedPackages, 
                    packages, 
                    sortBy
                )
            },
            iterative: {
                ...iterativeResult,
                sortedPackages: mapSortedValues(
                    iterativeResult.sortedPackages, 
                    packages, 
                    sortBy
                )
            },
            sortBy: sortBy,
            comparison: {
                timeDifference: (iterativeResult.executionTime - recursiveResult.executionTime).toFixed(4),
                fasterAlgorithm: recursiveResult.executionTime < iterativeResult.executionTime ? 
                                'Rekursif' : 'Iteratif',
                percentageDifference: ((Math.abs(iterativeResult.executionTime - recursiveResult.executionTime) / 
                                      Math.max(recursiveResult.executionTime, iterativeResult.executionTime)) * 100).toFixed(2)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route untuk batch testing
app.post('/api/batch-test', async (req, res) => {
    try {
        const { sizes, sortBy, iterations = 3 } = req.body;
        
        if (!sizes || !Array.isArray(sizes)) {
            return res.status(400).json({ 
                error: 'Sizes harus berupa array' 
            });
        }
        
        const results = [];
        
        for (const size of sizes) {
            const sizeResults = {
                size: size,
                recursiveTimes: [],
                iterativeTimes: [],
                averageRecursive: 0,
                averageIterative: 0
            };
            
            // Generate packages untuk size ini
            const packages = generatePackageData(size);
            let packagesToSort;
            
            if (sortBy === 'weight') {
                packagesToSort = packages.map(p => p.weight);
            } else if (sortBy === 'priority') {
                packagesToSort = packages.map(p => p.priority);
            } else if (sortBy === 'distance') {
                packagesToSort = packages.map(p => p.distance);
            } else {
                packagesToSort = packages.map(p => p.sortValue);
            }
            
            // Jalankan beberapa iterasi untuk mendapatkan rata-rata
            for (let i = 0; i < iterations; i++) {
                const recursiveResult = benchmarkSort([...packagesToSort], 'recursive');
                const iterativeResult = benchmarkSort([...packagesToSort], 'iterative');
                
                sizeResults.recursiveTimes.push(parseFloat(recursiveResult.executionTime));
                sizeResults.iterativeTimes.push(parseFloat(iterativeResult.executionTime));
            }
            
            // Hitung rata-rata
            sizeResults.averageRecursive = sizeResults.recursiveTimes
                .reduce((a, b) => a + b, 0) / iterations;
            sizeResults.averageIterative = sizeResults.iterativeTimes
                .reduce((a, b) => a + b, 0) / iterations;
            
            results.push(sizeResults);
        }
        
        res.json({
            success: true,
            results: results,
            sortBy: sortBy,
            iterations: iterations
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper functions
function countByType(packages) {
    const count = {};
    packages.forEach(pkg => {
        count[pkg.type] = (count[pkg.type] || 0) + 1;
    });
    return count;
}

function countByPriority(packages) {
    const count = {};
    packages.forEach(pkg => {
        count[pkg.priority] = (count[pkg.priority] || 0) + 1;
    });
    return count;
}

function calculateAverageWeight(packages) {
    const total = packages.reduce((sum, pkg) => sum + pkg.weight, 0);
    return (total / packages.length).toFixed(2);
}

// Route untuk health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'Merge Sort Logistics API',
        version: '1.0.0'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`API Health Check: http://localhost:${PORT}/api/health`);
});