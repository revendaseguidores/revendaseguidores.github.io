const USER_DATA_KEY = 'alvoreDigitalUserData';
const SESSION_TOKEN_KEY = 'sessionToken';
const INITIAL_LOAD_KEY = 'initialLoadComplete';

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupEventListeners();
    startPeriodicBalanceCheck();
    loadUserDataFromCache(); // Add this line to ensure user data is loaded on all pages
});

function checkAuth() {
    const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);
    if (!sessionToken) {
        window.location.href = '../index.html';
    } else {
        verifyToken(sessionToken);
        // Carregar dados do cache imediatamente
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

    document.getElementById('saldoDisponivel').textContent = data.saldoAtual.toFixed(2);
    
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

    // Mostrar modal de carregamento
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
        // Esconder modal de carregamento
        loadingModal.hide();

        console.log('Server response:', result); // For debugging

        if (result.trim() === 'success') {
            // Mostrar modal de sucesso
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();
            
            // Adicionar evento para redirecionar após fechar o modal
            document.getElementById('successModal').addEventListener('hidden.bs.modal', function () {
                logout(); // Isso irá redirecionar para a página de login
            });
        } else if (result.trim() === 'invalid_password') {
            showErrorModal('Falha ao alterar a senha. Verifique se a senha atual está correta.');
        } else {
            showErrorModal('Ocorreu um erro ao tentar alterar a senha. Por favor, tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro ao alterar senha:', error);
        // Esconder modal de carregamento
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

    // Verificar saldo disponível
    const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));
    const saldoDisponivel = userData.saldoAtual;

    if (saldoDisponivel < valorPagar) {
        showInsufficientFundsModal();
        return;
    }

    // Mostrar modal de carregamento
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
        // Esconder modal de carregamento
        loadingModal.hide();

        console.log('Server response:', result); // For debugging

        if (result.trim() === 'success') {
            // Mostrar modal de sucesso
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();

            document.getElementById('orderForm').reset();
            loadUserDataFromServer(); // Atualiza os dados do usuário após criar o pedido
        } else if (result.trim() === 'insufficient_funds') {
            showInsufficientFundsModal();
        } else {
            showErrorModal('Erro ao criar o pedido: ' + result);
        }
    })
    .catch(error => {
        console.error('Erro ao criar pedido:', error);
        // Esconder modal de carregamento
        loadingModal.hide();
        showErrorModal('Ocorreu um erro ao tentar criar o pedido. Por favor, tente novamente.');
    });
}

function showInsufficientFundsModal() {
    const insufficientFundsModal = new bootstrap.Modal(document.getElementById('insufficientFundsModal'));
    insufficientFundsModal.show();
}

// Nova função para verificar periodicamente o saldo do usuário
function startPeriodicBalanceCheck() {
    checkUserBalance(); // Immediately check balance when the page loads
    setInterval(checkUserBalance, 30000); // Then check every 30 seconds
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

// Inicializa o ano atual no rodapé
document.getElementById('currentYear').textContent = new Date().getFullYear();