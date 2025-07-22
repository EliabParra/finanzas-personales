import { Modal } from './../UI/Modal.js'
import { CategoriesService } from '../../services/CategoriesService.js'

export class Categories {
    constructor() {

    }

    async render() {
        const categoriesPage = document.createElement('div')
        categoriesPage.classList.add('categories')
        categoriesPage.dataset.page = 'categories'
        categoriesPage.innerHTML = `
            <!-- Sección de Gestión de Categorías -->
            <div class="card" data-aos="fade-up">
                <div class="card-header">
                    <h2 class="card-title">Mis Categorías 🏷️</h2>
                    <button class="btn" id="openCategoryModalBtn"><i class="fas fa-plus-circle"></i> Nueva Categoría</button>
                </div>

                <div class="categories-grid" data-aos="fade-up" data-aos-delay="50" id="categoriesGrid">
                    
                </div>
            </div>
        `

        this.categoriesGrid = categoriesPage.querySelector('#categoriesGrid')
        this.categoryModal = new Modal('category', categoriesPage, this.handleSubmit.bind(this))
        categoriesPage.appendChild(await this.categoryModal.render())
        await CategoriesService.renderCategories(
            await CategoriesService.getCategories(), 
            this.categoriesGrid, 
            this.categoryModal
        )

        return categoriesPage
    }

    async handleSubmit(data) {
        data.id = parseInt(data.id)
        if (data.id) {
            data.id = parseInt(data.id)
            await CategoriesService.updateCategory(data)
        } else {
            delete data.id
            await CategoriesService.addCategory(data)
        }
        await CategoriesService.renderCategories(
            await CategoriesService.getCategories(), 
            this.categoriesGrid, 
            this.categoryModal
        )
    }
}