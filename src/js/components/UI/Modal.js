export class Modal {
    constructor(type, page, onSubmit) {
        this.type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
        this.page = page
        this.onSubmit = onSubmit
    }

    async render() {
        this.currentDate = new Date().toISOString().split('T')[0]
        this.modal = document.createElement('div')
        this.modal.className = 'modal-overlay'
        this.modal.id = this.type + 'Modal'
        
        const modalContent = document.createElement('div')
        modalContent.className = 'modal-content'
        
        const openBtn = this.page.querySelector(`#open${this.type}ModalBtn`)
        
        const closeBtn = document.createElement('button')
        closeBtn.className = 'modal-close-btn'
        closeBtn.id = `close${this.type}ModalBtn`
        closeBtn.innerHTML = '&times;'
        
        const title = document.createElement('h3')
        title.className = 'modal-title'
        
        const modalActions = document.createElement('div')
        modalActions.className = 'modal-actions'
        
        const cancelBtn = document.createElement('button')
        cancelBtn.className = 'btn btn-cancel'
        cancelBtn.id = `cancel${this.type}ModalBtn`
        cancelBtn.innerHTML = 'Cancelar'

        const submitBtn = document.createElement('button')
        submitBtn.className = 'btn'
        submitBtn.type = 'submit'
        submitBtn.innerHTML = 'Guardar'

        modalActions.appendChild(cancelBtn)
        modalActions.appendChild(submitBtn)

        modalContent.appendChild(closeBtn)
        modalContent.appendChild(title)
        this.modal.appendChild(modalContent)
        
        let form = document.createElement('form')
        form.id = `new${this.type}Form`
        switch (this.type.toLowerCase()) {
            case 'transaction':
                form.innerHTML = `
                    <div class="form-group">
                        <label for="type">Tipo de Transacción</label>
                        <div class="radio-group">
                            <label>
                                <input type="radio" name="type" value="income" required> 
                                Ingreso
                            </label>
                            <label>
                                <input type="radio" name="type" value="expense" required> 
                                Egreso
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="amount">Monto</label>
                        <input type="number" name="amount" id="amount" placeholder="Ej: 50.00" step="0.01" required value="">
                    </div>
                    <div class="form-group">
                        <label for="date">Fecha</label>
                        <input type="date" name="date" id="date" value="${this.currentDate}" required>
                    </div>
                    <div class="form-group">
                        <label for="category">Categoría</label>
                        <select id="category" name="category" required>
                            <option value="">Selecciona una categoría</option>
                            <option value="alimentacion">Alimentación</option>
                            <option value="transporte">Transporte</option>
                            <option value="ocio">Ocio</option>
                            <option value="servicios">Servicios</option>
                            <option value="salud">Salud</option>
                            <option value="educacion">Educación</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="description">Descripción (opcional)</label>
                        <input type="text" name="description" id="description" placeholder="Ej: Cena con amigos" value="">
                    </div>
                    <input type="hidden" id="transactionId" name="id">
                `
                title.innerHTML = `Nueva Transacción 💸`
                break
            case 'category':
                form.innerHTML = `
                    <input type="hidden" id="categoryId"> <!-- Para almacenar el ID de la categoría a editar -->
                    <div class="form-group">
                        <label for="categoryName">Nombre de la Categoría</label>
                        <input type="text" id="categoryName" placeholder="Ej: Café, Gimnasio" required>
                    </div>
                    <div class="form-group">
                        <label for="categoryIcon">Icono (Clase de Font Awesome)</label>
                        <input type="text" id="categoryIcon" placeholder="Ej: fa-coffee, fa-dumbbell">
                        <small style="color: var(--text-light); font-size: 0.8em;">Busca iconos en <a href="https://fontawesome.com/icons" target="_blank" style="color: var(--primary-color); text-decoration: none;">Font Awesome</a> (ej: "fa-utensils")</small>
                    </div>
                    <div class="form-group">
                        <label for="categoryColor">Color</label>
                        <input type="color" id="categoryColor" value="#6a6ee0"> <!-- Color por defecto -->
                    </div>
                `
                title.innerHTML = `Nueva Categoría ➕`
                break
            case 'budget':
                form.innerHTML = `
                    <input type="hidden" id="budgetId"> <!-- Para almacenar el ID del presupuesto a editar -->
                    <div class="form-group">
                        <label for="budgetCategory">Categoría</label>
                        <select id="budgetCategory" required>
                            <option value="">Selecciona una categoría</option>
                            <!-- Las categorías se cargarán aquí dinámicamente -->
                            <option value="alimentacion">Alimentación</option>
                            <option value="transporte">Transporte</option>
                            <option value="ocio">Ocio</option>
                            <option value="servicios">Servicios</option>
                            <option value="salud">Salud</option>
                            <option value="educacion">Educación</option>
                            <option value="otros">Otros</option>
                            <option value="entretenimiento">Entretenimiento</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="budgetLimit">Monto Límite</label>
                        <input type="number" id="budgetLimit" placeholder="Ej: 200.00" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="budgetPeriod">Periodo</label>
                        <select id="budgetPeriod" required>
                            <option value="mensual">Mensual</option>
                            <option value="semanal">Semanal</option>
                            <option value="anual">Anual</option>
                        </select>
                    </div>
                `
                title.innerHTML = `Nuevo Presupuesto 💸`
                break
        }
        

        form.appendChild(modalActions)
        
        modalContent.appendChild(form)

        openBtn.addEventListener('click', () => this.openModal())
        closeBtn.addEventListener('click', () => this.closeModal())
        cancelBtn.addEventListener('click', () => this.closeModal())
        this.modal.addEventListener('click', e => {
            if (e.target === this.modal) this.closeModal()
        })
        submitBtn.addEventListener('click', e => this.handleSubmit(e))

        return this.modal
    }

    async handleSubmit(e) {
        e.preventDefault()
        const data = Object.fromEntries(
            new FormData(e.target.form)
        )

        try {
            await this.onSubmit(data)
            this.closeModal()
        } catch (error) {
            throw new Error(`Error al guardar el ${this.type}: ${error.message}`)
        }
    }

    openModal() {
        this.modal.classList.add('show')
    }

    closeModal() {
        this.modal.classList.remove('show')
        this.clearData()
    }

    setData(data) {
        this.modal.querySelectorAll('input, select').forEach(input => {
            if (input.name in data && input.type !== 'radio') input.value = data[input.name]
            if (input.type === 'radio') input.checked = (input.value === data[input.name])
        })
    }

    clearData() {
        this.modal.querySelectorAll('input, select').forEach(input => {
            if (input.type !== 'radio') input.value = ''
            if (input.type === 'radio') input.checked = false
        })
        this.modal.querySelector('#date').value = this.currentDate
    }
}