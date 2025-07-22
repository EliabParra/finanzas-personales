import { Modal } from './../UI/Modal.js'
import { BudgetsService } from '../../services/BudgetsService.js'
import { UIService } from '../../services/UIService.js'

export class Budgets {
    constructor() {}

    async render() {
        const budgetsPage = document.createElement('div')
        budgetsPage.classList.add('budgets')
        budgetsPage.dataset.page = 'budgets'
        budgetsPage.innerHTML = `
            <div class="card" data-aos="fade-up">
                <div class="card-header">
                    <h2 class="card-title">Presupuestos ${UIService.getCurrentMonthName()} ${UIService.getCurrentYear()}</h2>
                    <button class="btn" id="openBudgetModalBtn">
                        <i class="fas fa-plus-circle"></i> Nuevo Presupuesto
                    </button>
                </div>
                <div class="summary-grid">
                    <div class="summary-card">
                        <div class="summary-icon-wrapper"><i class="fas fa-wallet"></i></div>
                        <div class="summary-label">Ingresos Estimados</div>
                        <div class="summary-amount income">$0.00</div>
                        <div class="summary-label">Ingresos Reales</div>
                        <div class="summary-amount">$0.00</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon-wrapper"><i class="fas fa-receipt"></i></div>
                        <div class="summary-label">Gastos Estimados</div>
                        <div class="summary-amount expense">$0.00</div>
                        <div class="summary-label">Gastos Reales</div>
                        <div class="summary-amount">$0.00</div>
                    </div>
                </div>
            </div>

            <div class="card" data-aos="fade-up" data-aos-delay="100">
                <div class="card-header">
                    <h2 class="card-title">Presupuestos por Categoría</h2>
                </div>
                <div class="budgets-grid" id="budgetsGrid">
                    
                </div>
            </div>

            <div class="card" data-aos="fade-up" data-aos-delay="200">
                <div class="card-header">
                    <h2 class="card-title">Histórico de Presupuestos</h2>
                </div>
                <div class="transactions-table-container">
                    <table class="data-table budgets-table" id="budgetsTable">
                        
                    </table>
                </div>
            </div>
        `

        this.budgetsGrid = budgetsPage.querySelector('#budgetsGrid')
        this.budgetsTable = budgetsPage.querySelector('#budgetsTable')
        this.budgetModal = new Modal('budget', budgetsPage, this.handleSubmit.bind(this))
        budgetsPage.appendChild(await this.budgetModal.render())
        await BudgetsService.renderAllBudgets(
            await BudgetsService.getBudgets(), 
            this.budgetsTable, 
            this.budgetModal
        )
        await BudgetsService.renderBudgetsByCategory(
            this.budgetsGrid,
            this.budgetModal
        )

        return budgetsPage
    }

    async handleSubmit(data) {
        data.limit = parseFloat(data.limit)
        data.categoryId = parseInt(data.categoryId)
        data.month = parseInt(data.month)
        data.year = parseInt(data.year)
        if (data.id) {
            data.id = parseInt(data.id)
            await BudgetsService.updateBudget(data)
        } else {
            delete data.id
            await BudgetsService.addBudget(data)
        }
        await BudgetsService.renderAllBudgets(
            await BudgetsService.getBudgets(), 
            this.budgetsTable, 
            this.budgetModal
        )
        await BudgetsService.renderBudgetsByCategory(
            this.budgetsGrid,
            this.budgetModal
        )
    }
}