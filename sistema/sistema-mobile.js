const USER_DATA_KEY = 'alvoreDigitalUserData';
const SESSION_TOKEN_KEY = 'sessionToken';
const INITIAL_LOAD_KEY = 'initialLoadComplete';

document.addEventListener('DOMContentLoaded', function() {
    setupMobileNavigation();
    checkAuth();
    setupEventListeners();
    startPeriodicBalanceCheck();
    loadUserDataFromCache();
});

function setupMobileNavigation() {
    const toggleBtn = document.querySelector('.toggle-btn');
    const closeBtn = document.querySelector('.sidebar .closebtn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', openSidebar);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }

    overlay.addEventListener('click', closeSidebar);

    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    /*
    if (sidebarToggle && sidebar && mainContent) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('sidebar-active');
        });

        // Fechar o sidebar ao clicar fora dele
        document.addEventListener('click', function(event) {
            if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                mainContent.classList.remove('sidebar-active');
            }
        });
    } else {
        // Código original para navegacao mobile caso nao encontre os elementos com os IDs especificados
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-btn';
        toggleBtn.innerHTML = '☰';
        toggleBtn.addEventListener('click', toggleSidebar);

        const header = document.querySelector('.header');
        header.insertBefore(toggleBtn, header.firstChild);

        const closeBtn = document.createElement('a');
        closeBtn.href = 'javascript:void(0)';
        closeBtn.className = 'closebtn';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', closeSidebar);

        const sidebar = document.querySelector('.sidebar');
        sidebar.insertBefore(closeBtn, sidebar.firstChild);

        document.addEventListener('click', function(event) {
            if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target) && sidebar.style.width === '250px') {
                closeSidebar();
            }
        });
    }
    */
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.width = sidebar.style.width === '250px' ? '0' : '250px';
}

function closeSidebar() {
    document.querySelector('.sidebar').style.width = '0';
}

function checkAuth() {
    const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);
    if (!sessionToken) {
        window.location.href = '../index.html';
    } else {
        verifyToken(sessionToken);
        loadUserDataFromCache();
    }
}

function verifyToken(token) {
    const initialLoadComplete = localStorage.getItem(INITIAL_LOAD_KEY);
    if (!initialLoadComplete) {
        showLoadingModal();
    }

    fetch(`https://script.google.com/macros/s/AKfycbyIWaNnRnhhzHXhBbtvTiva9T_6yYwZf5VNkTzXULDG1zJYmLlGYwASEb131CigsrM/exec?action=verify_token&token=${encodeURIComponent(token)}`)
    .then(response => response.text())
    .then(result => {
        if (result !== 'valid') {
            logout();
        } else {
            if (!initialLoadComplete) {
                loadUserDataFromServer();
            }
        }
    })
    .catch(error => {
        console.error('Erro ao verificar token:', error);
        logout();
    });
}

function showLoadingModal() {
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingInitialModal'));
    loadingModal.show();
}

function hideLoadingModal() {
    const loadingModal = bootstrap.Modal.getInstance(document.getElementById('loadingInitialModal'));
    if (loadingModal) {
        loadingModal.hide();
    }
}

function loadUserDataFromCache() {
    const cachedData = localStorage.getItem(USER_DATA_KEY);
    if (cachedData) {
        const userData = JSON.parse(cachedData);
        updateUIWithUserData(userData);
    }
}

function loadUserDataFromServer() {
    const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);
    fetch(`https://script.google.com/macros/s/AKfycbyIWaNnRnhhzHXhBbtvTiva9T_6yYwZf5VNkTzXULDG1zJYmLlGYwASEb131CigsrM/exec?action=get_user_data&token=${encodeURIComponent(sessionToken)}`)
    .then(response => response.json())
    .then(data => {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
        localStorage.setItem(INITIAL_LOAD_KEY, 'true');
        updateUIWithUserData(data);
        hideLoadingModal();
    })
    .catch(error => {
        console.error('Erro ao carregar dados do usuário:', error);
        hideLoadingModal();
    });
}

function updateUIWithUserData(data) {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === 'adicionar-saldo.html') {
        const firstName = data.name.split(' ')[0];
        document.getElementById('nomeUsuario').textContent = firstName;
    } else if (currentPage === 'sua-conta.html') {
        document.getElementById('nomeUsuario').textContent = data.name;
    }

    const saldoDisponivelElement = document.getElementById('saldoDisponivel');
    if (saldoDisponivelElement) {
        saldoDisponivelElement.textContent = data.saldoAtual.toFixed(2);
    }
    
    if (document.getElementById('saldoGasto')) {
        document.getElementById('saldoGasto').textContent = data.saldoGasto.toFixed(2);
    }
    if (document.getElementById('saldoAtual')) {
        document.getElementById('saldoAtual').textContent = data.saldoAtual.toFixed(2);
    }
    if (document.getElementById('emailUsuario')) {
        document.getElementById('emailUsuario').textContent = data.email;
    }
    if (document.getElementById('whatsappUsuario')) {
        document.getElementById('whatsappUsuario').textContent = data.whatsapp;
    }
}

function setupEventListeners() {
    const btnSair = document.getElementById('btnSair');
    if (btnSair) {
        btnSair.addEventListener('click', logout);
    }

    const formAlterarSenha = document.getElementById('formAlterarSenha');
    if (formAlterarSenha) {
        formAlterarSenha.addEventListener('submit', alterarSenha);
    }

    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', submitOrder);
    }

    const btnConfirmLogout = document.getElementById('btnConfirmLogout');
    if (btnConfirmLogout) {
        btnConfirmLogout.addEventListener('click', () => {
            logout();
        });
    }

    const addBalanceBtn = document.getElementById('addBalanceBtn');
    if (addBalanceBtn) {
        addBalanceBtn.addEventListener('click', function() {
            window.location.href = 'adicionar-saldo.html';
        });
    }
}

function logout() {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(INITIAL_LOAD_KEY);
    window.location.href = '../index.html';
}

function alterarSenha(e) {
    e.preventDefault();
    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarNovaSenha = document.getElementById('confirmarNovaSenha').value;

    if (novaSenha !== confirmarNovaSenha) {
        showErrorModal('As senhas não coincidem.');
        return;
    }

    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    loadingModal.show();

    const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);
    fetch(`https://script.google.com/macros/s/AKfycbyIWaNnRnhhzHXhBbtvTiva9T_6yYwZf5VNkTzXULDG1zJYmLlGYwASEb131CigsrM/exec`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=update_password&token=${encodeURIComponent(sessionToken)}&current_password=${encodeURIComponent(senhaAtual)}&new_password=${encodeURIComponent(novaSenha)}`
    })
    .then(response => response.text())
    .then(result => {
        loadingModal.hide();

        console.log('Server response:', result);

        if (result.trim() === 'success') {
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();
            
            document.getElementById('successModal').addEventListener('hidden.bs.modal', function () {
                logout();
            });
        } else if (result.trim() === 'invalid_password') {
            showErrorModal('Falha ao alterar a senha. Verifique se a senha atual está correta.');
        } else {
            showErrorModal('Ocorreu um erro ao tentar alterar a senha. Por favor, tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro ao alterar senha:', error);
        loadingModal.hide();
        showErrorModal('Ocorreu um erro ao tentar alterar a senha. Por favor, tente novamente.');
    });
}

function showErrorModal(message) {
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    document.getElementById('errorMessage').textContent = message;
    errorModal.show();
}

function submitOrder(e) {
    e.preventDefault();
    const categoria = document.getElementById('categoria').value;
    const link = document.getElementById('link').value;
    const quantidade = document.getElementById('quantidade').value;
    const valorPagar = parseFloat(document.getElementById('valorPagar').value);

    const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));
    const saldoDisponivel = userData.saldoAtual;

    if (saldoDisponivel < valorPagar) {
        showInsufficientFundsModal();
        return;
    }

    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    loadingModal.show();

    const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);
    fetch(`https://script.google.com/macros/s/AKfycbyIWaNnRnhhzHXhBbtvTiva9T_6yYwZf5VNkTzXULDG1zJYmLlGYwASEb131CigsrM/exec`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=create_order&token=${encodeURIComponent(sessionToken)}&servico=${encodeURIComponent(categoria)}&link=${encodeURIComponent(link)}&quantidade=${encodeURIComponent(quantidade)}&valor=${encodeURIComponent(valorPagar)}`
    })
    .then(response => response.text())
    .then(result => {
        loadingModal.hide();

        console.log('Server response:', result);

        if (result.trim() === 'success') {
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();

            document.getElementById('orderForm').reset();
            loadUserDataFromServer();
        } else if (result.trim() === 'insufficient_funds') {
            showInsufficientFundsModal();
        } else {
            showErrorModal('Erro ao criar o pedido: ' + result);
        }
    })
    .catch(error => {
        console.error('Erro ao criar pedido:', error);
        loadingModal.hide();
        showErrorModal('Ocorreu um erro ao tentar criar o pedido. Por favor, tente novamente.');
    });
}

function showInsufficientFundsModal() {
    const insufficientFundsModal = new bootstrap.Modal(document.getElementById('insufficientFundsModal'));
    insufficientFundsModal.show();
}

function startPeriodicBalanceCheck() {
    checkUserBalance();
    setInterval(checkUserBalance, 30000);
}

function showBalanceUpdateNotification(amount) {
    const notification = document.createElement('div');
    notification.className = 'balance-update-notification';
    notification.textContent = `Saldo atualizado! +R$ ${amount.toFixed(2)}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

function checkUserBalance() {
    const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);
    if (!sessionToken) return;

    fetch(`https://script.google.com/macros/s/AKfycbyIWaNnRnhhzHXhBbtvTiva9T_6yYwZf5VNkTzXULDG1zJYmLlGYwASEb131CigsrM/exec?action=get_user_data&token=${encodeURIComponent(sessionToken)}`)
    .then(response => response.json())
    .then(data => {
        const cachedData = JSON.parse(localStorage.getItem(USER_DATA_KEY));
        if (cachedData && data.saldoAtual !== cachedData.saldoAtual) {
            if (data.saldoAtual > cachedData.saldoAtual) {
                showBalanceUpdateNotification(data.saldoAtual - cachedData.saldoAtual);
            }
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
            updateUIWithUserData(data);
        }
    })
    .catch(error => {
        console.error('Erro ao verificar saldo do usuário:', error);
    });
}

document.getElementById('currentYear').textContent = new Date().getFullYear();