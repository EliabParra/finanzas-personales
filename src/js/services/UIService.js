import { TransactionsService } from "./TransactionsService.js"
import { BudgetsService } from "./BudgetsService.js"

export class UIService {
    static getMonthName(month) {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ]
        return months[month - 1] || ''
    }

    static formatCurrency(amount) {
        amount = parseFloat(amount)
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    static formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Caracas' }
        return new Date(date).toLocaleDateString('es-ES', options)
    }

    static getCurrentDate() {
        const formatter = new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'America/Caracas',
        })

        const formattedDate = formatter.format(new Date())
        return formattedDate
    }

    static getCurrentMonth() {
        return new Date().getMonth() + 1
    }

    static getCurrentYear() {
        return new Date().getFullYear()
    }

    static getCurrentMonthName() {
        return this.getMonthName(this.getCurrentMonth())
    }

    static getCurrentMonthYear() {
        return `${this.getCurrentMonthName()} ${this.getCurrentYear()}`
    }

    static updateData() {
        TransactionsService.updateBalance()
        BudgetsService.updateMonthlySummary()
    }
}