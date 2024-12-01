const USER_ORDERS_KEY = 'alvoreDigitalUserOrders';
const ORDERS_PER_PAGE = 10;
let currentPage = 1;
let allOrders = [];

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserDataFromCache();
    loadAndDisplayOrders();
    setupOrderUpdateInterval();
    // Inicializar o modal de serviço
    const serviceModal = new bootstrap.Modal(document.getElementById('serviceModal'));

    // Adicionar evento de clique para o botão "Carregar mais"
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreOrders);
    }
});

function loadAndDisplayOrders() {
    const cachedOrders = localStorage.getItem(USER_ORDERS_KEY);
    if (cachedOrders) {
        allOrders = JSON.parse(cachedOrders);
        displayOrders(allOrders.slice(0, ORDERS_PER_PAGE));
        updateLoadMoreButton();
    }
    fetchAndUpdateOrders();
}

function fetchAndUpdateOrders() {
    const sessionToken = localStorage.getItem('sessionToken');
    showUpdateIndicator();
    fetch(`https://script.google.com/macros/s/AKfycbwg7C0z6SZIEkLTGoVM8VVTdvA7JhxyHW-1rjq-098oSGrNaeDn4tT_o8GV9XGL4VUL/exec?action=get_user_orders&token=${encodeURIComponent(sessionToken)}`)
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data) && data.length > 0) {
            allOrders = data.sort((a, b) => new Date(b.data) - new Date(a.data));
            localStorage.setItem(USER_ORDERS_KEY, JSON.stringify(allOrders));
            displayOrders(allOrders.slice(0, ORDERS_PER_PAGE * currentPage));
            updateLoadMoreButton();
        } else {
            displayNoOrdersMessage();
        }
        hideUpdateIndicator();
    })
    .catch(error => {
        console.error('Erro ao carregar pedidos:', error);
        hideUpdateIndicator();
        displayNoOrdersMessage();
    });
}

function displayOrders(orders) {
    const tableBody = document.getElementById('pedidosTableBody');
    tableBody.innerHTML = '';

    if (orders.length === 0) {
        displayNoOrdersMessage();
        return;
    }

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${new Date(order.data).toLocaleString('pt-BR')}</td>
            <td>
                <img src="${getServiceLogo(order.servico)}" alt="${order.servico}" class="service-logo" 
                     data-bs-toggle="modal" data-bs-target="#serviceModal" data-service="${order.servico}">
            </td>
            <td><a href="${order.link}" target="_blank">${order.link}</a></td>
            <td>${order.quantidade}</td>
            <td class="valor-column">R$ ${order.valor.toFixed(2)}</td>
            <td>${order.status}</td>
        `;
        tableBody.appendChild(row);
    });

    // Adicionar evento de clique para as logos de serviço
    const serviceLogos = document.querySelectorAll('.service-logo');
    serviceLogos.forEach(logo => {
        logo.addEventListener('click', function() {
            const serviceName = this.getAttribute('data-service');
            document.getElementById('serviceDetails').textContent = `Nome do serviço: ${serviceName}`;
        });
    });
}

function displayNoOrdersMessage() {
    const tableBody = document.getElementById('pedidosTableBody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">Não há pedidos para exibir.</td>
        </tr>
    `;
    updateLoadMoreButton();
}

function getServiceLogo(serviceName) {
    const logoMap = {
        'instagram': 'img/redes-sociais/instagram.svg',
        'facebook': 'img/redes-sociais/facebook.svg',
        'twitter': 'img/redes-sociais/twitter.svg',
        'youtube': 'img/redes-sociais/youtube.svg',
        'tiktok': 'img/redes-sociais/tiktok.svg',
        'telegram': 'img/redes-sociais/telegram.svg',
        'kwai': 'img/redes-sociais/kwai.png',
    };
    
    const lowercaseServiceName = serviceName.toLowerCase();
    
    for (const [key, value] of Object.entries(logoMap)) {
        if (lowercaseServiceName.includes(key)) {
            return value;
        }
    }
    
    return 'img/redes-sociais/default.png';
}

function loadMoreOrders() {
    currentPage++;
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const endIndex = currentPage * ORDERS_PER_PAGE;
    const newOrders = allOrders.slice(startIndex, endIndex);
    
    if (newOrders.length > 0) {
        displayOrders(allOrders.slice(0, endIndex));
        updateLoadMoreButton();
    }
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const noMoreOrdersMsg = document.getElementById('noMoreOrdersMsg');
    
    if (allOrders.length === 0) {
        loadMoreBtn.style.display = 'none';
        noMoreOrdersMsg.style.display = 'block';
        noMoreOrdersMsg.textContent = 'Não há pedidos para carregar.';
    } else if (currentPage * ORDERS_PER_PAGE >= allOrders.length) {
        loadMoreBtn.style.display = 'none';
        noMoreOrdersMsg.style.display = 'block';
        noMoreOrdersMsg.textContent = 'Não há mais pedidos para carregar.';
    } else {
        loadMoreBtn.style.display = 'block';
        noMoreOrdersMsg.style.display = 'none';
    }
}

function setupOrderUpdateInterval() {
    setInterval(fetchAndUpdateOrders, 30000); // Atualiza a cada 30 segundos
}

function loadUserDataFromCache() {
    const cachedData = localStorage.getItem('alvoreDigitalUserData');
    if (cachedData) {
        const userData = JSON.parse(cachedData);
        document.getElementById('nomeUsuario').textContent = userData.name.split(' ')[0];
        document.getElementById('saldoDisponivel').textContent = userData.saldoAtual.toFixed(2);
    }
}

function checkAuth() {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
        window.location.href = '../index.html';
    } else {
        verifyToken(sessionToken);
    }
}

function verifyToken(token) {
    fetch(`https://script.google.com/macros/s/AKfycbwg7C0z6SZIEkLTGoVM8VVTdvA7JhxyHW-1rjq-098oSGrNaeDn4tT_o8GV9XGL4VUL/exec?action=verify_token&token=${encodeURIComponent(token)}`)
    .then(response => response.text())
    .then(result => {
        if (result !== 'valid') {
            logout();
        }
    })
    .catch(error => {
        console.error('Erro ao verificar token:', error);
        logout();
    });
}

function logout() {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('alvoreDigitalUserData');
    localStorage.removeItem(USER_ORDERS_KEY);
    window.location.href = '../index.html';
}

function showUpdateIndicator() {
    const indicator = document.getElementById('updateIndicator');
    if (indicator) {
        indicator.style.display = 'inline-block';
    }
}

function hideUpdateIndicator() {
    const indicator = document.getElementById('updateIndicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}