// suporte.js
const TICKETS_STORAGE_KEY = 'userTickets';

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserDataFromCache();
    loadTicketsFromStorage();
    loadTicketsFromServer();
    setupEventListeners();
});

function checkAuth() {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
        window.location.href = '../index.html';
    }
}

function loadUserDataFromCache() {
    const cachedData = localStorage.getItem('alvoreDigitalUserData');
    if (cachedData) {
        const userData = JSON.parse(cachedData);
        document.getElementById('saldoDisponivel').textContent = userData.saldoAtual.toFixed(2);
    }
}

function loadTicketsFromStorage() {
    const storedTickets = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (storedTickets) {
        displayTickets(JSON.parse(storedTickets));
    }
}

function loadTicketsFromServer() {
    const sessionToken = localStorage.getItem('sessionToken');
    fetch(`https://script.google.com/macros/s/AKfycbyIWaNnRnhhzHXhBbtvTiva9T_6yYwZf5VNkTzXULDG1zJYmLlGYwASEb131CigsrM/exec?action=get_user_tickets&token=${encodeURIComponent(sessionToken)}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateStoredTickets(data.tickets);
            displayTickets(data.tickets);
        } else {
            console.error('Erro ao carregar tíquetes:', data.error);
        }
    })
    .catch(error => {
        console.error('Erro ao carregar tíquetes:', error);
    });
}

function updateStoredTickets(tickets) {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
}

function displayTickets(tickets) {
    const tableBody = document.getElementById('ticketsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    tickets.forEach(ticket => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${ticket.id}</td>
            <td>${ticket.assunto}</td>
            <td>${new Date(ticket.data).toLocaleString()}</td>
            <td>${ticket.status}</td>
            <td><button class="btn btn-primary btn-sm" onclick="viewTicketDetails(${ticket.id})">Ver Detalhes</button></td>
        `;
    });
}

function viewTicketDetails(ticketId) {
    const sessionToken = localStorage.getItem('sessionToken');
    showLoadingModal();
    fetch(`https://script.google.com/macros/s/AKfycbyIWaNnRnhhzHXhBbtvTiva9T_6yYwZf5VNkTzXULDG1zJYmLlGYwASEb131CigsrM/exec?action=get_ticket_details&token=${encodeURIComponent(sessionToken)}&ticketId=${ticketId}`)
    .then(response => response.json())
    .then(data => {
        hideLoadingModal();
        if (data.success) {
            displayTicketDetails(data.ticket);
        } else {
            showErrorModal('Erro ao carregar detalhes do tíquete: ' + data.error);
        }
    })
    .catch(error => {
        hideLoadingModal();
        console.error('Erro ao carregar detalhes do tíquete:', error);
        showErrorModal('Ocorreu um erro ao carregar os detalhes do tíquete. Por favor, tente novamente.');
    });
}

function displayTicketDetails(ticket) {
    const detailsHtml = `
        <h5>Assunto: ${ticket.assunto}</h5>
        <p><strong>Data:</strong> ${new Date(ticket.data).toLocaleString()}</p>
        <p><strong>Status:</strong> ${ticket.status}</p>
        <p><strong>Mensagem:</strong> ${ticket.mensagem}</p>
        <p><strong>Resposta do Admin:</strong> ${ticket.respostaAdmin || 'Ainda não respondido'}</p>
    `;
    document.getElementById('ticketDetails').innerHTML = detailsHtml;
    const ticketModal = new bootstrap.Modal(document.getElementById('ticketModal'));
    ticketModal.show();
}

function setupEventListeners() {
    document.getElementById('ticketForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createTicket();
    });

    document.getElementById('btnSair').addEventListener('click', logout);
}

let isSubmitting = false;

function createTicket() {
    if (isSubmitting) return;

    const assunto = document.getElementById('assunto').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const mensagem = document.getElementById('mensagem').value;
    const sessionToken = localStorage.getItem('sessionToken');

    if (!assunto || !whatsapp || !mensagem) {
        showErrorModal('Por favor, preencha todos os campos.');
        return;
    }

    isSubmitting = true;
    showLoadingModal();

    fetch('https://script.google.com/macros/s/AKfycbyIWaNnRnhhzHXhBbtvTiva9T_6yYwZf5VNkTzXULDG1zJYmLlGYwASEb131CigsrM/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=create_ticket&token=${encodeURIComponent(sessionToken)}&assunto=${encodeURIComponent(assunto)}&whatsapp=${encodeURIComponent(whatsapp)}&mensagem=${encodeURIComponent(mensagem)}`
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingModal();
        isSubmitting = false;
        if (data.success) {
            showSuccessModal('Tíquete criado com sucesso!');
            document.getElementById('ticketForm').reset();
            loadTicketsFromServer();
        } else {
            if (data.error === 'ticket_limit_reached') {
                showTicketLimitModal();
            } else {
                showErrorModal('Erro ao criar tíquete: ' + data.error);
            }
        }
    })
    .catch(error => {
        hideLoadingModal();
        isSubmitting = false;
        console.error('Erro ao criar tíquete:', error);
        showErrorModal('Ocorreu um erro ao criar o tíquete. Por favor, tente novamente.');
    });
}

function showLoadingModal() {
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    loadingModal.show();
}

function hideLoadingModal() {
    const loadingModalElement = document.getElementById('loadingModal');
    const loadingModal = bootstrap.Modal.getInstance(loadingModalElement);
    if (loadingModal) {
        loadingModal.hide();
    }
}

function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message;
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}

function showErrorModal(message) {
    document.getElementById('errorMessage').textContent = message;
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
}

function showTicketLimitModal() {
    const ticketLimitModal = new bootstrap.Modal(document.getElementById('ticketLimitModal'));
    ticketLimitModal.show();
}

function logout() {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('alvoreDigitalUserData');
    window.location.href = '../index.html';
}

let loadingModalInstance = null;

function showLoadingModal() {
    if (!loadingModalInstance) {
        loadingModalInstance = new bootstrap.Modal(document.getElementById('loadingModal'));
    }
    loadingModalInstance.show();
}

function hideLoadingModal() {
    if (loadingModalInstance) {
        loadingModalInstance.hide();
    }
}

function showSuccessModal(message) {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    document.getElementById('successMessage').textContent = message;
    successModal.show();
}

function showErrorModal(message) {
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    document.getElementById('errorMessage').textContent = message;
    errorModal.show();
}

// Initialize the current year in the footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Atualiza os tickets a cada 30 segundos
setInterval(loadTicketsFromServer, 30000);