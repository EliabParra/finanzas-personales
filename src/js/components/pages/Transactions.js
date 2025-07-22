import { Modal } from './../UI/Modal.js'
import { TransactionsService } from '../../services/TransactionsService.js'
import { CategoriesService } from '../../services/CategoriesService.js'
export class Transactions {
    constructor() {
        this.currentFilters = {
            type: '',
            category: '',
            startDate: '',
            endDate: '',
            description: '',
            month: '',
            year: ''
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
                            ${await CategoriesService.getCategories().then(categories => {
                                return categories.map(category => `
                                    <option value="${category.id}">${category.name}</option>
                                `).join('')
                            })}
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

        resetFiltersBtn.addEventListener('click', async e => {
            e.preventDefault()
            this.currentFilters = {
                type: '',
                category: '',
                startDate: '',
                endDate: '',
                description: '',
                month: '',
                year: ''
            }
            filtersForm.reset()
            await TransactionsService.renderTransactions(
                await TransactionsService.getTransactions(), 
                this.transactionsTable, 
                this.transactionModal
            )
        })

        applyFiltersBtn.addEventListener('click', async e => {
            e.preventDefault()
            this.currentFilters = Object.fromEntries(
                new FormData(filtersForm)
            )

            if (this.currentFilters.category) {
                this.currentFilters.category = parseInt(this.currentFilters.category)
            }
            
            await TransactionsService.renderTransactions(
                await TransactionsService.getTransactions(this.currentFilters), 
                this.transactionsTable, 
                this.transactionModal
            )
        })

        return transactionsPage
    }

    async handleSubmit(data) {
        // Solo procesar si los datos ya han sido validados por Modal
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
        await TransactionsService.renderTransactions(
            await TransactionsService.getTransactions(this.currentFilters), 
            this.transactionsTable,
            this.transactionModal
        )
    }
}