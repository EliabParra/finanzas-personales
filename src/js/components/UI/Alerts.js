export class Alerts {
    constructor() {
        this.alertsDiv = document.createElement('div')
        this.alertsDiv.classList.add('alerts')
    }

    static getAlerts(alerts) {
        alerts.forEach(alert => this.showAlert(alert.type, alert.message))
    }

    static showAlert(type, message) {
        const alert = document.createElement('div')
        alert.classList.add('alert')
        alert.classList.add(`alert-${type}`)
        alert.innerHTML = message
        this.alertsDiv.appendChild(alert)

        setTimeout(() => {
            alert.classList.add('fade-out')
            setTimeout(() => {
                alert.remove()
            }, 500)
        }, 3000)
    }
}