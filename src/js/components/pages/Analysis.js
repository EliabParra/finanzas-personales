import { TransactionsService } from '../../services/TransactionsService.js'
import { AnalysisService } from '../../services/AnalysisService.js'

export class Analysis {
    async render() {
        const analysisPage = document.createElement('div')
        analysisPage.classList.add('analysis')
        analysisPage.dataset.page = 'analysis'
        analysisPage.innerHTML = `
            <!-- --- GRÁFICO 1: Gastos por categoría del mes (Dona/Pastel) --- -->
            <div class="card" data-aos="fade-up">
                <div class="card-header">
                    <h2 class="card-title">Gastos por Categoría del Mes 🍩</h2>
                    <div class="chart-controls">
                        <select id="categoryExpensesMonthSelect"></select>
                        <select id="categoryExpensesYearSelect"></select>
                    </div>
                </div>
                <div class="chart-section" style="height: 400px; position: relative;">
                    <canvas id="categoryExpensesChart"></canvas>
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
                <div class="chart-section" style="height: 400px; position: relative;">
                    <canvas id="balanceComparisonChart"></canvas>
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
                <div class="chart-section" style="height: 400px; position: relative;">
                    <canvas id="incomeComparisonChart"></canvas>
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
                <div class="chart-section" style="height: 400px; position: relative;">
                    <canvas id="monthlyBalanceEvolutionChart"></canvas>
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
                <div class="chart-section" style="height: 400px; position: relative;">
                    <canvas id="incomeExpenseDistributionChart"></canvas>
                </div>
            </div>
        `

        const transactions = await TransactionsService.getTransactions()

        const dateOptions = AnalysisService.getDateOptions(transactions)
        const months = dateOptions.monthYear
        const years = dateOptions.year

        function fillSelect(select, options, formatFn) {
            select.innerHTML = options.map(opt => `<option value="${opt}">${formatFn ? formatFn(opt) : opt}</option>`).join('')
        }

        fillSelect(analysisPage.querySelector('#categoryExpensesMonthSelect'), months, AnalysisService.formatMonth)
        fillSelect(analysisPage.querySelector('#categoryExpensesYearSelect'), years, AnalysisService.formatYear)
        fillSelect(analysisPage.querySelector('#balanceComparisonMonthSelect'), months, AnalysisService.formatMonth)
        fillSelect(analysisPage.querySelector('#balanceComparisonYearSelect'), years, AnalysisService.formatYear)
        fillSelect(analysisPage.querySelector('#incomeComparisonMonthSelect'), months, AnalysisService.formatMonth)
        fillSelect(analysisPage.querySelector('#incomeComparisonYearSelect'), years, AnalysisService.formatYear)
        fillSelect(analysisPage.querySelector('#monthlyBalanceEvolutionYearSelect'), years, AnalysisService.formatYear)
        fillSelect(analysisPage.querySelector('#incomeExpenseDistributionMonthSelect'), months, AnalysisService.formatMonth)
        fillSelect(analysisPage.querySelector('#incomeExpenseDistributionYearSelect'), years, AnalysisService.formatYear)
        
        const filterValues = {
            monthYear1: months[0] || '2025-07',
            monthYear2: months[0] || '2025-07',
            monthYear3: months[0] || '2025-07',
            year4: years[0] || '2025',
            monthYear5: months[0] || '2025-07'
        }
        
        // Destruir gráficos anteriores si existen
        AnalysisService.destroyAllCharts()
        
        // Inicializar gráficos después de que el elemento esté en el DOM
        setTimeout(async () => {
            await AnalysisService.initializeAllCharts(filterValues)
            // Agregar eventos para filtros interactivos
            this.addFilterEvents(analysisPage)
        }, 100)

        return analysisPage
    }

    addFilterEvents(analysisElement) {
        const chartFilters = [
            // Gráfico 1: Gastos por categoría
            { selectId: 'categoryExpensesMonthSelect', chartType: 'categoryExpenses', canvasId: 'categoryExpensesChart', filterKey: 'monthYear' },
            { selectId: 'categoryExpensesYearSelect', chartType: 'categoryExpenses', canvasId: 'categoryExpensesChart', filterKey: 'monthYear', formatter: v => `${v}-01` },
            
            // Gráfico 2: Balance real vs estimado
            { selectId: 'balanceComparisonMonthSelect', chartType: 'balanceComparison', canvasId: 'balanceComparisonChart', filterKey: 'monthYear' },
            { selectId: 'balanceComparisonYearSelect', chartType: 'balanceComparison', canvasId: 'balanceComparisonChart', filterKey: 'monthYear', formatter: v => `${v}-01` },
            
            // Gráfico 3: Ingresos estimados vs reales
            { selectId: 'incomeComparisonMonthSelect', chartType: 'incomeComparison', canvasId: 'incomeComparisonChart', filterKey: 'monthYear' },
            { selectId: 'incomeComparisonYearSelect', chartType: 'incomeComparison', canvasId: 'incomeComparisonChart', filterKey: 'monthYear', formatter: v => `${v}-12` },
            
            // Gráfico 4: Evolución del balance mensual
            { selectId: 'monthlyBalanceEvolutionYearSelect', chartType: 'monthlyEvolution', canvasId: 'monthlyBalanceEvolutionChart', filterKey: 'year' },
            
            // Gráfico 5: Distribución de gastos vs ingresos
            { selectId: 'incomeExpenseDistributionMonthSelect', chartType: 'incomeExpenseDistribution', canvasId: 'incomeExpenseDistributionChart', filterKey: 'monthYear' },
            { selectId: 'incomeExpenseDistributionYearSelect', chartType: 'incomeExpenseDistribution', canvasId: 'incomeExpenseDistributionChart', filterKey: 'monthYear', formatter: v => `${v}-01` }
        ];

        chartFilters.forEach(({ selectId, chartType, canvasId, filterKey, formatter }) => {
            const selectElement = analysisElement.querySelector(`#${selectId}`);
            if (selectElement) {
                selectElement.addEventListener('change', () => {
                    const value = formatter ? formatter(selectElement.value) : selectElement.value;
                    const filter = { [filterKey]: value };
                    AnalysisService.updateChart(chartType, canvasId, filter);
                });
            }
        });
    }
}
