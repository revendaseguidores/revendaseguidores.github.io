document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));

    toggleForm('login');
    
    // Ensure contact logos are visible initially
    document.querySelectorAll('.contact-logos').forEach(logos => {
        logos.style.display = 'flex';
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        showLoading('Fazendo login...');
        
        // Enviar dados para o Google Apps Script
        fetch(`https://script.google.com/macros/s/AKfycbwg7C0z6SZIEkLTGoVM8VVTdvA7JhxyHW-1rjq-098oSGrNaeDn4tT_o8GV9XGL4VUL/exec?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
        .then(response => response.text())
        .then(result => {
            hideLoading();
            if (result.startsWith('success:')) {
                const token = result.split(':')[1];
                localStorage.setItem('sessionToken', token);
                redirectToSystem();
            } else {
                alert('Login falhou. Verifique suas credenciais.');
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Erro:', error);
            alert('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
        });
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const whatsapp = document.getElementById('register-whatsapp').value;
        const password = document.getElementById('register-password').value;
        
        showLoading('Realizando cadastro...');
        
        // Enviar dados para o Google Apps Script
        fetch(`https://script.google.com/macros/s/AKfycbwg7C0z6SZIEkLTGoVM8VVTdvA7JhxyHW-1rjq-098oSGrNaeDn4tT_o8GV9XGL4VUL/exec?action=register&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&whatsapp=${encodeURIComponent(whatsapp)}&password=${encodeURIComponent(password)}`)
        .then(response => response.text())
        .then(result => {
            hideLoading();
            if (result === 'success') {
                alert('Cadastro realizado com sucesso! Faça login para continuar.');
                toggleForm('login');
            } else if (result === 'email_exists') {
                alert('Este e-mail já está cadastrado. Por favor, use outro e-mail ou faça login.');
            } else {
                alert('Erro no cadastro. Tente novamente.');
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Erro:', error);
            alert('Ocorreu um erro ao tentar fazer o cadastro. Por favor, tente novamente.');
        });
    });
});

function toggleForm(formType) {
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    
    if (formType === 'login') {
        loginContainer.classList.add('active');
        registerContainer.classList.remove('active');
    } else {
        registerContainer.classList.add('active');
        loginContainer.classList.remove('active');
    }

    // Ensure contact logos are visible
    document.querySelectorAll('.contact-logos').forEach(logos => {
        logos.style.display = 'flex';
    });
}


function showLoading(message) {
    document.getElementById('loadingMessage').textContent = message;
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    loadingModal.show();
}

function hideLoading() {
    const loadingModal = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
    if (loadingModal) {
        loadingModal.hide();
    }
}

function redirectToSystem() {
    window.location.href = '/sistema/index.html';
}

// Função para verificar autenticação (usar na página do sistema)
function checkAuth() {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
        window.location.href = '/index.html';
    } else {
        showLoading('Verificando autenticação...');
        // Verificar validade do token com o servidor
        fetch(`https://script.google.com/macros/s/AKfycbwg7C0z6SZIEkLTGoVM8VVTdvA7JhxyHW-1rjq-098oSGrNaeDn4tT_o8GV9XGL4VUL/exec?action=verify_token&token=${encodeURIComponent(sessionToken)}`)
        .then(response => response.text())
        .then(result => {
            hideLoading();
            if (result !== 'valid') {
                localStorage.removeItem('sessionToken');
                window.location.href = '/index.html';
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Erro ao verificar token:', error);
            localStorage.removeItem('sessionToken');
            window.location.href = '/index.html';
        });
    }
}

// Adicione esta linha no final do arquivo para garantir que o formulário de login seja exibido inicialmente
document.addEventListener('DOMContentLoaded', () => toggleForm('login'));