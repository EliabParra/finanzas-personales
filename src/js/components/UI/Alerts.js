export class Alerts {
    static showAlert(type, message) {
        const alert = document.createElement('div')
        alert.classList.add('alert')
        alert.classList.add(`alert-${type}`)
        // Icono temático
        let icon = ''
        if (type === 'danger') icon = '🔥'
        if (type === 'success') icon = '🦅'
        // Botón de cierre
        const closeBtn = document.createElement('button')
        closeBtn.innerHTML = '✖'
        closeBtn.style.background = 'none'
        closeBtn.style.border = 'none'
        closeBtn.style.color = '#FFD700'
        closeBtn.style.fontSize = '2.2em'
        closeBtn.style.fontWeight = 'bold'
        closeBtn.style.cursor = 'pointer'
        closeBtn.style.marginLeft = '24px'
        closeBtn.style.transition = 'color 0.2s'
        closeBtn.onmouseover = () => closeBtn.style.color = '#FF9800'
        closeBtn.onmouseout = () => closeBtn.style.color = '#FFD700'
        closeBtn.onclick = () => alert.remove()
        alert.innerHTML = `<span class="alert-icon" style="font-size:2.2em;">${icon}</span> <span class="alert-message">${message}</span>`
        alert.appendChild(closeBtn)
        // Estilo visual fuerte y grande
        alert.style.position = 'fixed'
        alert.style.top = '60px'
        alert.style.left = '50%'
        alert.style.transform = 'translateX(-50%)'
        alert.style.zIndex = '4000'
        alert.style.background = 'rgba(20, 20, 20, 0.98)'
        alert.style.border = '4px solid #FFD700'
        alert.style.boxShadow = '0 0 48px 16px #FFD700, 0 0 64px 24px #FF9800'
        alert.style.color = '#FFD700'
        alert.style.fontFamily = 'Orbitron, sans-serif'
        alert.style.fontSize = '2em'
        alert.style.fontWeight = 'bold'
        alert.style.padding = '32px 64px'
        alert.style.borderRadius = '24px'
        alert.style.textAlign = 'center'
        alert.style.letterSpacing = '2px'
        alert.style.display = 'flex'
        alert.style.alignItems = 'center'
        alert.style.gap = '32px'
        alert.style.maxWidth = '95vw'
        alert.style.minWidth = '420px'
        alert.style.pointerEvents = 'auto'
        alert.style.opacity = '0.99'
        document.body.appendChild(alert)
    }
}