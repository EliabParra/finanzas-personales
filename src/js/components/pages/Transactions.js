import { Modal } from './../UI/Modal.js'
import { TransactionsService } from '../../services/TransactionsService.js'

export class Transactions {
    constructor() {
        this.currentFilters = {
            type: '',
            category: '',
            startDate: '',
            endDate: '',
            description: ''
        }
    }

    async render() {
        const transactionsPage = document.createElement('div')
        transactionsPage.classList.add('transactions')
        transactionsPage.dataset.page = 'transactions'
        transactionsPage.innerHTML = `
            <!-- Sección de Transacciones con Filtros -->
            <div class="card" data-aos="fade-up">
                <div class="card-header">
                    <h2 class="card-title">Todas las Transacciones 📊</h2>
                    <button class="btn" id="openTransactionModalBtn"><i class="fas fa-plus-circle"></i> Nueva Transacción</button>
                </div>

                <form class="filters-section" data-aos="fade-up" data-aos-delay="50" id="filtersForm">
                    <div class="filter-group">
                        <label for="filterType">Tipo</label>
                        <select id="filterType" name="type">
                            <option value="">Todos</option>
                            <option value="income">Ingreso</option>
                            <option value="expense">Egreso</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="filterCategory">Categoría</label>
                        <select id="filterCategory" name="category">
                            <option value="">Todas</option>
                            <option value="alimentacion">Alimentación</option>
                            <option value="transporte">Transporte</option>
                            <option value="ocio">Ocio</option>
                            <option value="servicios">Servicios</option>
                            <option value="salud">Salud</option>
                            <option value="educacion">Educación</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="filterStartDate">Desde</label>
                        <input type="date" id="filterStartDate" name="startDate">
                    </div>
                    <div class="filter-group">
                        <label for="filterEndDate">Hasta</label>
                        <input type="date" id="filterEndDate" name="endDate">
                    </div>
                    <div class="filter-group">
                        <label for="filterDescription">Descripción</label>
                        <input type="text" id="filterDescription" name="description">
                    </div>
                    <div class="filter-buttons">
                        <button class="btn btn-secondary" id="resetFiltersBtn"><i class="fas fa-redo"></i> Limpiar Filtros</button>
                        <button class="btn" id="applyFiltersBtn"><i class="fas fa-filter"></i> Aplicar Filtros</button>
                    </div>
                </form>

                <div class="transactions-table-container" data-aos="fade-up" data-aos-delay="100">
                    <table class="transactions-table" id="transactionsTable">
                        
                    </table>
                </div>
            </div>
        `

        this.transactionModal = new Modal('transaction', transactionsPage, this.handleSubmit.bind(this))
        transactionsPage.appendChild(await this.transactionModal.render())
        this.transactionsTable = transactionsPage.querySelector('#transactionsTable')
        await TransactionsService.renderTransactions(
            await TransactionsService.getTransactions(), 
            this.transactionsTable, 
            this.transactionModal
        )

        const resetFiltersBtn = transactionsPage.querySelector('#resetFiltersBtn')
        const applyFiltersBtn = transactionsPage.querySelector('#applyFiltersBtn')
        const filtersForm = transactionsPage.querySelector('#filtersForm')

        resetFiltersBtn.addEventListener('click', async () => {
            this.currentFilters = {
                type: '',
                category: '',
                startDate: '',
                endDate: '',
                description: ''
            }
            filtersForm.reset()
            await TransactionsService.renderTransactions(
                await TransactionsService.getTransactions(), 
                this.transactionsTable, 
                this.transactionModal
            )
        })

        applyFiltersBtn.addEventListener('click', async () => {
            this.currentFilters = Object.fromEntries(
                new FormData(filtersForm)
            )
            await TransactionsService.renderTransactions(
                await TransactionsService.getTransactions(this.currentFilters), 
                this.transactionsTable, 
                this.transactionModal
            )
        })

        return transactionsPage
    }

    async handleSubmit(data) {
        data.amount = parseFloat(data.amount)
        if (data.id) {
            data.id = parseInt(data.id)
            await TransactionsService.updateTransaction(data)
        } else {
            delete data.id
            await TransactionsService.addTransaction(data)
        }
        await TransactionsService.renderTransactions(
            await TransactionsService.getTransactions(this.currentFilters), 
            this.transactionsTable,
            this.transactionModal
        )
    }
}