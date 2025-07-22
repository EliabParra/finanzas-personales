import { CategoriesService } from "../../services/CategoriesService.js"
import { UIService } from "../../services/UIService.js"

export class Modal {
    constructor(type, page, onSubmit) {
        this.type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
        this.page = page
        this.onSubmit = onSubmit
    }

    async render() {
        const categories = await CategoriesService.getCategories()

        this.currentDate = UIService.getCurrentDate()
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
                        <select id="category" name="categoryId" required>
                            <option value="">Selecciona una categoría</option>
                            ${categories.map(category => `
                                <option value="${category.id}">${category.name} ${category.icon ? `(${category.icon})` : ''}</option>
                            `).join('')}
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
                    <div class="form-group">
                        <label for="categoryName">Nombre de la Categoría</label>
                        <input type="text" id="categoryName" name="name" placeholder="Ej: Café, Gimnasio" required>
                    </div>
                    <div class="form-group">
                        <label for="categoryIcon">Emoji</label>
                        <input type="text" id="categoryIcon" name="icon" placeholder="Ej: ☕, 🏋️‍♂️">
                    </div>
                    <div class="form-group">
                        <label for="categoryColor">Color</label>
                        <input type="color" id="categoryColor" name="color" value="#6a6ee0">
                    </div>
                    <input type="hidden" id="categoryId" name="id">
                `
                title.innerHTML = `Nueva Categoría ➕`
                break
            case 'budget':
                form.innerHTML = `
                    <div class="form-group">
                        <label>Tipo</label>
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
                        <label for="budgetCategory">Categoría</label>
                        <select id="budgetCategory" name="categoryId" required>
                            <option value="">Selecciona una categoría</option>
                            ${categories.map(category => `
                                <option value="${category.id}">${category.name} ${category.icon ? `(${category.icon})` : ''}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="budgetMonth">Mes</label>
                        <select id="budgetMonth" name="month" required>
                            <option value="">Selecciona un mes</option>
                            ${Array.from({ length: 12 }, (_, i) => `
                                <option value="${i + 1}" ${i + 1 === UIService.getCurrentMonth() ? 'selected' : ''}>
                                    ${UIService.getMonthName(i + 1)}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="budgetYear">Año</label>
                        <input type="number" id="budgetYear" name="year" min="2020" max="2100" required value="${UIService.getCurrentYear()}">
                    </div>
                    <div class="form-group">
                        <label for="budgetLimit">Monto</label>
                        <input type="number" id="budgetLimit" name="limit" placeholder="Ej: 200.00" step="0.01" required>
                    </div>
                    <input type="hidden" id="budgetId" name="id">
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
            UIService.updateData()
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
        this.modal.querySelectorAll('input').forEach(input => {
            if (input.name in data && input.type !== 'radio') input.value = data[input.name]
            if (input.type === 'radio') input.checked = input.value === data[input.name]
        })
        this.modal.querySelectorAll('select').forEach(select => {
            if (select.name in data) {
                select.value = data[select.name]
            }
        })
    }

    clearData() {
        this.modal.querySelectorAll('input, select').forEach(input => {
            if (input.type !== 'radio') input.value = ''
            if (input.type === 'radio') input.checked = false
            if (input.type === 'color') input.value = '#6a6ee0'
            if (input.type === 'date') input.value = this.currentDate
            if (input.name === 'year') input.value = UIService.getCurrentYear()
            if (input.name === 'month') input.value = UIService.getCurrentMonth()
        })
    }
}