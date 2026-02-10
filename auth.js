// Sistema de Autenticación y Licencias
const AUTH_CONFIG = {
    // Lista de licencias válidas
    validLicenses: {
        'CHZ1-2024-ABCD-1234': {
            password: 'admin123',
            username: 'Usuario Premium',
            expiryDate: '2025-12-31',
            features: ['all']
        },
        'CHZ1-2024-EFGH-5678': {
            password: 'user456',
            username: 'Usuario VIP',
            expiryDate: '2025-06-30',
            features: ['all']
        },
        'CHZ1-2024-IJKL-9012': {
            password: 'test789',
            username: 'Usuario Test',
            expiryDate: '2025-03-31',
            features: ['basic']
        }
    },
    
    // Configuración de sesión
    sessionDuration: 24 * 60 * 60 * 1000, // 24 horas
    maxLoginAttempts: 3,
    lockoutDuration: 15 * 60 * 1000 // 15 minutos
};

// Sistema de Notificaciones
const NotificationSystem = {
    container: null,
    
    init() {
        this.container = document.getElementById('notification-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            document.body.appendChild(this.container);
        }
    },
    
    show(title, message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconMap = {
            success: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            </svg>`,
            error: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>`,
            warning: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 20h20L12 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="17" r="1" fill="currentColor"/>
            </svg>`,
            info: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="8" r="1" fill="currentColor"/>
            </svg>`
        };
        
        notification.innerHTML = `
            <div class="notification-icon">${iconMap[type]}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        this.container.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('removing');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
};

// Sistema de Validación de Licencias
const LicenseValidator = {
    // Validar formato de licencia
    validateFormat(key) {
        const pattern = /^CHZ1-\d{4}-[A-Z]{4}-\d{4}$/;
        return pattern.test(key);
    },
    
    // Verificar si la licencia existe
    isValid(key) {
        return AUTH_CONFIG.validLicenses.hasOwnProperty(key);
    },
    
    // Verificar si la licencia ha expirado
    isExpired(key) {
        if (!this.isValid(key)) return true;
        
        const license = AUTH_CONFIG.validLicenses[key];
        const expiryDate = new Date(license.expiryDate);
        const today = new Date();
        
        return today > expiryDate;
    },
    
    // Verificar contraseña
    validatePassword(key, password) {
        if (!this.isValid(key)) return false;
        return AUTH_CONFIG.validLicenses[key].password === password;
    },
    
    // Obtener información de la licencia
    getLicenseInfo(key) {
        if (!this.isValid(key)) return null;
        return AUTH_CONFIG.validLicenses[key];
    }
};

// Sistema de Gestión de Intentos de Login
const LoginAttempts = {
    getAttempts() {
        const attempts = localStorage.getItem('loginAttempts');
        return attempts ? JSON.parse(attempts) : { count: 0, timestamp: null };
    },
    
    setAttempts(count) {
        const data = {
            count: count,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('loginAttempts', JSON.stringify(data));
    },
    
    increment() {
        const attempts = this.getAttempts();
        this.setAttempts(attempts.count + 1);
    },
    
    reset() {
        this.setAttempts(0);
    },
    
    isLocked() {
        const attempts = this.getAttempts();
        if (attempts.count >= AUTH_CONFIG.maxLoginAttempts) {
            const timePassed = new Date().getTime() - attempts.timestamp;
            if (timePassed < AUTH_CONFIG.lockoutDuration) {
                return {
                    locked: true,
                    remaining: Math.ceil((AUTH_CONFIG.lockoutDuration - timePassed) / 60000)
                };
            } else {
                this.reset();
                return { locked: false };
            }
        }
        return { locked: false };
    }
};

// Sistema de Sesión
const SessionManager = {
    createSession(licenseKey) {
        const licenseInfo = LicenseValidator.getLicenseInfo(licenseKey);
        const session = {
            licenseKey: licenseKey,
            username: licenseInfo.username,
            features: licenseInfo.features,
            loginTime: new Date().getTime(),
            expiryTime: new Date().getTime() + AUTH_CONFIG.sessionDuration
        };
        
        localStorage.setItem('userSession', JSON.stringify(session));
        LoginAttempts.reset();
    },
    
    getSession() {
        const session = localStorage.getItem('userSession');
        return session ? JSON.parse(session) : null;
    },
    
    isSessionValid() {
        const session = this.getSession();
        if (!session) return false;
        
        const now = new Date().getTime();
        if (now > session.expiryTime) {
            this.destroySession();
            return false;
        }
        
        return true;
    },
    
    destroySession() {
        localStorage.removeItem('userSession');
    }
};

// Formatear input de licencia automáticamente
function formatLicenseKey(input) {
    let value = input.value.replace(/[^A-Z0-9]/g, '');
    let formatted = '';
    
    if (value.length > 0) formatted += value.substr(0, 4);
    if (value.length > 4) formatted += '-' + value.substr(4, 4);
    if (value.length > 8) formatted += '-' + value.substr(8, 4);
    if (value.length > 12) formatted += '-' + value.substr(12, 4);
    
    input.value = formatted.toUpperCase();
}

// Inicialización cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema de notificaciones
    NotificationSystem.init();
    
    // Inicializar iconos
    const logoIcon = document.getElementById('logo-icon');
    const keyIcon = document.getElementById('key-icon');
    const lockIcon = document.getElementById('lock-icon');
    const arrowIcon = document.getElementById('arrow-icon');
    
    if (logoIcon && Icons.security) logoIcon.innerHTML = Icons.security;
    if (keyIcon && Icons.aimbot) keyIcon.innerHTML = Icons.aimbot;
    if (lockIcon && Icons.lock) lockIcon.innerHTML = Icons.lock;
    if (arrowIcon) {
        arrowIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <polyline points="12 5 19 12 12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    }
    
    // Verificar si ya hay una sesión válida
    if (SessionManager.isSessionValid()) {
        NotificationSystem.show(
            'Sesión Ativa',
            'Redirecionando para o painel...',
            'info',
            2000
        );
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        return;
    }
    
    // Formatear input de licencia
    const licenseInput = document.getElementById('license-key');
    licenseInput.addEventListener('input', function() {
        formatLicenseKey(this);
    });
    
    // Manejar envío del formulario
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Verificar si está bloqueado
        const lockStatus = LoginAttempts.isLocked();
        if (lockStatus.locked) {
            NotificationSystem.show(
                'Conta Bloqueada',
                `Muitas tentativas incorretas. Tente novamente em ${lockStatus.remaining} minutos.`,
                'error',
                6000
            );
            return;
        }
        
        const licenseKey = licenseInput.value.trim();
        const password = document.getElementById('password').value;
        
        // Validar campos vacíos
        if (!licenseKey || !password) {
            NotificationSystem.show(
                'Campos Obrigatórios',
                'Por favor, preencha todos os campos.',
                'warning'
            );
            return;
        }
        
        // Mostrar loading
        loginBtn.classList.add('loading');
        loginBtn.querySelector('.btn-text').textContent = 'Verificando...';
        
        // Simular delay de verificación
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Validar formato
        if (!LicenseValidator.validateFormat(licenseKey)) {
            loginBtn.classList.remove('loading');
            loginBtn.querySelector('.btn-text').textContent = 'Acessar Sistema';
            
            NotificationSystem.show(
                'Formato Inválido',
                'O formato da chave de licença está incorreto.',
                'error'
            );
            LoginAttempts.increment();
            return;
        }
        
        // Validar existencia de licencia
        if (!LicenseValidator.isValid(licenseKey)) {
            loginBtn.classList.remove('loading');
            loginBtn.querySelector('.btn-text').textContent = 'Acessar Sistema';
            
            NotificationSystem.show(
                'Licença Não Encontrada',
                'Esta chave de licença não está registrada no sistema.',
                'error'
            );
            LoginAttempts.increment();
            return;
        }
        
        // Verificar expiración
        if (LicenseValidator.isExpired(licenseKey)) {
            loginBtn.classList.remove('loading');
            loginBtn.querySelector('.btn-text').textContent = 'Acessar Sistema';
            
            NotificationSystem.show(
                'Licença Expirada',
                'Sua licença expirou. Entre em contato para renovar.',
                'warning',
                6000
            );
            return;
        }
        
        // Validar contraseña
        if (!LicenseValidator.validatePassword(licenseKey, password)) {
            loginBtn.classList.remove('loading');
            loginBtn.querySelector('.btn-text').textContent = 'Acessar Sistema';
            
            NotificationSystem.show(
                'Senha Incorreta',
                'A senha fornecida está incorreta.',
                'error'
            );
            LoginAttempts.increment();
            
            const attempts = LoginAttempts.getAttempts();
            const remaining = AUTH_CONFIG.maxLoginAttempts - attempts.count;
            if (remaining > 0) {
                NotificationSystem.show(
                    'Aviso',
                    `Você tem ${remaining} tentativa(s) restante(s).`,
                    'warning',
                    4000
                );
            }
            return;
        }
        
        // Login exitoso
        const licenseInfo = LicenseValidator.getLicenseInfo(licenseKey);
        
        NotificationSystem.show(
            'Login Bem-Sucedido!',
            `Bem-vindo, ${licenseInfo.username}!`,
            'success',
            2000
        );
        
        // Crear sesión
        SessionManager.createSession(licenseKey);
        
        // Redirigir al dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    });
});

// Función para logout (usar en dashboard)
function logout() {
    SessionManager.destroySession();
    NotificationSystem.show(
        'Sessão Encerrada',
        'Você foi desconectado com sucesso.',
        'info',
        2000
    );
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Exponer funciones globales
window.logout = logout;
window.NotificationSystem = NotificationSystem;
window.SessionManager = SessionManager;
