import { TransactionsService } from '../../services/TransactionsService.js'
import { CategoriesService } from '../../services/CategoriesService.js'
import DB from '../../classes/DB.js'

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
                        <select id="categoryExpensesMonthSelect"></select>
                        <select id="categoryExpensesYearSelect"></select>
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
                        <select id="balanceComparisonMonthSelect"></select>
                        <select id="balanceComparisonYearSelect"></select>
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
                        <select id="incomeComparisonMonthSelect"></select>
                        <select id="incomeComparisonYearSelect"></select>
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
                        <select id="monthlyBalanceEvolutionYearSelect"></select>
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
                        <select id="incomeExpenseDistributionMonthSelect"></select>
                        <select id="incomeExpenseDistributionYearSelect"></select>
                    </div>
                </div>
                <div class="chart-section">
                    <div class="chart-container">
                        <canvas id="incomeExpenseDistributionChart"></canvas>
                    </div>
                </div>
            </div>
        `

        // Helper: Get all transactions, categories, and estimates
        const [transactions, categories] = await Promise.all([
            TransactionsService.getTransactions(),
            CategoriesService.getCategories()
        ])
        let estimates = []
        try {
            const db = new DB('finanzas-personales', 'estimates')
            estimates = await db.getAllItems()
        } catch (e) {
            estimates = []
        }

        // Helper: Get all months/years present in transactions
        function getMonthYearOptions(transactions) {
            const options = new Set()
            transactions.forEach(t => {
                const [year, month] = t.date.split('-')
                options.add(`${year}-${month}`)
            })
            return Array.from(options).sort().reverse()
        }
        function getYearOptions(transactions) {
            const options = new Set()
            transactions.forEach(t => {
                const year = t.date.split('-')[0]
                options.add(year)
            })
            return Array.from(options).sort().reverse()
        }

        // Fill selects with real options
        const months = getMonthYearOptions(transactions)
        const years = getYearOptions(transactions)
        function fillSelect(select, options, formatFn) {
            select.innerHTML = options.map(opt => `<option value="${opt}">${formatFn ? formatFn(opt) : opt}</option>`).join('')
        }
        // Format helpers
        function formatMonthYear(val) {
            const [year, month] = val.split('-')
            const monthsES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
            return `${monthsES[parseInt(month,10)-1]} ${year}`
        }
        function formatYear(val) { return val }

        // Fill all selects
        fillSelect(analysis.querySelector('#categoryExpensesMonthSelect'), months, formatMonthYear)
        fillSelect(analysis.querySelector('#categoryExpensesYearSelect'), years, formatYear)
        fillSelect(analysis.querySelector('#balanceComparisonMonthSelect'), months, formatMonthYear)
        fillSelect(analysis.querySelector('#balanceComparisonYearSelect'), years, formatYear)
        fillSelect(analysis.querySelector('#incomeComparisonMonthSelect'), months, formatMonthYear)
        fillSelect(analysis.querySelector('#incomeComparisonYearSelect'), years, formatYear)
        fillSelect(analysis.querySelector('#monthlyBalanceEvolutionYearSelect'), years, formatYear)
        fillSelect(analysis.querySelector('#incomeExpenseDistributionMonthSelect'), months, formatMonthYear)
        fillSelect(analysis.querySelector('#incomeExpenseDistributionYearSelect'), years, formatYear)

        // Helper: Aggregate data for each chart
        function getCategoryExpensesData(monthYear) {
            const [year, month] = monthYear.split('-')
            const filtered = transactions.filter(t => t.type === 'expense' && t.date.startsWith(`${year}-${month}`))
            const data = categories.map(cat => {
                const sum = filtered.filter(t => t.categoryId === cat.id).reduce((acc, t) => acc + parseFloat(t.amount), 0)
                return sum
            })
            return {
                labels: categories.map(cat => cat.name),
                data,
                backgroundColor: categories.map(cat => cat.color)
            }
        }
        function getBalanceComparisonData(monthYear) {
            const [year, month] = monthYear.split('-')
            // Real: sum by week
            const filtered = transactions.filter(t => t.date.startsWith(`${year}-${month}`))
            const weeks = [1,2,3,4]
            const real = weeks.map(week => {
                // Assume week 1: days 1-7, week 2: 8-14, etc.
                const start = (week-1)*7+1
                const end = week*7
                return filtered.filter(t => {
                    const day = parseInt(t.date.split('-')[2],10)
                    return day >= start && day <= end
                }).reduce((acc, t) => acc + (t.type==='income'?parseFloat(t.amount):-parseFloat(t.amount)), 0)
            })
            // Estimado: buscar en estimates si hay para ese mes
            let estimado = [0,0,0,0]
            const est = estimates.find(e => e.year == year && e.month == month)
            if (est && est.weeklyBalance) estimado = est.weeklyBalance
            return {
                labels: ['Semana 1','Semana 2','Semana 3','Semana 4'],
                real,
                estimado
            }
        }
        function getIncomeComparisonData(monthYear) {
            const [year, month] = monthYear.split('-')
            // Real: sum incomes for each month up to selected
            const monthsArr = Array.from({length:6}, (_,i) => (parseInt(month,10)-5+i).toString().padStart(2,'0'))
            const labels = monthsArr.map(m => formatMonthYear(`${year}-${m}`))
            const real = monthsArr.map(m => {
                return transactions.filter(t => t.type==='income' && t.date.startsWith(`${year}-${m}`)).reduce((acc, t) => acc + parseFloat(t.amount), 0)
            })
            // Estimado: buscar en estimates si hay para esos meses
            const estimado = monthsArr.map(m => {
                const est = estimates.find(e => e.year == year && e.month == m)
                return est && est.income ? est.income : 0
            })
            return { labels, real, estimado }
        }
        function getMonthlyBalanceEvolutionData(year) {
            const monthsArr = Array.from({length:12}, (_,i) => (i+1).toString().padStart(2,'0'))
            const labels = monthsArr.map(m => formatMonthYear(`${year}-${m}`))
            const data = monthsArr.map(m => {
                const filtered = transactions.filter(t => t.date.startsWith(`${year}-${m}`))
                return filtered.reduce((acc, t) => acc + (t.type==='income'?parseFloat(t.amount):-parseFloat(t.amount)), 0)
            })
            return { labels, data }
        }
        function getIncomeExpenseDistributionData(monthYear) {
            const [year, month] = monthYear.split('-')
            const filtered = transactions.filter(t => t.date.startsWith(`${year}-${month}`))
            const income = filtered.filter(t => t.type==='income').reduce((acc, t) => acc + parseFloat(t.amount), 0)
            const expense = filtered.filter(t => t.type==='expense').reduce((acc, t) => acc + parseFloat(t.amount), 0)
            return { labels: ['Ingresos','Gastos'], data: [income, expense] }
        }

        // Chart.js initialization with real data
        // 1. Gastos por categoría del mes
        const ctxCategoryExpenses = analysis.querySelector('#categoryExpensesChart')
        const monthYear1 = months[0] || '2025-07'
        const catData = getCategoryExpensesData(monthYear1)
        if (ctxCategoryExpenses) {
            new Chart(ctxCategoryExpenses, {
                type: 'doughnut',
                data: {
                    labels: catData.labels,
                    datasets: [{
                        label: 'Gastos por Categoría',
                        data: catData.data,
                        backgroundColor: catData.backgroundColor,
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
            })
        }
        // 2. Balance real vs estimado
        const ctxBalanceComparison = analysis.querySelector('#balanceComparisonChart')
        const monthYear2 = months[0] || '2025-07'
        const balData = getBalanceComparisonData(monthYear2)
        if (ctxBalanceComparison) {
            new Chart(ctxBalanceComparison, {
                type: 'line',
                data: {
                    labels: balData.labels,
                    datasets: [
                        {
                            label: 'Balance Real',
                            data: balData.real,
                            borderColor: 'var(--primary-color)',
                            backgroundColor: 'rgba(106, 110, 224, 0.2)',
                            tension: 0.3,
                            fill: true
                        },
                        {
                            label: 'Balance Estimado',
                            data: balData.estimado,
                            borderColor: 'var(--text-light)',
                            borderDash: [5,5],
                            tension: 0.3,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } },
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: false }
                    }
                }
            })
        }
        // 3. Ingresos estimados vs reales
        const ctxIncomeComparison = analysis.querySelector('#incomeComparisonChart')
        const monthYear3 = months[0] || '2025-07'
        const incData = getIncomeComparisonData(monthYear3)
        if (ctxIncomeComparison) {
            new Chart(ctxIncomeComparison, {
                type: 'bar',
                data: {
                    labels: incData.labels,
                    datasets: [
                        {
                            label: 'Ingresos Estimados',
                            data: incData.estimado,
                            backgroundColor: 'rgba(76, 175, 80, 0.7)',
                            borderColor: 'var(--success-color)',
                            borderWidth: 1
                        },
                        {
                            label: 'Ingresos Reales',
                            data: incData.real,
                            backgroundColor: 'rgba(106, 110, 224, 0.7)',
                            borderColor: 'var(--primary-color)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } },
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: false }
                    }
                }
            })
        }
        // 4. Evolución del balance mensual
        const ctxMonthlyBalanceEvolution = analysis.querySelector('#monthlyBalanceEvolutionChart')
        const year4 = years[0] || '2025'
        const balEvoData = getMonthlyBalanceEvolutionData(year4)
        if (ctxMonthlyBalanceEvolution) {
            new Chart(ctxMonthlyBalanceEvolution, {
                type: 'line',
                data: {
                    labels: balEvoData.labels,
                    datasets: [
                        {
                            label: 'Balance Mensual',
                            data: balEvoData.data,
                            borderColor: 'var(--primary-color)',
                            backgroundColor: 'rgba(106, 110, 224, 0.2)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } },
                    plugins: {
                        legend: { display: false },
                        title: { display: false }
                    }
                }
            })
        }
        // 5. Distribución de gastos vs ingresos
        const ctxIncomeExpenseDistribution = analysis.querySelector('#incomeExpenseDistributionChart')
        const monthYear5 = months[0] || '2025-07'
        const distData = getIncomeExpenseDistributionData(monthYear5)
        if (ctxIncomeExpenseDistribution) {
            new Chart(ctxIncomeExpenseDistribution, {
                type: 'bar',
                data: {
                    labels: distData.labels,
                    datasets: [
                        {
                            label: 'Monto',
                            data: distData.data,
                            backgroundColor: [
                                'var(--success-color)',
                                'var(--danger-color)'
                            ],
                            borderColor: [
                                'var(--success-color)',
                                'var(--danger-color)'
                            ],
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } },
                    plugins: {
                        legend: { display: false },
                        title: { display: false }
                    }
                }
            })
        }
        return analysis
    }
}