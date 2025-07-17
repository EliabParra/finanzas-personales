import DB from './../classes/DB.js'

export class TransactionsService {
    static async getTransactions(filters = {}) {
        try {
            const db = new DB('finanzas-personales', 'transactions')
            const transactions = await db.getAllItems()
            
            if (filters.type) {
                transactions.filter(t => t.type === filters.type)
            }
            if (filters.category) {
                transactions.filter(t => t.category === filters.category)
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

    static async updateBalance(transactions) {
        try {
            let balance = 0
            let income = 0
            let expense = 0

            transactions.forEach(t => {
                if (t.type === 'income') income += parseFloat(t.amount)
                else if (t.type === 'expense') expense += parseFloat(t.amount)
                else balance += parseFloat(t.amount)
            })

            const balanceSpan = document.querySelector('.summary-balance .summary-amount')
            const incomeSpan = document.querySelector('.summary-income .summary-amount')
            const expenseSpan = document.querySelector('.summary-expense .summary-amount')

            if (balanceSpan) balanceSpan.innerHTML = `${this.formatCurrency(balance)}`
            if (incomeSpan) incomeSpan.innerHTML = `${this.formatCurrency(income)}`
            if (expenseSpan) expenseSpan.innerHTML = `${this.formatCurrency(expense)}`
        } catch (error) {
            throw new Error(`Error al actualizar balance: ${error}`)
        }
    }

    static async renderTransactions(transactions) {
        
    }

    static formatCurrency(amount) {
        return amount.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    static formatDate(date) {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
}