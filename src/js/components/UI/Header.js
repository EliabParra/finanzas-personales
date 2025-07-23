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
            <button class="open-menu-btn" id="openMenuBtn"><i class="fas fa-bars"></i></button>
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
                this.updateActivePage(page)
            })
        })

        const openMenuBtn = header.querySelector('#openMenuBtn')
        openMenuBtn.addEventListener('click', () => {
            if (header.classList.contains('open')) {
                header.classList.remove('open')
                openMenuBtn.innerHTML = '<i class="fas fa-bars"></i>'
            } else {
                header.classList.add('open')
                openMenuBtn.innerHTML = '<i class="fas fa-times"></i>'
            }
        })

        return header
    }

    async updateActivePage(page) {
        const navItems = document.querySelectorAll('.nav-item')
        navItems.forEach(item => {
            item.classList.remove('active')
            if (item.dataset.page === page) {
                item.classList.add('active')
            }
        })
    }
}