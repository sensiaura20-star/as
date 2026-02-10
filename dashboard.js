// Dashboard Navigation
document.addEventListener('DOMContentLoaded', function() {
    const sections = {
        aim: { title: 'MIRA', icon: 'aimbot' },
        optimization: { title: 'OTIMIZAÇÃO', icon: 'misc' },
        drag: { title: 'ARRASTO', icon: 'weapon' },
        pro: { title: 'PRO PLAYER', icon: 'security' },
        injection: { title: 'INJEÇÃO', icon: 'injection' }
    };
    
    // Inicializar ícones do header
    const headerLogo = document.getElementById('header-logo');
    if (headerLogo && Icons.aimbot) {
        headerLogo.innerHTML = Icons.aimbot;
    }
    
    // Inicializar ícone do logout
    const logoutBtn = document.querySelector('.logout-icon');
    if (logoutBtn && Icons.close) {
        logoutBtn.innerHTML = Icons.close;
    }
    
    // Inicializar ícones das tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        const iconName = tab.getAttribute('data-section');
        const iconElement = tab.querySelector('.tab-icon');
        if (iconElement && sections[iconName] && Icons[sections[iconName].icon]) {
            iconElement.innerHTML = Icons[sections[iconName].icon];
        }
    });
    
    // Inicializar ícones dos section headers
    const sectionIcons = document.querySelectorAll('.section-icon');
    sectionIcons.forEach(icon => {
        const iconName = icon.getAttribute('data-icon');
        if (Icons[iconName]) {
            icon.innerHTML = Icons[iconName];
        }
    });
    
    // Inicializar ícones dos cards
    const cardIcons = document.querySelectorAll('.card-icon[data-icon]');
    cardIcons.forEach(icon => {
        const iconName = icon.getAttribute('data-icon');
        if (Icons[iconName]) {
            icon.innerHTML = Icons[iconName];
        }
    });
    
    // Inicializar ícones do drag selector
    const dragIcons = document.querySelectorAll('.drag-icon[data-icon]');
    dragIcons.forEach(icon => {
        const iconName = icon.getAttribute('data-icon');
        if (Icons[iconName]) {
            icon.innerHTML = Icons[iconName];
        }
    });
    
    // Inicializar ícone do pro mode
    const proModeIcon = document.querySelector('.pro-mode-icon[data-icon]');
    if (proModeIcon) {
        const iconName = proModeIcon.getAttribute('data-icon');
        if (Icons[iconName]) {
            proModeIcon.innerHTML = Icons[iconName];
        }
    }
    
    // Inicializar ícones das features do pro mode
    const featureIcons = document.querySelectorAll('.feature-icon-wrapper[data-icon]');
    featureIcons.forEach(icon => {
        const iconName = icon.getAttribute('data-icon');
        if (Icons[iconName]) {
            icon.innerHTML = Icons[iconName];
        }
    });
    
    // Inicializar ícone da injeção
    const injectionIcon = document.querySelector('.injection-icon[data-icon]');
    if (injectionIcon) {
        const iconName = injectionIcon.getAttribute('data-icon');
        if (Icons[iconName]) {
            injectionIcon.innerHTML = Icons[iconName];
        }
    }
    
    // Navigation tabs
    const contentSections = document.querySelectorAll('.section');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const sectionName = this.getAttribute('data-section');
            
            // Remove active class from all tabs and sections
            navTabs.forEach(t => t.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding section
            this.classList.add('active');
            const targetSection = document.getElementById(sectionName + '-section');
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
    
    // Hertz Slider
    const hertzSlider = document.getElementById('hertz-slider');
    const hertzValue = document.getElementById('hertz-value');
    if (hertzSlider && hertzValue) {
        hertzSlider.addEventListener('input', function() {
            hertzValue.textContent = this.value + ' Hz';
        });
    }
    
    // Drag Level Radio Buttons
    const dragOptions = document.querySelectorAll('.drag-option');
    dragOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                
                // Update visual state
                dragOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            }
        });
    });
    
    // Pro Mode Toggle
    const proToggle = document.getElementById('pro-toggle');
    const proStatus = document.getElementById('pro-status');
    
    if (proToggle && proStatus) {
        proToggle.addEventListener('change', function() {
            if (this.checked) {
                proStatus.classList.add('active');
                proStatus.querySelector('.status-text').textContent = 'Ativado';
                
                // Ativa todas as funcionalidades do modo pro
                document.getElementById('recoil-toggle').checked = true;
                document.getElementById('focus-toggle').checked = true;
                document.getElementById('precision-toggle').checked = true;
                document.getElementById('screen-toggle').checked = true;
                document.getElementById('lag-toggle').checked = true;
                document.getElementById('delay-toggle').checked = true;
                
                // Define arrasto médio
                const mediumRadio = document.getElementById('drag-medium');
                if (mediumRadio) {
                    mediumRadio.checked = true;
                }
            } else {
                proStatus.classList.remove('active');
                proStatus.querySelector('.status-text').textContent = 'Desativado';
            }
        });
    }
    
    // Inicializar ícones dos botões de injeção
    const injectFFIcon = document.getElementById('inject-ff-icon');
    const injectFFMaxIcon = document.getElementById('inject-ffmax-icon');
    
    if (injectFFIcon && Icons.injection) {
        injectFFIcon.innerHTML = Icons.injection;
    }
    
    if (injectFFMaxIcon && Icons.injection) {
        injectFFMaxIcon.innerHTML = Icons.injection;
    }
    
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
