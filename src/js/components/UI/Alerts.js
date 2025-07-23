export class Alerts {
    static showAlert(type, message) {
        const alert = document.createElement('div')
        alert.classList.add('alert')
        alert.classList.add(`alert-${type}`)

        let icon = ''
        if (type === 'danger') icon = '🔥'
        if (type === 'success') icon = '🦅'

        const closeBtn = document.createElement('button')
        closeBtn.classList.add('close-alert-btn')
        closeBtn.innerHTML = '✖'
        closeBtn.onclick = () => alert.remove()
        alert.innerHTML = `
            <span class="alert-icon">${icon}</span> 
            <span class="alert-message">${message}</span>
        `
        alert.appendChild(closeBtn)
        document.body.appendChild(alert)
    }

    static removeAlert(alert) {
        alert.remove()
    }
}