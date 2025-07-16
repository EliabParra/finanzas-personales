import { Modal } from './../UI/Modal.js'

export class Budgets {
    constructor() {

    }

    async render() {
        const budgets = document.createElement('div')
        budgets.classList.add('budgets')
        budgets.dataset.page = 'budgets'
        budgets.innerHTML = `
            <!-- Sección de Configuración de Presupuestos -->
            <div class="card" data-aos="fade-up">
                <div class="card-header">
                    <h2 class="card-title">Mis Presupuestos 💰</h2>
                    <button class="btn" id="openBudgetModalBtn"><i class="fas fa-plus-circle"></i> Nuevo Presupuesto</button>
                </div>

                <div class="budgets-grid" data-aos="fade-up" data-aos-delay="50">
                    <!-- Ejemplo de Presupuesto 1: Alimentación -->
                    <div class="budget-item" data-budget-id="b1" data-category-id="alimentacion" data-category-name="Alimentación" data-category-icon="fa-utensils" data-category-color="#FF7043" data-budget-limit="300" data-budget-spent="250">
                        <div class="budget-item-header">
                            <div class="budget-category-icon" style="background-color: #FF7043;">
                                <i class="fas fa-utensils"></i>
                            </div>
                            <div class="budget-info">
                                <div class="budget-category-name">Alimentación</div>
                                <div class="budget-period">Mensual</div>
                            </div>
                        </div>
                        <div class="budget-amounts">
                            <span class="budget-spent">$250.00</span>
                            <span class="budget-limit">de $300.00</span>
                        </div>
                        <div class="budget-progress-bar-container">
                            <div class="budget-progress-bar" style="width: 83.33%; background-color: var(--warning-color);"></div>
                        </div>
                        <div class="budget-progress-text">
                            <span>Restante: $50.00</span>
                            <span>83.33%</span>
                        </div>
                        <div class="budget-actions">
                            <button class="budget-action-btn edit" title="Editar Presupuesto">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="budget-action-btn delete" title="Eliminar Presupuesto">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Ejemplo de Presupuesto 2: Transporte -->
                    <div class="budget-item" data-budget-id="b2" data-category-id="transporte" data-category-name="Transporte" data-category-icon="fa-bus" data-category-color="#AB47BC" data-budget-limit="100" data-budget-spent="110">
                        <div class="budget-item-header">
                            <div class="budget-category-icon" style="background-color: #AB47BC;">
                                <i class="fas fa-bus"></i>
                            </div>
                            <div class="budget-info">
                                <div class="budget-category-name">Transporte</div>
                                <div class="budget-period">Mensual</div>
                            </div>
                        </div>
                        <div class="budget-amounts">
                            <span class="budget-spent" style="color: var(--danger-color);">$110.00</span>
                            <span class="budget-limit">de $100.00</span>
                        </div>
                        <div class="budget-progress-bar-container">
                            <div class="budget-progress-bar" style="width: 110%; background-color: var(--danger-color);"></div>
                        </div>
                        <div class="budget-progress-text">
                            <span style="color: var(--danger-color);">Excedido por: $10.00</span>
                            <span>110.00%</span>
                        </div>
                        <div class="budget-actions">
                            <button class="budget-action-btn edit" title="Editar Presupuesto">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="budget-action-btn delete" title="Eliminar Presupuesto">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Ejemplo de Presupuesto 3: Ocio -->
                    <div class="budget-item" data-budget-id="b3" data-category-id="ocio" data-category-name="Ocio" data-category-icon="fa-film" data-category-color="#26C6DA" data-budget-limit="80" data-budget-spent="30">
                        <div class="budget-item-header">
                            <div class="budget-category-icon" style="background-color: #26C6DA;">
                                <i class="fas fa-film"></i>
                            </div>
                            <div class="budget-info">
                                <div class="budget-category-name">Ocio</div>
                                <div class="budget-period">Mensual</div>
                            </div>
                        </div>
                        <div class="budget-amounts">
                            <span class="budget-spent">$30.00</span>
                            <span class="budget-limit">de $80.00</span>
                        </div>
                        <div class="budget-progress-bar-container">
                            <div class="budget-progress-bar" style="width: 37.5%; background-color: var(--success-color);"></div>
                        </div>
                        <div class="budget-progress-text">
                            <span>Restante: $50.00</span>
                            <span>37.50%</span>
                        </div>
                        <div class="budget-actions">
                            <button class="budget-action-btn edit" title="Editar Presupuesto">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="budget-action-btn delete" title="Eliminar Presupuesto">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `

        const budgetModal = new Modal('budget', budgets)
        budgets.appendChild(await budgetModal.render())
        
        return budgets
    }
}