export class Transactions {
    constructor() {

    }

    async render() {
        const transactions = document.createElement('div')
        transactions.classList.add('transactions')
        transactions.dataset.page = 'transactions'
        transactions.innerHTML = `
            <!-- Sección de Transacciones con Filtros -->
            <div class="card" data-aos="fade-up">
                <div class="card-header">
                    <h2 class="card-title">Todas las Transacciones 📊</h2>
                    <button class="btn" id="openTransactionModalBtn"><i class="fas fa-plus-circle"></i> Nueva Transacción</button>
                </div>

                <div class="filters-section" data-aos="fade-up" data-aos-delay="50">
                    <div class="filter-group">
                        <label for="filterType">Tipo</label>
                        <select id="filterType">
                            <option value="">Todos</option>
                            <option value="income">Ingreso</option>
                            <option value="expense">Egreso</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="filterCategory">Categoría</label>
                        <select id="filterCategory">
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
                        <input type="date" id="filterStartDate">
                    </div>
                    <div class="filter-group">
                        <label for="filterEndDate">Hasta</label>
                        <input type="date" id="filterEndDate">
                    </div>
                    <div class="filter-group">
                        <label for="filterDescription">Descripción / Categoría</label>
                        <input type="text" id="filterDescription" placeholder="Buscar por texto...">
                    </div>
                    <div class="filter-buttons">
                        <button class="btn btn-secondary" id="resetFiltersBtn"><i class="fas fa-redo"></i> Limpiar Filtros</button>
                        <button class="btn" id="applyFiltersBtn"><i class="fas fa-filter"></i> Aplicar Filtros</button>
                    </div>
                </div>

                <div class="transactions-table-container" data-aos="fade-up" data-aos-delay="100">
                    <table class="transactions-table">
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
                            <!-- Ejemplo de transacciones -->
                            <tr data-transaction-id="1">
                                <td data-label="Tipo">
                                    <i class="fas fa-arrow-alt-circle-up transaction-type-icon type-expense"></i> Egreso
                                </td>
                                <td data-label="Descripción">Compras del supermercado</td>
                                <td data-label="Categoría">Alimentación</td>
                                <td data-label="Fecha">05 Jul, 2025</td>
                                <td data-label="Monto" class="transaction-amount-cell expense">-$75.50</td>
                                <td data-label="Acciones" class="action-buttons">
                                    <button class="action-btn edit" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn delete" title="Eliminar">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr data-transaction-id="2">
                                <td data-label="Tipo">
                                    <i class="fas fa-arrow-alt-circle-down transaction-type-icon type-income"></i> Ingreso
                                </td>
                                <td data-label="Descripción">Pago de nómina</td>
                                <td data-label="Categoría">Ingresos</td>
                                <td data-label="Fecha">01 Jul, 2025</td>
                                <td data-label="Monto" class="transaction-amount-cell income">+$1,500.00</td>
                                <td data-label="Acciones" class="action-buttons">
                                    <button class="action-btn edit" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn delete" title="Eliminar">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr data-transaction-id="3">
                                <td data-label="Tipo">
                                    <i class="fas fa-arrow-alt-circle-up transaction-type-icon type-expense"></i> Egreso
                                </td>
                                <td data-label="Descripción">Entradas de cine</td>
                                <td data-label="Categoría">Ocio</td>
                                <td data-label="Fecha">03 Jul, 2025</td>
                                <td data-label="Monto" class="transaction-amount-cell expense">-$25.00</td>
                                <td data-label="Acciones" class="action-buttons">
                                    <button class="action-btn edit" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn delete" title="Eliminar">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr data-transaction-id="4">
                                <td data-label="Tipo">
                                    <i class="fas fa-arrow-alt-circle-up transaction-type-icon type-expense"></i> Egreso
                                </td>
                                <td data-label="Descripción">Gasolina para el coche</td>
                                <td data-label="Categoría">Transporte</td>
                                <td data-label="Fecha">02 Jul, 2025</td>
                                <td data-label="Monto" class="transaction-amount-cell expense">-$40.00</td>
                                <td data-label="Acciones" class="action-buttons">
                                    <button class="action-btn edit" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn delete" title="Eliminar">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr data-transaction-id="5">
                                <td data-label="Tipo">
                                    <i class="fas fa-arrow-alt-circle-down transaction-type-icon type-income"></i> Ingreso
                                </td>
                                <td data-label="Descripción">Venta de artículos usados</td>
                                <td data-label="Categoría">Otros</td>
                                <td data-label="Fecha">04 Jul, 2025</td>
                                <td data-label="Monto" class="transaction-amount-cell income">+$120.00</td>
                                <td data-label="Acciones" class="action-buttons">
                                    <button class="action-btn edit" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn delete" title="Eliminar">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- MODAL PARA AGREGAR NUEVA TRANSACCIÓN (reutilizado del dashboard) -->
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
            const openBtn = transactions.querySelector('#openTransactionModalBtn')
            const closeBtn = transactions.querySelector('#closeTransactionModalBtn')
            const cancelBtn = transactions.querySelector('#cancelTransactionBtn')
            const modal = transactions.querySelector('#transactionModal')

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

        return transactions
    }
}