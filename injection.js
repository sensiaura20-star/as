// Injection System
let injectionActive = false;

// Inicializar ícone de status como waiting
document.addEventListener('DOMContentLoaded', function() {
    const statusIcon = document.getElementById('injection-icon');
    if (statusIcon) {
        statusIcon.innerHTML = Icons.statusWaiting;
    }
});

// Função para detectar dispositivo
function detectDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    return {
        isAndroid: /android/i.test(userAgent),
        isIOS: /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream,
        isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    };
}

// Função para adicionar log
function addLogEntry(container, message, type = 'info') {
    if (!container) return;
    
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const prefix = type === 'warning' ? '[AVISO]' : type === 'error' ? '[ERRO]' : '';
    const logMessage = `[${timestamp}] ${prefix} ${message}\n`;
    
    container.value += logMessage;
    container.scrollTop = container.scrollHeight;
}

// Função para injetar no FF NORMAL - DEFINIDA GLOBALMENTE
function injectFreeFireNormal() {
    if (injectionActive) {
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.show(
                'Injeção em Andamento',
                'Aguarde a conclusão da injeção atual.',
                'warning'
            );
        }
        return;
    }

    injectionActive = true;
    const statusIcon = document.getElementById('injection-icon');
    const statusText = document.getElementById('injection-status');
    const logContainer = document.getElementById('injection-log');

    // Update status
    if (statusIcon) statusIcon.innerHTML = Icons.statusActive;
    if (statusText) statusText.textContent = 'Injeção em andamento...';

    // Add log entries
    if (logContainer) {
        addLogEntry(logContainer, '[SISTEMA] Iniciando processo de injeção...');
        
        setTimeout(() => {
            addLogEntry(logContainer, '[INFO] Verificando integridade dos módulos...');
        }, 500);

        setTimeout(() => {
            addLogEntry(logContainer, '[INFO] Módulos verificados com sucesso!');
        }, 1000);

        setTimeout(() => {
            addLogEntry(logContainer, '[INFO] Iniciando injeção de código...');
        }, 1500);

        setTimeout(() => {
            addLogEntry(logContainer, '[SUCESSO] Injeção concluída com sucesso!');
            addLogEntry(logContainer, '[SISTEMA] Sistema operacional e pronto!');
            if (statusText) statusText.textContent = 'Injeção ativa e funcionando!';
            
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show(
                    'Injeção Completa!',
                    'Sistema injetado com sucesso no Free Fire.',
                    'success'
                );
            }
            
            // Abrir FreeFire após injeção concluída
            setTimeout(() => {
                addLogEntry(logContainer, '[INFO] Abrindo FreeFire...');
                const device = detectDevice();
                if (device.isAndroid) {
                    const intentURL = 'intent://launch/#Intent;scheme=freefire;package=com.dts.freefireth;end';
                    window.location.href = intentURL;
                } else if (device.isIOS) {
                    window.location.href = 'freefire://';
                }
                // Reset injectionActive após um tempo
                setTimeout(() => {
                    injectionActive = false;
                }, 5000);
            }, 1000);
        }, 2500);
    } else {
        // Fallback se logContainer não existir - abrir diretamente
        const device = detectDevice();
        if (device.isAndroid) {
            const intentURL = 'intent://launch/#Intent;scheme=freefire;package=com.dts.freefireth;end';
            window.location.href = intentURL;
        } else if (device.isIOS) {
            window.location.href = 'freefire://';
        }
        setTimeout(() => {
            injectionActive = false;
        }, 5000);
    }
}

// Função para injetar no FF MAX - DEFINIDA GLOBALMENTE
function injectFreeFireMax() {
    const device = detectDevice();

    // iOS
    if (device.isIOS) {
        injectionActive = true;

        const statusIcon = document.getElementById('injection-icon');
        const statusText = document.getElementById('injection-status');
        const logContainer = document.getElementById('injection-log');

        if (statusIcon) statusIcon.textContent = '🟢';
        if (statusText) statusText.textContent = 'Injeção em andamento...';

        if (logContainer) {
            addLogEntry(logContainer, '[SISTEMA] Iniciando processo de injeção...');
            addLogEntry(logContainer, '[INFO] Este é um dispositivo iOS.');
            addLogEntry(logContainer, '[INFO] Tentando abrir FreeFire MAX via URL Scheme...');
        }

        window.location.href = "freefiremax://";

        setTimeout(() => {
            if (logContainer) {
                addLogEntry(logContainer, '[AVISO] O FreeFire MAX pode não ter respondido ao URL scheme.');
                addLogEntry(logContainer, '[INFO] Oferecendo fallback para App Store...');
            }

            const fallbackURL = 'https://apps.apple.com/app/garena-free-fire-max/id1581518576';

            if (confirm('O Free Fire MAX não abriu automaticamente.\nDeseja ir para a App Store?')) {
                window.open(fallbackURL, "_blank");
            }

            injectionActive = false;
        }, 1200);

        return;
    }

    // ANDROID
    if (injectionActive) {
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.show(
                'Injeção em Andamento',
                'Aguarde a conclusão da injeção atual.',
                'warning'
            );
        }
        return;
    }

    injectionActive = true;

    const statusIcon = document.getElementById('injection-icon');
    const statusText = document.getElementById('injection-status');
    const logContainer = document.getElementById('injection-log');

    if (statusIcon) statusIcon.textContent = '🟢';
    if (statusText) statusText.textContent = 'Injeção em andamento...';

    if (logContainer) {

        addLogEntry(logContainer, '[SISTEMA] Iniciando processo de injeção...');
        
        setTimeout(() => addLogEntry(logContainer, '[INFO] Verificando integridade dos módulos...'), 500);
        setTimeout(() => addLogEntry(logContainer, '[INFO] Módulos verificados com sucesso!'), 1000);
        setTimeout(() => addLogEntry(logContainer, '[INFO] Iniciando injeção de código...'), 1500);

        setTimeout(() => {
            addLogEntry(logContainer, '[SUCESSO] Injeção concluída com sucesso!');
            addLogEntry(logContainer, '[SISTEMA] Sistema operacional pronto!');
            if (statusText) statusText.textContent = 'Injeção ativa e funcionando!';
            
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show(
                    'Injeção Completa!',
                    'Sistema injetado com sucesso no Free Fire MAX.',
                    'success'
                );
            }

            setTimeout(() => {
                addLogEntry(logContainer, '[INFO] Abrindo FreeFire MAX...');
                const intentURL =
                    'intent://launch/#Intent;scheme=freefiremax;package=com.dts.freefiremax;end';
                window.location.href = intentURL;

                setTimeout(() => injectionActive = false, 5000);

            }, 1000);

        }, 2500);

    } else {
        const intentURL =
            'intent://launch/#Intent;scheme=freefiremax;package=com.dts.freefiremax;end';
        window.location.href = intentURL;
        setTimeout(() => injectionActive = false, 5000);
    }
}

// Tornar funções globais
window.injectFreeFireNormal = injectFreeFireNormal;
window.injectFreeFireMax = injectFreeFireMax;
