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

            <!-- MODAL PARA AGREGAR/EDITAR CATEGORÍA -->
            <div class="modal-overlay" id="categoryModal">
                <div class="modal-content">
                    <button class="modal-close-btn" id="closeCategoryModalBtn">&times;</button>
                    <h3 class="modal-title" id="categoryModalTitle">Nueva Categoría ➕</h3>
                    <form id="categoryForm">
                        <input type="hidden" id="categoryId"> <!-- Para almacenar el ID de la categoría a editar -->
                        <div class="form-group">
                            <label for="categoryName">Nombre de la Categoría</label>
                            <input type="text" id="categoryName" placeholder="Ej: Café, Gimnasio" required>
                        </div>
                        <div class="form-group">
                            <label for="categoryIcon">Icono (Clase de Font Awesome)</label>
                            <input type="text" id="categoryIcon" placeholder="Ej: fa-coffee, fa-dumbbell" required>
                            <small style="color: var(--text-light); font-size: 0.8em;">Busca iconos en <a href="https://fontawesome.com/icons" target="_blank" style="color: var(--primary-color); text-decoration: none;">Font Awesome</a> (ej: "fa-utensils")</small>
                        </div>
                        <div class="form-group">
                            <label for="categoryColor">Color</label>
                            <input type="color" id="categoryColor" value="#6a6ee0"> <!-- Color por defecto -->
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-cancel" id="cancelCategoryBtn">Cancelar</button>
                            <button type="submit" class="btn">Guardar Categoría</button>
                        </div>
                    </form>
                </div>
            </div>
        `

        // Lógica para abrir/cerrar el modal
        setTimeout(() => {
            const openBtn = categories.querySelector('#openCategoryModalBtn')
            const closeBtn = categories.querySelector('#closeCategoryModalBtn')
            const cancelBtn = categories.querySelector('#cancelCategoryBtn')
            const modal = categories.querySelector('#categoryModal')

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

        return categories
    }
}