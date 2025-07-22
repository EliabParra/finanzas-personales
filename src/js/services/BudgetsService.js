import DB from "../classes/DB.js"
import { TransactionsService } from "./TransactionsService.js"
import { CategoriesService } from "./CategoriesService.js"
import { UIService } from "./UIService.js"

export class BudgetsService {
    static async getBudgets() {
        try {
            const db = new DB('finanzas-personales', 'budgets')
            return await db.getAllItems()
        } catch (error) {
            throw new Error(`Error al obtener budgets: ${error}`)
            return []
        }
    }

    static async getBudget(id) {
        try {
            const db = new DB('finanzas-personales', 'budgets')
            return await db.getItem(id)
        } catch (error) {
            throw new Error(`Error al obtener budget: ${error}`)
            return {}
        }
    }

    static async addBudget(budgetData) {
        try {
            const db = new DB('finanzas-personales', 'budgets')
            await db.addItem(budgetData)
        } catch (error) {
            throw new Error(`Error al añadir budget: ${error}`)
        }
    }

    static async updateBudget(budget) {
        try {
            const db = new DB('finanzas-personales', 'budgets')
            await db.updateItem(budget)
        } catch (error) {
            throw new Error(`Error al actualizar budget: ${error}`)
        }
    }

    static async deleteBudget(id) {
        try {
            const db = new DB('finanzas-personales', 'budgets')
            await db.deleteItem(id)
        } catch (error) {
            throw new Error(`Error al eliminar budget: ${error}`)
        }
    }

    static async getBudgetsByCategory(categoryId) {
        try {
            const db = new DB('finanzas-personales', 'budgets')
            const budgets = await db.getAllItems()
            return budgets.filter(b => b.categoryId === categoryId)
        } catch (error) {
            throw new Error(`Error al obtener budgets por categoría: ${error}`)
            return []
        }
    }

    static async getBudgetsByMonth(month = UIService.getCurrentMonth(), year = UIService.getCurrentYear()) {
        const budgets = await this.getBudgets()
        return budgets.filter(b => b.month === month && b.year === year)
    }

    static async renderAllBudgets(budgets, budgetsTable, budgetModal) {
        if (!budgetsTable) return

        budgetsTable.innerHTML = `
            <thead>
                <tr>
                    <th>Mes</th>
                    <th>Categoría</th>
                    <th>Tipo</th>
                    <th>Estimado</th>
                    <th>Real</th>
                    <th>Desviación</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `

        if (budgets.length === 0) {
            budgetsTable.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-table-message">
                        <i class="fas fa-info-circle"></i> No hay presupuestos para mostrar
                    </td>
                </tr>
            `
            return
        }

        for (const b of budgets.sort((a, b) => new Date(b.date) - new Date(a.date))) {
            b.category = await CategoriesService.getCategory(b.categoryId)
            let transactions = await TransactionsService.getTransactions({
                category: b.categoryId,
                type: b.type,
                month: b.month,
                year: b.year
            })
            const real = transactions.reduce((acc, t) => acc + parseFloat(t.amount), 0)

            let deviation = 0
            let deviationClass = ''
            if (b.type === 'expense') {
                deviation = parseFloat(b.limit) - real
                deviationClass = deviation < 0 ? 'progress-red' : 'progress-green'
            } else {
                deviation = real - parseFloat(b.limit)
                deviationClass = deviation < 0 ? 'progress-red' : 'progress-green'
            }

            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${UIService.getMonthName(b.month)} ${b.year}</td>
                <td>${b.category.name}</td>
                <td>${b.type === 'income' ? 'Ingreso' : 'Egreso'}</td>
                <td>${UIService.formatCurrency(b.limit)}</td>
                <td>${UIService.formatCurrency(real)}</td>
                <td class="${deviationClass} ${deviation < 0 ? 'red' : 'green'}">
                    ${UIService.formatCurrency(Math.abs(deviation))} ${
                        b.type === 'expense' ? (deviation < 0 ? '(Excedido)' : '(Restante)') 
                        : (deviation < 0 ? '(Faltante)' : '(Sobrante)')
                    }
                </td>
                <td class="action-buttons">
                    <button class="budget-action-btn edit" title="Editar Presupuesto" data-budget-id="${b.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="budget-action-btn delete" title="Eliminar Presupuesto" data-budget-id="${b.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `
            budgetsTable.querySelector('tbody').appendChild(tr)
        }

        const editBudgetBtns = budgetsTable.querySelectorAll('.budget-action-btn.edit')
        const deleteBudgetBtns = budgetsTable.querySelectorAll('.budget-action-btn.delete')

        editBudgetBtns.forEach(editBudgetBtn => {
            editBudgetBtn.addEventListener('click', async () => {
                const id = parseInt(editBudgetBtn.dataset.budgetId)
                const budget = await this.getBudget(id)
                budgetModal.setData(budget)
                budgetModal.openModal()
            })
        })

        deleteBudgetBtns.forEach(deleteBudgetBtn => {
            deleteBudgetBtn.addEventListener('click', async () => {
                const id = parseInt(deleteBudgetBtn.dataset.budgetId)
                await this.deleteBudget(id)
                await this.renderAllBudgets(
                    await this.getBudgets(), 
                    budgetsTable, budgetModal
                )
                await this.renderBudgetsByCategory(budgetsGrid, budgetModal)
                await this.updateMonthlySummary()
            })
        })
    }

    static async renderBudgetsByCategory(budgetsGrid, budgetModal) {
        if (!budgetsGrid) return

        budgetsGrid.innerHTML = ''

        const budgets = await this.getBudgets()

        // Agrupar y sumar presupuestos por categoria, mes, año y tipo
        const grouped = {}
        for (const b of budgets) {
            const key = `${b.categoryId}_${b.month}_${b.year}_${b.type}`
            if (!grouped[key]) {
                grouped[key] = { ...b, limit: parseFloat(b.limit) }
            } else {
                grouped[key].limit += parseFloat(b.limit)
            }
        }

        for (const key in grouped) {
            const b = grouped[key]
            b.category = await CategoriesService.getCategory(b.categoryId)

            const transactions = await TransactionsService.getTransactions({
                category: b.categoryId,
                type: b.type,
                month: b.month,
                year: b.year
            })
            const real = transactions.reduce((acc, t) => acc + parseFloat(t.amount), 0)

            let deviation = 0
            let deviationClass = ''
            let progress = 0
            let restante = 0
            if (b.type === 'expense') {
                deviation = b.limit - real
                restante = deviation
                progress = b.limit > 0 ? Math.min(100, (real / b.limit) * 100) : 0
                deviationClass = deviation < 0 ? 'progress-red' : 'progress-green'
            } else {
                deviation = real - b.limit
                restante = deviation
                progress = b.limit > 0 ? Math.min(100, (real / b.limit) * 100) : 0
                deviationClass = deviation < 0 ? 'progress-red' : 'progress-green'
            }

            const budgetItem = document.createElement('div')
            budgetItem.classList.add('budget-item', deviationClass)
            budgetItem.dataset.budgetId = b.id

            budgetItem.innerHTML = `
                <div class="budget-item-header">
                    <div class="budget-category-icon" style="background-color: ${b.category.color}">
                        ${b.category.icon}
                    </div>
                    <div class="budget-info">
                        <div class="budget-category-name" style="color: ${b.category.color}">${b.category.name}</div>
                        <div class="budget-period">${UIService.getMonthName(b.month)} ${b.year}</div>
                        <div class="budget-type">${b.type === 'income' ? 'Ingreso' : 'Egreso'}</div>
                    </div>
                </div>
                <div class="budget-amounts">
                    <span class="budget-spent ${deviation < 0 ? 'red' : 'green'}">
                        ${UIService.formatCurrency(real)}
                    </span>
                    <span class="budget-limit">
                        de ${UIService.formatCurrency(b.limit)}
                    </span>
                </div>
                <div class="budget-progress-bar-container">
                    <div class="budget-progress-bar" style="width: ${progress}%"></div>
                </div>
                <div class="budget-progress-text">
                    <span class="${deviation < 0 ? 'red' : 'green'}">
                        ${b.type === 'expense' ? (deviation < 0 ? 'Excedido' : 'Restante') 
                        : (deviation < 0 ? 'Faltante' : 'Sobrante')}: ${UIService.formatCurrency(Math.abs(restante))}
                    </span>
                    <span>${Math.round(progress)}%</span>
                </div>
                <div class="budget-actions">
                    <button class="budget-action-btn edit" title="Editar Presupuesto" data-budget-id="${b.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="budget-action-btn delete" title="Eliminar Presupuesto" data-budget-id="${b.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `

            budgetsGrid.appendChild(budgetItem)
        }

        // Eventos de edición y eliminación
        const editBudgetBtns = budgetsGrid.querySelectorAll('.budget-action-btn.edit')
        const deleteBudgetBtns = budgetsGrid.querySelectorAll('.budget-action-btn.delete')

        editBudgetBtns.forEach(editBudgetBtn => {
            editBudgetBtn.addEventListener('click', async () => {
                const id = parseInt(editBudgetBtn.dataset.budgetId)
                const budget = await this.getBudget(id)
                budgetModal.setData(budget)
                budgetModal.openModal()
            })
        })

        deleteBudgetBtns.forEach(deleteBudgetBtn => {
            deleteBudgetBtn.addEventListener('click', async () => {
                const budgetId = parseInt(deleteBudgetBtn.dataset.budgetId)
                const budget = await this.getBudget(budgetId)
                // Buscar todos los presupuestos agrupados por la misma categoría, mes, año y tipo
                const budgets = await this.getBudgets()
                const toDelete = budgets.filter(b =>
                    b.categoryId === budget.categoryId &&
                    b.month === budget.month &&
                    b.year === budget.year &&
                    b.type === budget.type
                )
                // Eliminar todos los presupuestos encontrados
                for (const b of toDelete) {
                    await this.deleteBudget(b.id)
                }
                await this.renderBudgetsByCategory(budgetsGrid, budgetModal)
                await this.renderAllBudgets(
                    await this.getBudgets(),
                    budgetsTable,
                    budgetModal
                )
                await this.updateMonthlySummary()
            })
        })
    }


    static async updateMonthlySummary() {
        try {
            const currentMonth = UIService.getCurrentMonth()
            const currentYear = UIService.getCurrentYear()

            const monthlyBudgets = await this.getBudgetsByMonth(currentMonth, currentYear)

            let estimatedIncome = 0
            let estimatedExpense = 0
            monthlyBudgets.forEach(b => {
                if (b.type === 'income') estimatedIncome += parseFloat(b.limit)
                else estimatedExpense += parseFloat(b.limit)
            })

            const transactions = await TransactionsService.getTransactions({ month: currentMonth, year: currentYear })
            let realIncome = 0
            let realExpense = 0
            transactions.forEach(t => {
                if (t.type === 'income') realIncome += parseFloat(t.amount)
                else realExpense += parseFloat(t.amount)
            })

            const estimatedIncomeSpan = document.querySelector('.summary-card .summary-amount.income')
            const realIncomeSpan = document.querySelector('.summary-card .summary-amount:not(.income):not(.expense)')
            const estimatedExpenseSpan = document.querySelector('.summary-card .summary-amount.expense')
            const realExpenseSpan = document.querySelectorAll('.summary-card .summary-amount:not(.income):not(.expense)')[1]

            if (estimatedIncomeSpan) estimatedIncomeSpan.innerHTML = UIService.formatCurrency(estimatedIncome)
            if (realIncomeSpan) realIncomeSpan.innerHTML = UIService.formatCurrency(realIncome)
            if (estimatedExpenseSpan) estimatedExpenseSpan.innerHTML = UIService.formatCurrency(estimatedExpense)
            if (realExpenseSpan) realExpenseSpan.innerHTML = UIService.formatCurrency(realExpense)

        } catch (error) {
            throw new Error(`Error al actualizar resumen mensual: ${error}`)
        }
    }
}