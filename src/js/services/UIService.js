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
        return new Intl.NumberFormat('en-EN', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    static formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(date + 1).toLocaleDateString('es-ES', options)
    }

    static getCurrentDate() {
        return new Date().toISOString().split('T')[0]
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
}