document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addBalanceForm');
    const sessionToken = localStorage.getItem('sessionToken');
    const USER_DATA_KEY = 'alvoreDigitalUserData';

    if (!sessionToken) {
        window.location.href = '../index.html';
        return;
    }

    // Load user data from localStorage and update UI
    function loadUserDataFromCache() {
        const cachedData = localStorage.getItem(USER_DATA_KEY);
        if (cachedData) {
            const userData = JSON.parse(cachedData);
            updateUIWithUserData(userData);
        }
    }

    // Update UI with user data
    function updateUIWithUserData(data) {
        const saldoDisponivelElement = document.getElementById('saldoDisponivel');
        if (saldoDisponivelElement) {
            saldoDisponivelElement.textContent = data.saldoAtual.toFixed(2);
        }
    }

    // Load user data when the page loads
    loadUserDataFromCache();

    // Fetch latest user data from server
    function loadUserDataFromServer() {
        fetch(`https://script.google.com/macros/s/AKfycbyIWaNnRnhhzHXhBbtvTiva9T_6yYwZf5VNkTzXULDG1zJYmLlGYwASEb131CigsrM/exec?action=get_user_data&token=${encodeURIComponent(sessionToken)}`)
        .then(response => response.json())
        .then(data => {
            const cachedData = JSON.parse(localStorage.getItem(USER_DATA_KEY));
            if (cachedData && data.saldoAtual > cachedData.saldoAtual) {
                showBalanceUpdateNotification(data.saldoAtual - cachedData.saldoAtual);
            }
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
            updateUIWithUserData(data);
        })
        .catch(error => {
            console.error('Erro ao carregar dados do usuário:', error);
        });
    }

    // Load latest user data from server when the page loads
    loadUserDataFromServer();

    // Set up periodic balance check
    function startPeriodicBalanceCheck() {
        setInterval(loadUserDataFromServer, 30000); // Check every 30 seconds
    }

    // Start periodic balance check
    startPeriodicBalanceCheck();

    // Verificar se a função logout já está definida (pelo sistema.js)
    if (typeof logout !== 'function') {
        window.logout = function() {
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('alvoreDigitalUserData');
            localStorage.removeItem('initialLoadComplete');
            window.location.href = '../index.html';
        };
    }

    // Adicionar event listener para o botão de logout, caso não tenha sido adicionado pelo sistema.js
    const btnSair = document.getElementById('btnSair');
    if (btnSair && !btnSair.onclick) {
        btnSair.addEventListener('click', logout);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const amount = document.getElementById('valorSaldo').value;

        // Show loading modal
        const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        loadingModal.show();

        fetch('https://script.google.com/macros/s/AKfycbyIWaNnRnhhzHXhBbtvTiva9T_6yYwZf5VNkTzXULDG1zJYmLlGYwASEb131CigsrM/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=generate_pix_qrcode&token=${encodeURIComponent(sessionToken)}&valor=${encodeURIComponent(amount)}`
        })
        .then(response => response.json())
        .then(data => {
            loadingModal.hide();
            if (data.success) {
                localStorage.setItem('pixPaymentData', JSON.stringify(data));
                window.location.href = 'pix-payment.html';
            } else {
                showErrorModal('Erro ao gerar o código Pix: ' + (data.error || 'Erro desconhecido'));
            }
        })
        .catch(error => {
            loadingModal.hide();
            console.error('Erro:', error);
            showErrorModal('Ocorreu um erro ao gerar o código Pix. Por favor, tente novamente.');
        });
    });
});

function showErrorModal(message) {
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    document.getElementById('errorMessage').textContent = message;
    errorModal.show();
}

// Function to show balance update notification
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