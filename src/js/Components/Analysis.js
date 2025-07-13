export class Analysis {
    constructor() {

    }

    async render() {
        const analysis = document.createElement('div')
        analysis.classList.add('analysis')
        analysis.dataset.page = 'analysis'
        analysis.innerHTML = `
            <!-- --- GRÁFICO 1: Gastos por categoría del mes (Dona/Pastel) --- -->
            <div class="card" data-aos="fade-up">
                <div class="card-header">
                    <h2 class="card-title">Gastos por Categoría del Mes 🍩</h2>
                    <div class="chart-controls">
                        <select id="categoryExpensesMonthSelect">
                            <option value="2025-07">Julio 2025</option>
                            <option value="2025-06">Junio 2025</option>
                            <option value="2025-05">Mayo 2025</option>
                            <!-- Opciones de meses dinámicas -->
                        </select>
                        <select id="categoryExpensesYearSelect">
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <!-- Opciones de años dinámicas -->
                        </select>
                    </div>
                </div>
                <div class="chart-section">
                    <div class="chart-container">
                        <canvas id="categoryExpensesChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- --- GRÁFICO 2: Balance real vs estimado (Líneas mensual) --- -->
            <div class="card" data-aos="fade-up" data-aos-delay="50">
                <div class="card-header">
                    <h2 class="card-title">Balance Real vs Estimado 📊</h2>
                    <div class="chart-controls">
                        <select id="balanceComparisonMonthSelect">
                            <option value="2025-07">Julio 2025</option>
                            <option value="2025-06">Junio 2025</option>
                            <option value="2025-05">Mayo 2025</option>
                            <!-- Opciones de meses dinámicas -->
                        </select>
                        <select id="balanceComparisonYearSelect">
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <!-- Opciones de años dinámicas -->
                        </select>
                    </div>
                </div>
                <div class="chart-section">
                    <div class="chart-container">
                        <canvas id="balanceComparisonChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- --- GRÁFICO 3: Ingresos estimados vs reales (Barras comparativo) --- -->
            <div class="card" data-aos="fade-up" data-aos-delay="100">
                <div class="card-header">
                    <h2 class="card-title">Ingresos Estimados vs Reales 💰</h2>
                    <div class="chart-controls">
                        <select id="incomeComparisonMonthSelect">
                            <option value="2025-07">Julio 2025</option>
                            <option value="2025-06">Junio 2025</option>
                            <option value="2025-05">Mayo 2025</option>
                            <!-- Opciones de meses dinámicas -->
                        </select>
                        <select id="incomeComparisonYearSelect">
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <!-- Opciones de años dinámicas -->
                        </select>
                    </div>
                </div>
                <div class="chart-section">
                    <div class="chart-container">
                        <canvas id="incomeComparisonChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- --- GRÁFICO 4: Evolución del balance mensual (Líneas anual) --- -->
            <div class="card" data-aos="fade-up" data-aos-delay="150">
                <div class="card-header">
                    <h2 class="card-title">Evolución del Balance Mensual 📈</h2>
                    <div class="chart-controls">
                        <select id="monthlyBalanceEvolutionYearSelect">
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <!-- Opciones de años dinámicas -->
                        </select>
                    </div>
                </div>
                <div class="chart-section">
                    <div class="chart-container">
                        <canvas id="monthlyBalanceEvolutionChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- --- GRÁFICO 5: Distribución de gastos vs ingresos (Barras) --- -->
            <div class="card" data-aos="fade-up" data-aos-delay="200">
                <div class="card-header">
                    <h2 class="card-title">Distribución de Gastos vs Ingresos 📊</h2>
                    <div class="chart-controls">
                        <select id="incomeExpenseDistributionMonthSelect">
                            <option value="2025-07">Julio 2025</option>
                            <option value="2025-06">Junio 2025</option>
                            <option value="2025-05">Mayo 2025</option>
                            <!-- Opciones de meses dinámicas -->
                        </select>
                        <select id="incomeExpenseDistributionYearSelect">
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <!-- Opciones de años dinámicas -->
                        </select>
                    </div>
                </div>
                <div class="chart-section">
                    <div class="chart-container">
                        <canvas id="incomeExpenseDistributionChart"></canvas>
                    </div>
                </div>
            </div>
        `

        // Lógica para inicializar gráficos
        // --- Lógica de inicialización de Chart.js (PLACEHOLDER) ---
        // GRÁFICO 1: Gastos por categoría del mes (Dona/Pastel)
        const ctxCategoryExpenses = analysis.querySelector('#categoryExpensesChart');
        if (ctxCategoryExpenses) {
            new Chart(ctxCategoryExpenses, {
                type: 'doughnut',
                data: {
                    labels: ['Alimentación', 'Transporte', 'Ocio', 'Servicios', 'Salud', 'Educación', 'Otros'],
                    datasets: [{
                        label: 'Gastos por Categoría',
                        data: [300, 150, 80, 200, 100, 50, 70],
                        backgroundColor: [
                            '#FF7043', '#AB47BC', '#26C6DA', '#FFCA28', '#EF5350', '#7986CB', '#9E9E9E'
                        ],
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right' },
                        title: { display: false }
                    }
                }
            });
        }

        // GRÁFICO 2: Balance real vs estimado (Líneas mensual)
        const ctxBalanceComparison = analysis.querySelector('#balanceComparisonChart');
        if (ctxBalanceComparison) {
            new Chart(ctxBalanceComparison, {
                type: 'line',
                data: {
                    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
                    datasets: [{
                        label: 'Balance Real',
                        data: [1200, 1150, 1300, 1250],
                        borderColor: 'var(--primary-color)',
                        backgroundColor: 'rgba(106, 110, 224, 0.2)',
                        tension: 0.3,
                        fill: true
                    }, {
                        label: 'Balance Estimado',
                        data: [1250, 1200, 1280, 1230],
                        borderColor: 'var(--text-light)',
                        borderDash: [5, 5],
                        tension: 0.3,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: false }
                    }
                }
            });
        }

        // GRÁFICO 3: Ingresos estimados vs reales (Barras comparativo)
        const ctxIncomeComparison = analysis.querySelector('#incomeComparisonChart');
        if (ctxIncomeComparison) {
            new Chart(ctxIncomeComparison, {
                type: 'bar',
                data: {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                    datasets: [{
                        label: 'Ingresos Estimados',
                        data: [1500, 1600, 1400, 1700, 1550, 1800],
                        backgroundColor: 'rgba(76, 175, 80, 0.7)', // success-color con opacidad
                        borderColor: 'var(--success-color)',
                        borderWidth: 1
                    }, {
                        label: 'Ingresos Reales',
                        data: [1450, 1650, 1380, 1720, 1500, 1780],
                        backgroundColor: 'rgba(106, 110, 224, 0.7)', // primary-color con opacidad
                        borderColor: 'var(--primary-color)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: false }
                    }
                }
            });
        }

        // GRÁFICO 4: Evolución del balance mensual (Líneas anual)
        const ctxMonthlyBalanceEvolution = analysis.querySelector('#monthlyBalanceEvolutionChart');
        if (ctxMonthlyBalanceEvolution) {
            new Chart(ctxMonthlyBalanceEvolution, {
                type: 'line',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                    datasets: [{
                        label: 'Balance Mensual',
                        data: [500, 600, 450, 700, 550, 800, 650, 720, 680, 750, 820, 900],
                        borderColor: 'var(--primary-color)',
                        backgroundColor: 'rgba(106, 110, 224, 0.2)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        legend: { display: false },
                        title: { display: false }
                    }
                }
            });
        }

        // GRÁFICO 5: Distribución de gastos vs ingresos (Barras)
        const ctxIncomeExpenseDistribution = analysis.querySelector('#incomeExpenseDistributionChart');
        if (ctxIncomeExpenseDistribution) {
            new Chart(ctxIncomeExpenseDistribution, {
                type: 'bar',
                data: {
                    labels: ['Ingresos', 'Gastos'],
                    datasets: [{
                        label: 'Monto',
                        data: [1500, 850], // Ejemplo: Ingresos $1500, Gastos $850
                        backgroundColor: [
                            'var(--success-color)', // Ingresos
                            'var(--danger-color)'   // Gastos
                        ],
                        borderColor: [
                            'var(--success-color)',
                            'var(--danger-color)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        legend: { display: false },
                        title: { display: false }
                    }
                }
            });
        }

        return analysis
    }
}