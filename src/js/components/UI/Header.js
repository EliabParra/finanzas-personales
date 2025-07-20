import LS from "../../classes/LocalStorage.js";

export class Header {
    constructor(onPageChange) {
        this.onPageChange = onPageChange
        this.currentPage = LS.getItem('currentPage')
    }

    setCurrentPage(page) {
        this.currentPage = page
        LS.setItem('currentPage', page)
    }

    async render() {
        const header = document.createElement('header')
        header.classList.add('header')
        header.innerHTML = `
            <button class="nav-item ${this.currentPage === 'dashboard' ? 'active' : ''}" data-page="dashboard">
                <i class="fas fa-home"></i> 
                Dashboard
            </button>
            <button class="nav-item ${this.currentPage === 'transactions' ? 'active' : ''}" data-page="transactions">
                <i class="fas fa-exchange-alt"></i> 
                Transacciones
            </button>
            <button class="nav-item ${this.currentPage === 'categories' ? 'active' : ''}" data-page="categories">
                <i class="fas fa-tags"></i> 
                Categorías
            </button>
            <button class="nav-item ${this.currentPage === 'budgets' ? 'active' : ''}" data-page="budgets">
                <i class="fas fa-chart-pie"></i> 
                Presupuestos
            </button>
            <button class="nav-item ${this.currentPage === 'analysis' ? 'active' : ''}" data-page="analysis">
                <i class="fas fa-chart-line"></i> 
                Análisis
            </button>
        `

        const navItems = header.querySelectorAll('.nav-item')
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page
                this.setCurrentPage(page)
                this.onPageChange(page)
                navItems.forEach(nav => nav.classList.remove('active'))
                item.classList.add('active')
                console.log(`Navegando a: ${page}`)
            })
        })

        return header
    }

    handlePageClick(page) {
        // Actualizar botones activos
        const buttons = document.querySelectorAll('.page-btn');
        buttons.forEach(button => {
            button.classList.toggle('active', button.dataset.page === page);
        });

        // Notificar al componente principal
        if (this.onPageChange) {
            this.onPageChange(page);
        }
    }
}