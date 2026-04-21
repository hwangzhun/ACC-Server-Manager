import { ref } from 'vue'
import { confirm as tauriConfirm } from '@tauri-apps/plugin-dialog'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotifyOptions {
  type?: NotificationType
  message: string
  duration?: number
}

interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'info' | 'error'
}

interface NotifyInstance {
  id: number
  visible: boolean
  type: NotificationType
  message: string
  duration: number
}

let notifyId = 0
const notifications = ref<NotifyInstance[]>([])

function addNotification(options: NotifyOptions): number {
  const id = ++notifyId
  const notification: NotifyInstance = {
    id,
    visible: true,
    type: options.type || 'info',
    message: options.message,
    duration: options.duration ?? 3000
  }
  
  notifications.value.push(notification)
  
  if (notification.duration > 0) {
    setTimeout(() => {
      removeNotification(id)
    }, notification.duration)
  }
  
  return id
}

function removeNotification(id: number) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value[index].visible = false
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }, 300)
  }
}

function success(message: string, duration?: number) {
  return addNotification({ type: 'success', message, duration })
}

function error(message: string, duration?: number) {
  return addNotification({ type: 'error', message, duration: duration ?? 5000 })
}

function warning(message: string, duration?: number) {
  return addNotification({ type: 'warning', message, duration })
}

function info(message: string, duration?: number) {
  return addNotification({ type: 'info', message, duration })
}

function confirm(options: ConfirmOptions): Promise<boolean> {
  if (typeof window !== 'undefined' && (window as { __TAURI__?: unknown }).__TAURI__) {
    return tauriConfirm(options.message, {
      title: options.title,
      kind: options.type ?? 'info',
      okLabel: options.confirmText || '确定',
      cancelLabel: options.cancelText || '取消'
    })
  }

  return new Promise((resolve) => {
    const overlay = document.createElement('div')
    overlay.className = 'win11-confirm-overlay'
    document.body.appendChild(overlay)
    
    const container = document.createElement('div')
    container.className = 'win11-confirm-container'
    
    const iconSvg = options.type === 'warning' 
      ? '<svg class="win11-confirm-icon win11-confirm-icon--warning" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
      : options.type === 'error'
      ? '<svg class="win11-confirm-icon win11-confirm-icon--error" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 9l-6 6M9 9l6 6"/></svg>'
      : '<svg class="win11-confirm-icon win11-confirm-icon--info" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v-4M12 8h.01"/></svg>'
    
    container.innerHTML = `
      <div class="win11-confirm-content">
        ${iconSvg}
        <div class="win11-confirm-text">
          <div class="win11-confirm-title">${options.title}</div>
          <div class="win11-confirm-message">${options.message}</div>
        </div>
      </div>
      <div class="win11-confirm-actions">
        <button class="win11-confirm-cancel">${options.cancelText || '取消'}</button>
        <button class="win11-confirm-ok">${options.confirmText || '确定'}</button>
      </div>
    `
    
    document.body.appendChild(container)
    
    const cancelBtn = container.querySelector('.win11-confirm-cancel')!
    const okBtn = container.querySelector('.win11-confirm-ok')!
    
    const cleanup = (result: boolean) => {
      container.classList.add('win11-confirm-leave')
      overlay.classList.add('win11-confirm-overlay-leave')
      setTimeout(() => {
        document.body.removeChild(container)
        document.body.removeChild(overlay)
      }, 200)
      resolve(result)
    }
    
    cancelBtn.addEventListener('click', () => cleanup(false))
    okBtn.addEventListener('click', () => cleanup(true))
    overlay.addEventListener('click', () => cleanup(false))
  })
}

const notify = {
  success,
  error,
  warning,
  info,
  confirm,
  remove: removeNotification,
  notifications
}

export default notify

const style = document.createElement('style')
style.textContent = `
.win11-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  animation: win11-confirm-fade-in 0.2s ease;
}

.win11-confirm-overlay-leave {
  animation: win11-confirm-fade-out 0.2s ease forwards;
}

.win11-confirm-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3001;
  width: 400px;
  max-width: 90vw;
  background: var(--win11-surface);
  border: 1px solid var(--win11-border);
  border-radius: 12px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
  animation: win11-confirm-scale-in 0.2s ease;
}

.win11-confirm-leave {
  animation: win11-confirm-scale-out 0.2s ease forwards;
}

.win11-confirm-content {
  display: flex;
  gap: 16px;
  padding: 24px;
}

.win11-confirm-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.win11-confirm-icon--warning {
  color: #ff8c00;
}

.win11-confirm-icon--error {
  color: #d13438;
}

.win11-confirm-icon--info {
  color: #0078d4;
}

.win11-confirm-text {
  flex: 1;
}

.win11-confirm-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--win11-text);
  margin-bottom: 8px;
}

.win11-confirm-message {
  font-size: 14px;
  color: var(--win11-text-secondary);
  line-height: 1.5;
}

.win11-confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--win11-border);
}

.win11-confirm-cancel,
.win11-confirm-ok {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.win11-confirm-cancel {
  background: var(--win11-control-bg);
  color: var(--win11-text);
}

.win11-confirm-cancel:hover {
  background: var(--win11-control-hover-bg);
}

.win11-confirm-ok {
  background: var(--win11-accent);
  color: #ffffff;
}

.win11-confirm-ok:hover {
  background: var(--win11-accent-hover);
}

@keyframes win11-confirm-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes win11-confirm-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes win11-confirm-scale-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes win11-confirm-scale-out {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
}
`
document.head.appendChild(style)
