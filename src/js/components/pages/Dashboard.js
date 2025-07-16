import { Modal } from './../UI/Modal.js'

export class Dashboard {
    constructor() {

    }

    async render() {
        const dashboard = document.createElement('div')
        dashboard.classList.add('dashboard')
        dashboard.dataset.page = 'dashboard'
        dashboard.innerHTML = `
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
                        <span class="summary-amount">$1,500.00</span>
                    </div>
                    <div class="summary-card summary-expense">
                        <i class="fas fa-arrow-alt-circle-up summary-icon"></i> <!-- Icono para egresos -->
                        <span class="summary-label">Gastos</span>
                        <span class="summary-amount">$850.00</span>
                    </div>
                    <div class="summary-card summary-balance">
                        <i class="fas fa-wallet summary-icon"></i> <!-- Icono para balance -->
                        <span class="summary-label">Balance</span>
                        <span class="summary-amount">$650.00</span>
                    </div>
                </div>
            </div>

            <!-- Sección de Transacciones Recientes -->
            <div class="card" data-aos="fade-up" data-aos-delay="100">
                <div class="card-header">
                    <h2 class="card-title">Transacciones Recientes 📈</h2>
                    <!-- Aquí podrías tener un botón para ver todas las transacciones -->
                </div>
                <ul class="transactions-list">
                    <li class="transaction-item">
                        <div class="transaction-icon-wrapper">
                            <i class="fas fa-shopping-cart" style="color: #FF7043;"></i> <!-- Icono de compras -->
                        </div>
                        <div class="transaction-details">
                            <div class="transaction-description">Compras del supermercado</div>
                            <div class="transaction-category-date">Alimentación • 05 Jul, 2025</div>
                        </div>
                        <div class="transaction-amount expense">-$75.50</div>
                        <button class="delete-transaction-btn" data-transaction-id="1">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </li>
                    <li class="transaction-item">
                        <div class="transaction-icon-wrapper">
                            <i class="fas fa-briefcase" style="color: #66BB6A;"></i> <!-- Icono de trabajo -->
                        </div>
                        <div class="transaction-details">
                            <div class="transaction-description">Pago de nómina</div>
                            <div class="transaction-category-date">Ingresos • 01 Jul, 2025</div>
                        </div>
                        <div class="transaction-amount income">+$1,500.00</div>
                        <button class="delete-transaction-btn" data-transaction-id="2">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </li>
                    <li class="transaction-item">
                        <div class="transaction-icon-wrapper">
                            <i class="fas fa-film" style="color: #26C6DA;"></i> <!-- Icono de ocio -->
                        </div>
                        <div class="transaction-details">
                            <div class="transaction-description">Entradas de cine</div>
                            <div class="transaction-category-date">Ocio • 03 Jul, 2025</div>
                        </div>
                        <div class="transaction-amount expense">-$25.00</div>
                        <button class="delete-transaction-btn" data-transaction-id="3">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </li>
                    <li class="transaction-item">
                        <div class="transaction-icon-wrapper">
                            <i class="fas fa-gas-pump" style="color: #AB47BC;"></i> <!-- Icono de gasolina -->
                        </div>
                        <div class="transaction-details">
                            <div class="transaction-description">Gasolina para el coche</div>
                            <div class="transaction-category-date">Transporte • 02 Jul, 2025</div>
                        </div>
                        <div class="transaction-amount expense">-$40.00</div>
                        <button class="delete-transaction-btn" data-transaction-id="4">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </li>
                </ul>
            </div>
        `

        const transactionModal = new Modal('transaction', dashboard)
        dashboard.appendChild(await transactionModal.render())

        return dashboard
    }
}