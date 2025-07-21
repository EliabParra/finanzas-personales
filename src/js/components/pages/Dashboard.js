import { Modal } from './../UI/Modal.js'
import { TransactionsService } from '../../services/TransactionsService.js'
import { CategoriesService } from '../../services/CategoriesService.js'

export class Dashboard {
    constructor(onPageChange) {
        this.onPageChange = onPageChange
    }

    async render() {
        this.dashboardPage = document.createElement('div')
        this.dashboardPage.classList.add('dashboard')
        this.dashboardPage.dataset.page = 'dashboard'
        this.dashboardPage.innerHTML = `
            <!-- Sección de Resumen Mensual -->
            <div class="card" data-aos="fade-up">
                <div class="card-header">
                    <h2 class="card-title">Resumen del Mes ✨</h2>
                    <button class="btn" id="openTransactionModalBtn"><i class="fas fa-plus-circle"></i> Nueva Transacción</button>
                </div>
                <div class="summary-grid">
                    <div class="summary-card summary-income">
                        <i class="fas fa-arrow-alt-circle-down summary-icon"></i> <!-- Icono para ingresos -->
                        <span class="summary-label">Ingresos</span>
                        <span class="summary-amount"></span>
                    </div>
                    <div class="summary-card summary-expense">
                        <i class="fas fa-arrow-alt-circle-up summary-icon"></i> <!-- Icono para egresos -->
                        <span class="summary-label">Gastos</span>
                        <span class="summary-amount"></span>
                    </div>
                    <div class="summary-card summary-balance">
                        <i class="fas fa-wallet summary-icon"></i> <!-- Icono para balance -->
                        <span class="summary-label">Balance</span>
                        <span class="summary-amount"></span>
                    </div>
                </div>
            </div>

            <!-- Sección de Transacciones Recientes -->
            <div class="card" data-aos="fade-up" data-aos-delay="100">
                <div class="card-header">
                    <h2 class="card-title">Transacciones Recientes 📈</h2>
                    <button class="btn" id="allTransactionsBtn">Ver todas <i class="fas fa-arrow-alt-circle-right"></i></button>
                </div>
                <ul class="transactions-list">
                    
                </ul>
            </div>
        `

        this.transactionModal = new Modal('transaction', this.dashboardPage, this.handleSubmit.bind(this))
        this.dashboardPage.appendChild(await this.transactionModal.render())
        await this.renderTransactions()

        const allTransactionsBtn = this.dashboardPage.querySelector('#allTransactionsBtn')
        allTransactionsBtn.addEventListener('click', async () => await this.onPageChange('transactions'))

        return this.dashboardPage
    }

    async renderTransactions() {
        console.log('Renderizando transacciones')
        const transactionsList = this.dashboardPage.querySelector('.transactions-list')
        if (!transactionsList) return

        transactionsList.innerHTML = ''
        let transactions = await TransactionsService.getTransactions()
        transactions = transactions.filter(t => Date.parse(t.date) >= Date.now() - 30 * 24 * 60 * 60 * 1000)

        if (transactions.length === 0) {
            transactionsList.innerHTML = `
                <li class="empty-list-message">
                    <i class="fas fa-info-circle"></i> No hay transacciones para mostrar
                </li>
            `
            return
        }

        transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(async t => {
            t.category = await CategoriesService.getCategory(t.categoryId)
            t.amount = this.formatCurrency(t.amount)
            const li = document.createElement('li')
            li.innerHTML = `
                <li class="transaction-item">
                    <div class="transaction-icon-wrapper" style="background-color: ${t.category.color};">
                        ${t.category.icon}
                    </div>
                    <div class="transaction-details">
                        <div class="transaction-description">${t.description}</div>
                        <div class="transaction-category-date">${t.category.name} • ${t.date}</div>
                    </div>
                    <div class="transaction-amount ${t.type === 'income' ? 'income' : 'expense'}">${t.amount}</div>
                </li>
            `
            transactionsList.appendChild(li)
        })
    }

    formatCurrency(amount) {
        return amount.toLocaleString('en-EN', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    async handleSubmit(data) {
        data.amount = parseFloat(data.amount)
        const category = await CategoriesService.getCategory(parseInt(data.categoryId))
        data.categoryId = category.id
        if (data.id) {
            data.id = parseInt(data.id)
            await TransactionsService.updateTransaction(data)
        } else {
            delete data.id
            await TransactionsService.addTransaction(data)
        }
        await this.renderTransactions()
    }
}