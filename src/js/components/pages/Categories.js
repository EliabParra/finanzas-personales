import { Modal } from './../UI/Modal.js'

export class Categories {
    constructor() {

    }

    async render() {
        const categories = document.createElement('div')
        categories.classList.add('categories')
        categories.dataset.page = 'categories'
        categories.innerHTML = `
            <!-- Sección de Gestión de Categorías -->
            <div class="card" data-aos="fade-up">
                <div class="card-header">
                    <h2 class="card-title">Mis Categorías 🏷️</h2>
                    <button class="btn" id="openCategoryModalBtn"><i class="fas fa-plus-circle"></i> Nueva Categoría</button>
                </div>

                <div class="categories-grid" data-aos="fade-up" data-aos-delay="50">
                    <!-- Categorías predefinidas -->
                    <div class="category-item" data-category-id="1" data-category-name="Alimentación" data-category-icon="fa-utensils" data-category-color="#FF7043">
                        <div class="category-info">
                            <div class="category-icon-wrapper" style="background-color: #FF7043;">
                                <i class="fas fa-utensils"></i>
                            </div>
                            <span class="category-name">Alimentación</span>
                        </div>
                        <div class="category-actions">
                            <button class="category-action-btn edit" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <!-- Las categorías predefinidas no deberían ser eliminables, pero se incluye el botón para ejemplo -->
                            <button class="category-action-btn delete" title="Eliminar">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="category-item" data-category-id="2" data-category-name="Transporte" data-category-icon="fa-bus" data-category-color="#AB47BC">
                        <div class="category-info">
                            <div class="category-icon-wrapper" style="background-color: #AB47BC;">
                                <i class="fas fa-bus"></i>
                            </div>
                            <span class="category-name">Transporte</span>
                        </div>
                        <div class="category-actions">
                            <button class="category-action-btn edit" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="category-action-btn delete" title="Eliminar">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="category-item" data-category-id="3" data-category-name="Ocio" data-category-icon="fa-film" data-category-color="#26C6DA">
                        <div class="category-info">
                            <div class="category-icon-wrapper" style="background-color: #26C6DA;">
                                <i class="fas fa-film"></i>
                            </div>
                            <span class="category-name">Ocio</span>
                        </div>
                        <div class="category-actions">
                            <button class="category-action-btn edit" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="category-action-btn delete" title="Eliminar">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="category-item" data-category-id="4" data-category-name="Servicios" data-category-icon="fa-lightbulb" data-category-color="#FFCA28">
                        <div class="category-info">
                            <div class="category-icon-wrapper" style="background-color: #FFCA28;">
                                <i class="fas fa-lightbulb"></i>
                            </div>
                            <span class="category-name">Servicios</span>
                        </div>
                        <div class="category-actions">
                            <button class="category-action-btn edit" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="category-action-btn delete" title="Eliminar">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="category-item" data-category-id="5" data-category-name="Salud" data-category-icon="fa-heartbeat" data-category-color="#EF5350">
                        <div class="category-info">
                            <div class="category-icon-wrapper" style="background-color: #EF5350;">
                                <i class="fas fa-heartbeat"></i>
                            </div>
                            <span class="category-name">Salud</span>
                        </div>
                        <div class="category-actions">
                            <button class="category-action-btn edit" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="category-action-btn delete" title="Eliminar">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="category-item" data-category-id="6" data-category-name="Educación" data-category-icon="fa-graduation-cap" data-category-color="#7986CB">
                        <div class="category-info">
                            <div class="category-icon-wrapper" style="background-color: #7986CB;">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                            <span class="category-name">Educación</span>
                        </div>
                        <div class="category-actions">
                            <button class="category-action-btn edit" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="category-action-btn delete" title="Eliminar">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="category-item" data-category-id="7" data-category-name="Otros" data-category-icon="fa-ellipsis-h" data-category-color="#9E9E9E">
                        <div class="category-info">
                            <div class="category-icon-wrapper" style="background-color: #9E9E9E;">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                            <span class="category-name">Otros</span>
                        </div>
                        <div class="category-actions">
                            <button class="category-action-btn edit" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="category-action-btn delete" title="Eliminar">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <!-- Categoría personalizada de ejemplo -->
                    <div class="category-item" data-category-id="8" data-category-name="Entretenimiento" data-category-icon="fa-gamepad" data-category-color="#FFD54F">
                        <div class="category-info">
                            <div class="category-icon-wrapper" style="background-color: #FFD54F;">
                                <i class="fas fa-gamepad"></i>
                            </div>
                            <span class="category-name">Entretenimiento</span>
                        </div>
                        <div class="category-actions">
                            <button class="category-action-btn edit" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="category-action-btn delete" title="Eliminar">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `

        const categoryModal = new Modal('category', categories)
        categories.appendChild(await categoryModal.render())

        return categories
    }
}