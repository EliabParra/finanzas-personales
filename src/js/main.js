import { Header } from './Components/Header.js'
import { Dashboard } from './Components/Dashboard.js'
import { Transactions } from './Components/Transactions.js'
import { Categories } from './Components/Categories.js'
import { Budgets } from './Components/Budgets.js'
import { Analysis } from './Components/Analysis.js'

class App {
    constructor() {
        this.currentPage = 'dashboard'
        this.header = new Header(this.handlePageChange.bind(this))
        this.dashboard = new Dashboard()
        this.transactions = new Transactions()
        this.categories = new Categories()
        this.budgets = new Budgets()
        this.analysis = new Analysis()
    }

    async render() {
        const appContainer = document.querySelector('#app')
        appContainer.innerHTML = ''

        // Crear header
        const header = await this.header.render()
        appContainer.appendChild(header)

        // Crear contenido principal
        const mainContent = document.createElement('main')
        mainContent.className = 'main-content'

        appContainer.appendChild(mainContent)

        // Mostrar la pestaña inicial
        await this.handlePageChange(this.currentPage)
    }

    async handlePageChange(page) {
        this.currentTab = page
        const mainContent = document.querySelector('.main-content')
        if (!mainContent) return

        mainContent.innerHTML = ''

        let component = ''
        switch (page) {
            case 'dashboard':
                component = await this.dashboard.render()
                break
            case 'transactions':
                component = await this.transactions.render()
                break
            case 'categories':
                component = await this.categories.render()
                break
            case 'budgets':
                component = await this.budgets.render()
                break
            case 'analysis':
                component = await this.analysis.render()
                break
        }

        if (component) mainContent.appendChild(component)
        
        if (window.AOS) {
            setTimeout(() => {
                AOS.refreshHard()
            }, 0)
        }
    }

    async init() {
        await this.render()
        if (window.AOS) {
            AOS.init({
                duration: 500,
                once: true,
            })
        }
    }
}

const app = new App()
app.init()