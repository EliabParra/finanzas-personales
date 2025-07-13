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

            <!-- MODAL PARA AGREGAR NUEVA TRANSACCIÓN -->
            <div class="modal-overlay" id="transactionModal">
                <div class="modal-content">
                    <button class="modal-close-btn" id="closeTransactionModalBtn">&times;</button>
                    <h3 class="modal-title">Nueva Transacción 💸</h3>
                    <form id="newTransactionForm">
                        <div class="form-group">
                            <label for="transactionType">Tipo de Transacción</label>
                            <div class="radio-group">
                                <label>
                                    <input type="radio" name="transactionType" value="income" checked> Ingreso
                                </label>
                                <label>
                                    <input type="radio" name="transactionType" value="expense"> Egreso
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="amount">Monto</label>
                            <input type="number" id="amount" placeholder="Ej: 50.00" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="date">Fecha</label>
                            <input type="date" id="date" value="2025-07-11" required>
                        </div>
                        <div class="form-group">
                            <label for="category">Categoría</label>
                            <select id="category" required>
                                <option value="">Selecciona una categoría</option>
                                <option value="alimentacion">Alimentación</option>
                                <option value="transporte">Transporte</option>
                                <option value="ocio">Ocio</option>
                                <option value="servicios">Servicios</option>
                                <option value="salud">Salud</option>
                                <option value="educacion">Educación</option>
                                <option value="otros">Otros</option>
                                <!-- Las categorías personalizadas se añadirían aquí dinámicamente -->
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="description">Descripción (opcional)</label>
                            <input type="text" id="description" placeholder="Ej: Cena con amigos">
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-cancel" id="cancelTransactionBtn">Cancelar</button>
                            <button type="submit" class="btn">Guardar Transacción</button>
                        </div>
                    </form>
                </div>
            </div>
        `

        // Lógica para abrir/cerrar el modal
        setTimeout(() => {
            const openBtn = dashboard.querySelector('#openTransactionModalBtn')
            const closeBtn = dashboard.querySelector('#closeTransactionModalBtn')
            const cancelBtn = dashboard.querySelector('#cancelTransactionBtn')
            const modal = dashboard.querySelector('#transactionModal')

            function openModal() {
                modal.classList.add('show')
            }
            function closeModal() {
                modal.classList.remove('show')
            }

            openBtn?.addEventListener('click', openModal)
            closeBtn?.addEventListener('click', closeModal)
            cancelBtn?.addEventListener('click', closeModal)
            // Cerrar modal al hacer click fuera del contenido
            modal?.addEventListener('click', e => {
                if (e.target === modal) closeModal()
            })
        }, 0)

        return dashboard
    }
}