import DB from '../classes/DB.js'

const DEFAULT_CATEGORIES = [
    { name: 'Alimentación', icon: '☕', color: '#FF7043' },
    { name: 'Transporte', icon: '🚌', color: '#AB47BC' },
    { name: 'Ocio', icon: '📺', color: '#26C6DA' },
    { name: 'Servicios', icon: '💻', color: '#FFCA28' },
    { name: 'Salud', icon: '💊', color: '#EF5350' },
    { name: 'Educación', icon: '🏫', color: '#7986CB' },
    { name: 'Otros', icon: '…', color: '#9E9E9E' },
]

export class CategoriesService {
    static async resetCategories() {
        try {
            const db = new DB('finanzas-personales', 'categories')
            await db.clearItems()
            for (const category of DEFAULT_CATEGORIES) {
                await db.addItem(category)
            }
        } catch (error) {
            throw new Error(`Error al resetear categorías: ${error}`)
        }
    }

    static async getCategories() {
        try {
            const db = new DB('finanzas-personales', 'categories')
            let categories = await db.getAllItems()

            if (categories.length === 0) {
                await this.resetCategories()
                categories = await db.getAllItems()
            }

            return categories
        } catch (error) {
            throw new Error(`Error al obtener categorías: ${error}`)
            return []
        }
    }

    static async getCategory(id) {
        try {
            const db = new DB('finanzas-personales', 'categories')
            const category = await db.getItem(id)
            return category
        } catch (error) {
            throw new Error(`Error al obtener categoría: ${error}`)
            return {}
        }
    }

    static async addCategory(categoryData) {
        try {
            const db = new DB('finanzas-personales', 'categories')
            await db.addItem(categoryData)
        } catch (error) {
            throw new Error(`Error al añadir categoría: ${error}`)
        }
    }

    static async updateCategory(category) {
        try {
            const db = new DB('finanzas-personales', 'categories')
            await db.updateItem(category)
        } catch (error) {
            throw new Error(`Error al actualizar categoría: ${error}`)
        }
    }

    static async deleteCategory(id) {
        try {
            const db = new DB('finanzas-personales', 'categories')
            await db.deleteItem(id)
        } catch (error) {
            throw new Error(`Error al eliminar categoría: ${error}`)
        }
    }

    static async renderCategories(categories, categoriesGrid, categoryModal) {
        if (!categoriesGrid) return

        categoriesGrid.innerHTML = ''

        categories
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(category => {
            const categoryItem = document.createElement('div')
            categoryItem.classList.add('category-item')
            categoryItem.dataset.categoryId = category.id
            categoryItem.dataset.categoryName = category.name
            categoryItem.dataset.categoryIcon = category.icon
            categoryItem.dataset.categoryColor = category.color
            categoryItem.innerHTML = `
                <div class="category-info">
                    <div class="category-icon-wrapper" style="background-color: ${category.color};">
                        ${category.icon}
                    </div>
                    <span class="category-name">${category.name}</span>
                </div>
                <div class="category-actions">
                    <button class="category-action-btn edit" title="Editar" data-category-id="${category.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="category-action-btn delete" title="Eliminar" data-category-id="${category.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `
            categoriesGrid.appendChild(categoryItem)
        })

        const editCategoryBtns = categoriesGrid.querySelectorAll('.category-action-btn.edit')
        const deleteCategoryBtns = categoriesGrid.querySelectorAll('.category-action-btn.delete')

        editCategoryBtns.forEach(editCategoryBtn => {
            editCategoryBtn.addEventListener('click', async () => {
                const id = parseInt(editCategoryBtn.dataset.categoryId)
                const category = await CategoriesService.getCategory(id)
                categoryModal.setData(category)
                categoryModal.openModal()
            })
        })

        deleteCategoryBtns.forEach(deleteCategoryBtn => {
            deleteCategoryBtn.addEventListener('click', async () => {
                const id = parseInt(deleteCategoryBtn.dataset.categoryId)
                await CategoriesService.deleteCategory(id)
                await CategoriesService.renderCategories(
                    await CategoriesService.getCategories(), 
                    categoriesGrid, 
                    categoryModal
                )
            })
        })
    }
}