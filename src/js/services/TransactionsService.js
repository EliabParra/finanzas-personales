import DB from './../classes/DB.js'
import { CategoriesService } from './CategoriesService.js'
import { UIService } from './UIService.js'

export class TransactionsService {
    static async getTransactions(filters = {}) {
        try {
            const db = new DB('finanzas-personales', 'transactions')
            let transactions = await db.getAllItems()

            if (filters.type) {
                transactions = transactions.filter(t => t.type === filters.type)
            }
            if (filters.category) {
                transactions = transactions.filter(t => t.categoryId === filters.category)
            }
            if (filters.startDate) {
                transactions = transactions.filter(t => t.date >= filters.startDate)
            }
            if (filters.endDate) {
                transactions = transactions.filter(t => t.date <= filters.endDate)
            }
            if (filters.description) {
                transactions = transactions.filter(t => t.description.toLowerCase().includes(filters.description.toLowerCase()))
            }
            if (filters.month && filters.year) {
                transactions = transactions.filter(t => {
                    const [year, month] = t.date.split('-')
                    return parseInt(month) === parseInt(filters.month) && parseInt(year) === parseInt(filters.year)
                })
            } else if (filters.year) {
                transactions = transactions.filter(t => t.date.startsWith(filters.year))
            } else if (filters.month) {
                transactions = transactions.filter(t => {
                    const [, month] = t.date.split('-')
                    return parseInt(month) === parseInt(filters.month)
                })
            }

            return transactions
        } catch (error) {
            throw new Error(`Error al obtener transacciones: ${error}`)
            return []
        }
    }

    static async getTransaction(id) {
        try {
            const db = new DB('finanzas-personales', 'transactions')
            const transaction = await db.getItem(id)
            return transaction
        } catch (error) {
            throw new Error(`Error al obtener transacción: ${error}`)
            return {}
        }
    }

    static async addTransaction(transactionData) {
        try {
            const db = new DB('finanzas-personales', 'transactions')
            await db.addItem(transactionData)
        } catch (error) {
            throw new Error(`Error al añadir transacción: ${error}`)
        }
    }

    static async updateTransaction(transaction) {
        try {
            const db = new DB('finanzas-personales', 'transactions')
            await db.updateItem(transaction)
        } catch (error) {
            throw new Error(`Error al actualizar transacción: ${error}`)
        }
    }

    static async deleteTransaction(id) {
        try {
            const db = new DB('finanzas-personales', 'transactions')
            await db.deleteItem(id)
        } catch (error) {
            throw new Error(`Error al eliminar transacción: ${error}`)
        }
    }

    static async getTransactionsByCategoryAndMonth(categoryId, month = UIService.getCurrentMonth(), year = UIService.getCurrentYear()) {
        const transactions = await this.getTransactions()
        return transactions.filter(t => t.categoryId === categoryId && t.date.startsWith(`${year}-${month}`))
    }

    static async getTransactionsOfCurrentMonth() {
        const currentMonth = UIService.getCurrentMonth()
        const currentYear = UIService.getCurrentYear()
        const currentDate = UIService.getCurrentDate()
        const filters = { startDate: `${currentYear}-${currentMonth}-01`, endDate: currentDate }
        return await this.getTransactions(filters)
    }

    static async getTransactionsOfLast30Days() {
        let transactions = await TransactionsService.getTransactions()
        return transactions.filter(t => Date.parse(t.date) >= Date.now() - 30 * 24 * 60 * 60 * 1000)
    }

    static async updateBalance() {
        try {
            let balance = 0
            let income = 0
            let expense = 0

            const transactionsOfLast30Days = await this.getTransactionsOfLast30Days()
            transactionsOfLast30Days.forEach(t => {
                if (t.type === 'income') income += parseFloat(t.amount)
                else expense += parseFloat(t.amount)
            })

            const globalTransactions = await this.getTransactions()
            globalTransactions.forEach(t => {
                balance += t.type === 'income' ? parseFloat(t.amount) : -parseFloat(t.amount)
            })

            const balanceSpan = document.querySelector('.summary-balance .summary-amount')
            const incomeSpan = document.querySelector('.summary-income .summary-amount')
            const expenseSpan = document.querySelector('.summary-expense .summary-amount')

            if (balanceSpan) balanceSpan.innerHTML = `${UIService.formatCurrency(balance)}`
            if (incomeSpan) incomeSpan.innerHTML = `${UIService.formatCurrency(income)}`
            if (expenseSpan) expenseSpan.innerHTML = `${UIService.formatCurrency(expense)}`
        } catch (error) {
            throw new Error(`Error al actualizar balance: ${error}`)
        }
    }

    static async renderTransactions(transactions, transactionsTable, transactionModal) {
        if (!transactionsTable) return

        transactionsTable.innerHTML = `
            <thead>
                <tr>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `

        if (transactions.length === 0) {
            transactionsTable.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-table-message">
                        <i class="fas fa-info-circle"></i> No hay transacciones para mostrar
                    </td>
                </tr>
            `
            return
        }

        for (const t of transactions.sort((a, b) => new Date(b.date) - new Date(a.date))) {
            t.category = await CategoriesService.getCategory(t.categoryId)
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td data-label="Tipo">
                    <i class="fas fa-arrow-alt-circle-${t.type === 'income' ? 'down' : 'up'} transaction-type-icon type-${t.type}"></i> 
                    ${t.type === 'income' ? 'Ingreso' : 'Egreso'}
                </td>
                <td data-label="Descripción">${t.description}</td>
                <td data-label="Categoría">${t.category.name}</td>
                <td data-label="Fecha">${t.date}</td>
                <td data-label="Monto" class="transaction-amount-cell ${t.type}">
                    ${t.type === 'income' ? '+' : '-'}${UIService.formatCurrency(t.amount)}
                </td>
                <td data-label="Acciones" class="action-buttons">
                    <button class="transaction-action-btn edit" title="Editar" data-transaction-id="${t.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="transaction-action-btn delete" title="Eliminar" data-transaction-id="${t.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `
            transactionsTable.querySelector('tbody').appendChild(tr)
        }

        const editTransactionBtns = transactionsTable.querySelectorAll('.transaction-action-btn.edit')
        const deleteTransactionBtns = transactionsTable.querySelectorAll('.transaction-action-btn.delete')

        editTransactionBtns.forEach(editTransactionBtn => {
            editTransactionBtn.addEventListener('click', async () => {
                const id = parseInt(editTransactionBtn.dataset.transactionId)
                const transaction = await TransactionsService.getTransaction(id)
                transactionModal.setData(transaction)
                transactionModal.openModal()
            })
        })

        deleteTransactionBtns.forEach(deleteTransactionBtn => {
            deleteTransactionBtn.addEventListener('click', async () => {
                const id = parseInt(deleteTransactionBtn.dataset.transactionId)
                await TransactionsService.deleteTransaction(id)
                await TransactionsService.renderTransactions(
                    await TransactionsService.getTransactions(this.currentFilters), 
                    transactionsTable, transactionModal
                )
            })
        })
    }
}