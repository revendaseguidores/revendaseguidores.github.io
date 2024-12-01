document.addEventListener('DOMContentLoaded', function() {
    const pixPaymentData = JSON.parse(localStorage.getItem('pixPaymentData'));
    
    if (!pixPaymentData) {
        window.location.href = 'adicionar-saldo.html';
        return;
    }
 
    const qrCodeImage = document.getElementById('qrCodeImage');
    qrCodeImage.src = pixPaymentData.qrCodeUrl;
    console.log('URL do QR code:', pixPaymentData.qrCodeUrl);
 
    qrCodeImage.onerror = function() {
        console.error('Erro ao carregar a imagem do QR code');
        alert('Não foi possível carregar o QR code. Por favor, tente novamente.');
    };
 
    qrCodeImage.onload = function() {
        console.log('QR code carregado com sucesso');
    };
 
    document.getElementById('pixCode').value = pixPaymentData.pixCode;
    document.getElementById('paymentAmount').textContent = pixPaymentData.valor.toFixed(2);
 
    document.getElementById('copyPixCode').addEventListener('click', function() {
        const pixCode = document.getElementById('pixCode');
        pixCode.select();
        document.execCommand('copy');
        this.textContent = 'Copiado!';
        setTimeout(() => {
            this.textContent = 'Copiar';
        }, 2000);
    });
 
    // Adicionar Pix pendente imediatamente após o carregamento da página
    addPendingPix();
 
    // Adicionar evento de clique no botão "Voltar"
    document.getElementById('voltarButton').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Mostrar o modal de confirmação
        const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        confirmationModal.show();
        
        // Adicionar evento para redirecionar após fechar o modal
        document.getElementById('confirmationModal').addEventListener('hidden.bs.modal', function () {
            window.location.href = 'index.html';
        });
    });
 });
 
 function addPendingPix() {
    const sessionToken = localStorage.getItem('sessionToken');
    const pixPaymentData = JSON.parse(localStorage.getItem('pixPaymentData'));
    
    // Enviar requisição para adicionar Pix pendente
    fetch('https://script.google.com/macros/s/AKfycbwg7C0z6SZIEkLTGoVM8VVTdvA7JhxyHW-1rjq-098oSGrNaeDn4tT_o8GV9XGL4VUL/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=add_pending_pix&token=${encodeURIComponent(sessionToken)}&valor=${encodeURIComponent(pixPaymentData.valor)}&pixCode=${encodeURIComponent(pixPaymentData.pixCode)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Pix pendente adicionado com sucesso');
        } else {
            console.error('Erro ao adicionar Pix pendente:', data.error);
            alert('Ocorreu um erro ao registrar o Pix pendente. Por favor, tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Ocorreu um erro ao registrar o Pix pendente. Por favor, tente novamente.');
    });
 }