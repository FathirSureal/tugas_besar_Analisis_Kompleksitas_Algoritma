/* ===== RESET & BASE ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #2c3e50;
    --secondary: #3498db;
    --success: #27ae60;
    --warning: #f39c12;
    --danger: #e74c3c;
    --info: #9b59b6;
    --light: #ecf0f1;
    --dark: #2c3e50;
    --gray: #95a5a6;
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    --radius: 12px;
    --transition: all 0.3s ease;
}

body {
    font-family: 'Poppins', sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.98);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
}

/* ===== HEADER ===== */
.header {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    padding: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.logo {
    display: flex;
    align-items: center;
    gap: 20px;
}

.logo i {
    font-size: 3rem;
    color: #fff;
}

.logo h1 {
    font-size: 2.5rem;
    font-weight: 700;
}

.logo span {
    color: #ffd700;
}

.subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-top: 5px;
}

.badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    margin-top: 10px;
}

.header-info {
    display: flex;
    gap: 20px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.1);
    padding: 10px 15px;
    border-radius: 8px;
}

/* ===== STATS ===== */
.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    padding: 30px;
    background: #f8f9fa;
}

.stat-card {
    background: white;
    border-radius: var(--radius);
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: var(--shadow);
    transition: var(--transition);
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.stat-card i {
    font-size: 2.5rem;
    color: var(--secondary);
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(52, 152, 219, 0.1);
    border-radius: 50%;
}

.stat-card h3 {
    font-size: 1rem;
    color: var(--gray);
    margin-bottom: 5px;
}

.stat-card p {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary);
}

/* ===== CONTROL PANEL ===== */
.control-panel {
    padding: 30px;
    border-bottom: 1px solid #eee;
}

.control-panel h2 {
    color: var(--primary);
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.controls-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
    margin-bottom: 30px;
}

.control-group label {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    font-weight: 500;
    color: var(--dark);
}

.slider-container {
    background: #f8f9fa;
    padding: 20px;
    border-radius: var(--radius);
}

.slider {
    width: 100%;
    height: 8px;
    background: #ddd;
    border-radius: 4px;
    outline: none;
    -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--secondary);
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.slider-info {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 0.9rem;
    color: var(--gray);
}

#count-value {
    font-weight: 700;
    color: var(--secondary);
    font-size: 1.2rem;
}

select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: var(--radius);
    font-size: 1rem;
    background: white;
    color: var(--dark);
    cursor: pointer;
    transition: var(--transition);
}

select:focus {
    border-color: var(--secondary);
    outline: none;
}

.button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
}

.btn {
    padding: 14px 28px;
    border: none;
    border-radius: var(--radius);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: var(--transition);
    min-width: 180px;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.btn-primary {
    background: linear-gradient(135deg, var(--secondary), #2980b9);
    color: white;
}

.btn-success {
    background: linear-gradient(135deg, var(--success), #229954);
    color: white;
}

.btn-warning {
    background: linear-gradient(135deg, var(--warning), #d68910);
    color: white;
}

.btn-danger {
    background: linear-gradient(135deg, var(--danger), #c0392b);
    color: white;
}

.btn-sm {
    padding: 8px 16px;
    font-size: 0.9rem;
    min-width: auto;
}

/* ===== RESULTS ===== */
.results {
    padding: 30px;
    background: #f8f9fa;
}

.results h2 {
    color: var(--primary);
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.result-card {
    background: white;
    border-radius: var(--radius);
    padding: 20px;
    box-shadow: var(--shadow);
    transition: var(--transition);
    border-top: 4px solid var(--secondary);
}

.result-card:hover {
    transform: translateY(-3px);
}

.result-card h3 {
    color: var(--primary);
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.complexity {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.badge {
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
}

.badge-success {
    background: #d4edda;
    color: #155724;
}

.badge-info {
    background: #d1ecf1;
    color: #0c5460;
}

.badge-warning {
    background: #fff3cd;
    color: #856404;
}

.badge-danger {
    background: #f8d7da;
    color: #721c24;
}

.result-info p {
    margin: 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.result-info span {
    font-weight: 600;
    color: var(--primary);
}

.comparison-result {
    background: white;
    border-radius: var(--radius);
    padding: 25px;
    box-shadow: var(--shadow);
    margin-top: 20px;
}

.comparison-result h3 {
    color: var(--primary);
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

/* ===== CHARTS ===== */
.charts {
    padding: 30px;
}

.charts h2 {
    color: var(--primary);
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
    gap: 30px;
}

.chart-container {
    background: white;
    border-radius: var(--radius);
    padding: 25px;
    box-shadow: var(--shadow);
}

.chart-container h3 {
    color: var(--primary);
    margin-bottom: 20px;
    text-align: center;
}

/* ===== DATA TABLE ===== */
.data-table {
    padding: 30px;
    background: #f8f9fa;
}

.data-table h2 {
    color: var(--primary);
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
}

.search-box {
    position: relative;
    min-width: 250px;
}

.search-box i {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray);
}

.search-box input {
    width: 100%;
    padding: 12px 15px 12px 45px;
    border: 2px solid #e0e0e0;
    border-radius: var(--radius);
    font-size: 1rem;
    transition: var(--transition);
}

.search-box input:focus {
    border-color: var(--secondary);
    outline: none;
}

.table-wrapper {
    background: white;
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    max-height: 500px;
    overflow-y: auto;
}

#package-table {
    width: 100%;
    border-collapse: collapse;
}

#package-table thead {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    position: sticky;
    top: 0;
    z-index: 10;
}

#package-table th {
    padding: 16px 20px;
    text-align: left;
    font-weight: 600;
    white-space: nowrap;
}

#package-table td {
    padding: 14px 20px;
    border-bottom: 1px solid #eee;
}

#package-table tbody tr:hover {
    background-color: #f8f9fa;
}

.package-type {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
}

.priority {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    font-weight: 600;
    color: white;
}

.priority-1 { background: #e74c3c; }
.priority-2 { background: #e67e22; }
.priority-3 { background: #f39c12; }
.priority-4 { background: #2ecc71; }
.priority-5 { background: #3498db; }

.status {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
}

.status.pending { background: #fff3cd; color: #856404; }
.status.processing { background: #d1ecf1; color: #0c5460; }
.status.delivered { background: #d4edda; color: #155724; }

.empty {
    text-align: center;
    padding: 40px !important;
    color: var(--gray);
}

.empty i {
    font-size: 3rem;
    margin-bottom: 15px;
    opacity: 0.5;
}

.table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    flex-wrap: wrap;
    gap: 15px;
}

.pagination {
    display: flex;
    align-items: center;
    gap: 15px;
}

.btn-pagination {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #e0e0e0;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.btn-pagination:hover:not(:disabled) {
    border-color: var(--secondary);
    color: var(--secondary);
}

.btn-pagination:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

#page-info {
    font-weight: 600;
    color: var(--primary);
}

.table-stats {
    color: var(--gray);
    font-size: 0.9rem;
}

/* ===== FOOTER ===== */
.footer {
    background: var(--primary);
    color: white;
    padding: 40px 30px 20px;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    margin-bottom: 40px;
}

.footer-section h4 {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.footer-section p {
    margin: 8px 0;
    opacity: 0.8;
}

.footer-bottom {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.github-link {
    margin-top: 10px;
}

.github-link a {
    color: white;
    text-decoration: none;
    margin-left: 8px;
}

.github-link a:hover {
    text-decoration: underline;
}

/* ===== LOADING OVERLAY ===== */
.loading-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.loading-content {
    background: white;
    padding: 40px;
    border-radius: var(--radius);
    text-align: center;
    max-width: 400px;
    width: 90%;
}

.spinner i {
    color: var(--secondary);
    margin-bottom: 20px;
}

.progress {
    height: 10px;
    background: #e0e0e0;
    border-radius: 5px;
    margin: 20px 0;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--secondary), var(--success));
    width: 0%;
    transition: width 0.3s ease;
}

#loading-detail {
    font-size: 0.9rem;
    color: var(--gray);
    margin-top: 10px;
}

/* ===== NOTIFICATIONS ===== */
#notifications {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1001;
}

.notification {
    background: white;
    padding: 15px 20px;
    border-radius: var(--radius);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 10px;
    animation: slideIn 0.3s ease;
    border-left: 5px solid;
    max-width: 350px;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.notification.success {
    border-left-color: var(--success);
}

.notification.error {
    border-left-color: var(--danger);
}

.notification.warning {
    border-left-color: var(--warning);
}

.notification.info {
    border-left-color: var(--secondary);
}

.notification i:first-child {
    font-size: 1.2rem;
}

.notification.success i:first-child { color: var(--success); }
.notification.error i:first-child { color: var(--danger); }
.notification.warning i:first-child { color: var(--warning); }
.notification.info i:first-child { color: var(--secondary); }

.notification-close {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--gray);
    padding: 5px;
    border-radius: 50%;
    margin-left: auto;
}

.notification-close:hover {
    background: #f8f9fa;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        text-align: center;
        gap: 20px;
    }
    
    .header-info {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .button-group {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
    }
    
    .controls-grid {
        grid-template-columns: 1fr;
    }
    
    .results-grid {
        grid-template-columns: 1fr;
    }
    
    .table-controls {
        flex-direction: column;
        align-items: stretch;
    }
    
    .search-box {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .container {
        border-radius: 0;
        margin: -20px;
    }
    
    body {
        padding: 0;
    }
    
    .logo h1 {
        font-size: 2rem;
    }
    
    .stats {
        grid-template-columns: 1fr;
    }
}
