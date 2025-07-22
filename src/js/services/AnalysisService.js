import { TransactionsService } from './TransactionsService.js'
import { CategoriesService } from './CategoriesService.js'
import { BudgetsService } from './BudgetsService.js'
import { UIService } from './UIService.js'

export class AnalysisService {
    static charts = {}
    static hungerGamesTheme = {
        colors: {
            primary: '#FFD700',
            flame: '#FF9800',
            flame2: '#FF5722',
            districts: [
                '#FFD700', '#FF9800', '#FF5722', '#D32F2F',
                '#4CAF50', '#2196F3', '#9C27B0', '#607D8B',
                '#795548', '#FFC107', '#E91E63', '#3F51B5'
            ],
            background: 'rgba(255, 215, 0, 0.1)',
            border: '#FFD700',
            grid: 'rgba(255, 215, 0, 0.2)'
        },
        fonts: {
            title: 'Orbitron',
            body: 'Roboto Condensed'
        }
    }

    static async getCategoryExpensesData(monthYear, transactions, categories) {
        const [year, month] = monthYear.split('-')
        const filtered = transactions.filter(t => 
            t.type === 'expense' && t.date.startsWith(`${year}-${month}`)
        )
        
        const categoryData = categories.map((cat, index) => {
            const sum = filtered
                .filter(t => t.categoryId === cat.id)
                .reduce((acc, t) => acc + parseFloat(t.amount), 0)
            return {
                category: cat.name,
                amount: sum,
                color: cat.color
            }
        }).filter(item => item.amount > 0)
        
        return {
            labels: categoryData.map(item => item.category),
            data: categoryData.map(item => item.amount),
            backgroundColor: categoryData.map(item => item.color),
            borderColor: categoryData.map(() => this.hungerGamesTheme.colors.border),
            borderWidth: 2
        }
    }

    static async getBalanceComparisonData(monthYear, transactions, budgets) {
        const [year, month] = monthYear.split('-')
        const paddedMonth = month.padStart(2, '0')
        const filtered = transactions.filter(t => t.date.startsWith(`${year}-${paddedMonth}`))
        
        // Calcular balance por semanas
        const weeks = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4']
        const realData = weeks.map((_, weekIndex) => {
            const start = weekIndex * 7 + 1
            const end = (weekIndex + 1) * 7
            
            return filtered.filter(t => {
                const day = parseInt(t.date.split('-')[2], 10)
                return day >= start && day <= end
            }).reduce((acc, t) => {
                return acc + (t.type === 'income' ? parseFloat(t.amount) : -parseFloat(t.amount))
            }, 0)
        })
        
        // Calcular presupuesto estimado por semanas basado en los presupuestos del mes
        const monthlyBudgets = budgets.filter(b => 
            b.year == year && b.month == paddedMonth
        )
        
        // Calcular balance estimado mensual
        let estimatedIncomeTotal = 0
        let estimatedExpenseTotal = 0
        
        monthlyBudgets.forEach(budget => {
            if (budget.type === 'income') {
                estimatedIncomeTotal += parseFloat(budget.limit)
            } else if (budget.type === 'expense') {
                estimatedExpenseTotal += parseFloat(budget.limit)
            }
        })
        
        const estimatedMonthlyBalance = estimatedIncomeTotal - estimatedExpenseTotal
        // Distribuir el balance estimado mensual entre las 4 semanas
        const estimatedWeeklyBalance = estimatedMonthlyBalance / 4
        const budgetData = [estimatedWeeklyBalance, estimatedWeeklyBalance, estimatedWeeklyBalance, estimatedWeeklyBalance]
        
        return {
            labels: weeks,
            real: realData,
            estimated: budgetData
        }
    }

    static async getIncomeComparisonData(monthYear, transactions, budgets) {
        const [year, month] = monthYear.split('-')
        const currentMonth = parseInt(month, 10)
        
        // Obtener últimos 6 meses incluyendo el actual
        const monthsData = []
        for (let i = 5; i >= 0; i--) {
            const targetMonth = currentMonth - i
            const targetYear = targetMonth <= 0 ? year - 1 : year
            const adjustedMonth = targetMonth <= 0 ? 12 + targetMonth : targetMonth
            const paddedMonth = adjustedMonth.toString().padStart(2, '0')
            
            const monthStr = `${targetYear}-${paddedMonth}`
            const realIncome = transactions
                .filter(t => t.type === 'income' && t.date.startsWith(monthStr))
                .reduce((acc, t) => acc + parseFloat(t.amount), 0)
            
            // Calcular ingresos presupuestados para ese mes
            const monthlyIncomeBudgets = budgets.filter(b => 
                b.year == targetYear && b.month == paddedMonth && b.type === 'income'
            )
            const budgetedIncome = monthlyIncomeBudgets.reduce((acc, b) => acc + parseFloat(b.limit), 0)
            
            monthsData.push({
                label: this.formatMonth(monthStr),
                real: realIncome,
                estimated: budgetedIncome
            })
        }
        
        return {
            labels: monthsData.map(m => m.label),
            real: monthsData.map(m => m.real),
            estimated: monthsData.map(m => m.estimated)
        }
    }

    static async getMonthlyBalanceEvolutionData(year, transactions) {
        const monthsData = []
        
        for (let month = 1; month <= 12; month++) {
            const paddedMonth = month.toString().padStart(2, '0')
            const monthStr = `${year}-${paddedMonth}`
            
            const monthlyBalance = transactions
                .filter(t => t.date.startsWith(monthStr))
                .reduce((acc, t) => {
                    return acc + (t.type === 'income' ? parseFloat(t.amount) : -parseFloat(t.amount))
                }, 0)
            
            monthsData.push({
                label: this.formatMonth(monthStr),
                balance: monthlyBalance
            })
        }
        
        return {
            labels: monthsData.map(m => m.label),
            data: monthsData.map(m => m.balance)
        }
    }

    static async getIncomeExpenseDistributionData(monthYear, transactions) {
        const [year, month] = monthYear.split('-')
        const paddedMonth = month.padStart(2, '0')
        const filtered = transactions.filter(t => t.date.startsWith(`${year}-${paddedMonth}`))
        
        const income = filtered
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + parseFloat(t.amount), 0)
        
        const expense = filtered
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + parseFloat(t.amount), 0)
        
        return {
            labels: ['Ingresos 💰', 'Gastos 🔥'],
            data: [income, expense],
            backgroundColor: [this.hungerGamesTheme.colors.primary, this.hungerGamesTheme.colors.flame2],
            borderColor: [this.hungerGamesTheme.colors.border, this.hungerGamesTheme.colors.flame],
            borderWidth: 2
        }
    }

    static async ensureChartJS(retries = 5) {
        for (let i = 0; i < retries; i++) {
            if (typeof window.Chart !== 'undefined') {
                return true
            }
            console.warn(`Chart.js no disponible, reintentando... (${i + 1}/${retries})`)
            await new Promise(resolve => setTimeout(resolve, 100))
        }
        console.error('Chart.js no está disponible después de varios intentos')
        return false
    }

    static async createCategoryExpensesChart(canvasId, data) {
        if (!(await this.ensureChartJS())) return null
        
        const ctx = document.getElementById(canvasId)
        if (!ctx) return null
        
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy()
        }
        
        this.charts[canvasId] = new window.Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Gastos por Categoría',
                    data: data.data,
                    backgroundColor: data.backgroundColor,
                    borderColor: data.borderColor,
                    borderWidth: data.borderWidth,
                    hoverOffset: 8,
                    hoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#E0E0E0',
                            font: {
                                family: this.hungerGamesTheme.fonts.body,
                                size: 12,
                                weight: 'bold'
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                        titleColor: '#FFD700',
                        bodyColor: '#E0E0E0',
                        borderColor: '#FFD700',
                        borderWidth: 1,
                        titleFont: {
                            family: this.hungerGamesTheme.fonts.title,
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: this.hungerGamesTheme.fonts.body,
                            size: 12
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1000
                }
            }
        })
        
        return this.charts[canvasId]
    }

    static async createBalanceComparisonChart(canvasId, data) {
        if (!(await this.ensureChartJS())) return null
        
        const ctx = document.getElementById(canvasId)
        if (!ctx) return null
        
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy()
        }
        
        this.charts[canvasId] = new window.Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Balance Real 🏹',
                        data: data.real,
                        borderColor: this.hungerGamesTheme.colors.primary,
                        backgroundColor: this.hungerGamesTheme.colors.background,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: this.hungerGamesTheme.colors.primary,
                        pointBorderColor: '#1a1a1a',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        borderWidth: 3
                    },
                    {
                        label: 'Balance Estimado 🎯',
                        data: data.estimated,
                        borderColor: this.hungerGamesTheme.colors.flame,
                        borderDash: [10, 5],
                        tension: 0.4,
                        fill: false,
                        pointBackgroundColor: this.hungerGamesTheme.colors.flame,
                        pointBorderColor: '#1a1a1a',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        borderWidth: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: this.hungerGamesTheme.colors.grid,
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#B0B0B0',
                            font: {
                                family: this.hungerGamesTheme.fonts.body,
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: this.hungerGamesTheme.colors.grid,
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#B0B0B0',
                            font: {
                                family: this.hungerGamesTheme.fonts.body,
                                size: 11
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#E0E0E0',
                            font: {
                                family: this.hungerGamesTheme.fonts.body,
                                size: 12,
                                weight: 'bold'
                            },
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                        titleColor: '#FFD700',
                        bodyColor: '#E0E0E0',
                        borderColor: '#FFD700',
                        borderWidth: 1
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        })
        
        return this.charts[canvasId]
    }

    static async createIncomeComparisonChart(canvasId, data) {
        if (!(await this.ensureChartJS())) return null
        
        const ctx = document.getElementById(canvasId)
        if (!ctx) return null
        
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy()
        }
        
        this.charts[canvasId] = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Ingresos Estimados 🎯',
                        data: data.estimated,
                        backgroundColor: 'rgba(255, 152, 0, 0.7)',
                        borderColor: this.hungerGamesTheme.colors.flame,
                        borderWidth: 2,
                        borderRadius: 4,
                        borderSkipped: false
                    },
                    {
                        label: 'Ingresos Reales 💰',
                        data: data.real,
                        backgroundColor: 'rgba(255, 215, 0, 0.8)',
                        borderColor: this.hungerGamesTheme.colors.primary,
                        borderWidth: 2,
                        borderRadius: 4,
                        borderSkipped: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: this.hungerGamesTheme.colors.grid,
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#B0B0B0',
                            font: {
                                family: this.hungerGamesTheme.fonts.body,
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#B0B0B0',
                            font: {
                                family: this.hungerGamesTheme.fonts.body,
                                size: 11
                            },
                            maxRotation: 45
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#E0E0E0',
                            font: {
                                family: this.hungerGamesTheme.fonts.body,
                                size: 12,
                                weight: 'bold'
                            },
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                        titleColor: '#FFD700',
                        bodyColor: '#E0E0E0',
                        borderColor: '#FFD700',
                        borderWidth: 1
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutBounce'
                }
            }
        })
        
        return this.charts[canvasId]
    }

    static async createMonthlyBalanceEvolutionChart(canvasId, data) {
        if (!(await this.ensureChartJS())) return null
        
        const ctx = document.getElementById(canvasId)
        if (!ctx) return null
        
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy()
        }
        
        this.charts[canvasId] = new window.Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Balance Mensual 📈',
                    data: data.data,
                    borderColor: this.hungerGamesTheme.colors.primary,
                    backgroundColor: this.hungerGamesTheme.colors.background,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: this.hungerGamesTheme.colors.primary,
                    pointBorderColor: '#1a1a1a',
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    borderWidth: 3,
                    segment: {
                        borderColor: (ctx) => {
                            return ctx.p0.parsed.y >= 0 ? this.hungerGamesTheme.colors.primary : this.hungerGamesTheme.colors.flame2
                        }
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: this.hungerGamesTheme.colors.grid,
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#B0B0B0',
                            font: {
                                family: this.hungerGamesTheme.fonts.body,
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#B0B0B0',
                            font: {
                                family: this.hungerGamesTheme.fonts.body,
                                size: 11
                            },
                            maxRotation: 45
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                        titleColor: '#FFD700',
                        bodyColor: '#E0E0E0',
                        borderColor: '#FFD700',
                        borderWidth: 1
                    }
                },
                animation: {
                    duration: 1200,
                    easing: 'easeInOutQuart'
                }
            }
        })
        
        return this.charts[canvasId]
    }

    static async createIncomeExpenseDistributionChart(canvasId, data) {
        if (!(await this.ensureChartJS())) return null
        
        const ctx = document.getElementById(canvasId)
        if (!ctx) return null
        
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy()
        }
        
        this.charts[canvasId] = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Monto',
                    data: data.data,
                    backgroundColor: data.backgroundColor,
                    borderColor: data.borderColor,
                    borderWidth: data.borderWidth,
                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: 80
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: this.hungerGamesTheme.colors.grid,
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#B0B0B0',
                            font: {
                                family: this.hungerGamesTheme.fonts.body,
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#B0B0B0',
                            font: {
                                family: this.hungerGamesTheme.fonts.body,
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                        titleColor: '#FFD700',
                        bodyColor: '#E0E0E0',
                        borderColor: '#FFD700',
                        borderWidth: 1
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutElastic'
                }
            }
        })
        
        return this.charts[canvasId]
    }

    static async updateChart(chartType, canvasId, filterData = {}) {
        try {
            const [transactions, categories, budgets] = await Promise.all([
                TransactionsService.getTransactions(),
                CategoriesService.getCategories(),
                BudgetsService.getBudgets()
            ])
            
            let data = null
            let chart = null
            
            switch (chartType) {
                case 'categoryExpenses':
                    data = await this.getCategoryExpensesData(filterData.monthYear, transactions, categories)
                    chart = await this.createCategoryExpensesChart(canvasId, data)
                    break
                    
                case 'balanceComparison':
                    data = await this.getBalanceComparisonData(filterData.monthYear, transactions, budgets)
                    chart = await this.createBalanceComparisonChart(canvasId, data)
                    break
                    
                case 'incomeComparison':
                    data = await this.getIncomeComparisonData(filterData.monthYear, transactions, budgets)
                    chart = await this.createIncomeComparisonChart(canvasId, data)
                    break
                    
                case 'monthlyEvolution':
                    data = await this.getMonthlyBalanceEvolutionData(filterData.year, transactions)
                    chart = await this.createMonthlyBalanceEvolutionChart(canvasId, data)
                    break
                    
                case 'incomeExpenseDistribution':
                    data = await this.getIncomeExpenseDistributionData(filterData.monthYear, transactions)
                    chart = await this.createIncomeExpenseDistributionChart(canvasId, data)
                    break
            }
            
            return chart
        } catch (error) {
            console.error(`Error updating chart ${chartType}:`, error)
            return null
        }
    }

    static async initializeAllCharts(filterValues) {
        try {
            // Asegurar que Chart.js esté disponible antes de proceder
            if (!(await this.ensureChartJS())) {
                console.error('No se puede inicializar los gráficos: Chart.js no está disponible')
                return []
            }

            // Destruir gráficos existentes primero
            this.destroyAllCharts()

            // Pequeña espera para asegurar que el DOM esté listo
            await new Promise(resolve => setTimeout(resolve, 150))

            const charts = {
                categoryExpenses: this.updateChart('categoryExpenses', 'categoryExpensesChart', { monthYear: filterValues.monthYear1 }),
                balanceComparison: this.updateChart('balanceComparison', 'balanceComparisonChart', { monthYear: filterValues.monthYear2 }),
                incomeComparison: this.updateChart('incomeComparison', 'incomeComparisonChart', { monthYear: filterValues.monthYear3 }),
                monthlyEvolution: this.updateChart('monthlyEvolution', 'monthlyBalanceEvolutionChart', { year: filterValues.year4 }),
                incomeExpenseDistribution: this.updateChart('incomeExpenseDistribution', 'incomeExpenseDistributionChart', { monthYear: filterValues.monthYear5 })
            }
            
            return await Promise.all(Object.values(charts))
        } catch (error) {
            console.error('Error al inicializar los gráficos:', error)
            return []
        }
    }

    static getDateOptions(transactions) {
        const monthYearOptions = new Set()
        const yearOptions = new Set()
        const yearMonthMap = {}
        
        transactions.forEach(t => {
            const [year, month] = t.date.split('-')
            monthYearOptions.add(`${year}-${month}`)
            yearOptions.add(year)
            
            // Agregar mes al año correspondiente
            if (!yearMonthMap[year]) {
                yearMonthMap[year] = new Set()
            }
            yearMonthMap[year].add(month)
        })
        
        // Convertir los sets a arrays ordenados
        Object.keys(yearMonthMap).forEach(year => {
            yearMonthMap[year] = Array.from(yearMonthMap[year]).sort()
        })
        
        const dateOptions = {
            monthYear: Array.from(monthYearOptions).sort().reverse(),
            year: Array.from(yearOptions).sort().reverse(),
            yearMonthMap: yearMonthMap,
            allMonthYears: Array.from(monthYearOptions).sort().reverse()
        }

        return dateOptions
    }

    static formatMonth(monthYear) {
        const [year, month] = monthYear.split('-')
        return UIService.getMonthName(parseInt(month, 10))
    }

    static formatYear(val) { return val }

    static destroyAllCharts() {
        Object.keys(this.charts).forEach(key => {
            if (this.charts[key] && typeof this.charts[key].destroy === 'function') {
                this.charts[key].destroy()
            }
        })
        this.charts = {}
    }
}
