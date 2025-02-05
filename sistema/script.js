const servicesData = [
   { id: 'instagram_seguidores_mundiais', network: 'Instagram', service: 'Seguidores Mundiais', min: 10, max: 5000000, basePrice: 1.565 },
   { id: 'instagram_seguidores_brasileiros', network: 'Instagram', service: 'Seguidores Brasileiros', min: 20, max: 50000, basePrice: 2.55 },
   { id: 'instagram_seguidores_organicos', network: 'Instagram', service: 'Seguidores Orgânicos', min: 50, max: 45000, basePrice: 4.50 },
   { id: 'instagram_curtidas_mundiais', network: 'Instagram', service: 'Curtidas Mundiais', min: 50, max: 100000, basePrice: 0.045 },
   { id: 'instagram_curtidas_brasileiras', network: 'Instagram', service: 'Curtidas Brasileiras', min: 20, max: 30000, basePrice: 0.99 },
   { id: 'instagram_curtidas_organicas', network: 'Instagram', service: 'Curtidas Orgânicas', min: 50, max: 1000000, basePrice: 0.60 },
   { id: 'instagram_visualizacoes_reels', network: 'Instagram', service: 'Visualizações nos REELS', min: 100, max: 100000000, basePrice: 0.07 },
   { id: 'instagram_visualizacoes_stories', network: 'Instagram', service: 'Visualizações nos Stories', min: 10, max: 10000, basePrice: 0.10 },
   { id: 'instagram_visualizacoes_live', network: 'Instagram', service: 'Visualizações em Live', min: 20, max: 20000, basePrice: 2.50 },
   { id: 'instagram_comentarios_emojis', network: 'Instagram', service: 'Comentários Emojis', min: 50, max: 10000, basePrice: 3.00 },
   { id: 'tiktok_seguidores_rapidos', network: 'TikTok', service: 'Seguidores / Rápidos', min: 10, max: 500000, basePrice: 1.50 },
   { id: 'tiktok_seguidores_brasileiros', network: 'TikTok', service: 'Seguidores / Brasileiros', min: 10, max: 100000, basePrice: 1.50 },
   { id: 'tiktok_curtidas_mundiais', network: 'TikTok', service: 'Curtidas / Mundiais', min: 10, max: 500000, basePrice:  0.225 },
   { id: 'tiktok_curtidas_brasileiros', network: 'TikTok', service: 'Curtidas / Brasileiros', min: 10, max: 500000, basePrice: 0.50 },
   { id: 'tiktok_visualizacoes', network: 'TikTok', service: 'Visualizações', min: 100, max: 100000000, basePrice: 0.015 },
   { id: 'tiktok_visualizacoes_lives', network: 'TikTok', service: 'Visualizações / Em Lives', min: 10, max: 10000, basePrice: 1.80 },
   { id: 'tiktok_comentarios_mundiais', network: 'TikTok', service: 'Comentários / Mundiais', min: 10, max: 10000, basePrice: 5.86 },
   { id: 'facebook_seguidores', network: 'Facebook', service: 'Seguidores', min: 500, max: 100000, basePrice: 1.70 },
   { id: 'facebook_visualizacoes', network: 'Facebook', service: 'Visualizações em [Reels / Vídeos]', min: 50, max: 100000, basePrice: 0.35 },
   { id: 'facebook_comentarios_emojis', network: 'Facebook', service: 'Comentários Emojis / Avaliações', min: 50, max: 20000, basePrice: 1.10 },
   { id: 'facebook_curtidas_pagina', network: 'Facebook', service: 'Curtidas em Página', min: 100, max: 1000000, basePrice: 1.40 },
   { id: 'facebook_curtidas_publicacao', network: 'Facebook', service: 'Curtidas em Publicação', min: 50, max: 100000, basePrice: 1.15 },
   { id: 'facebook_reacao_post', network: 'Facebook', service: 'Reação em Post', min: 50, max: 20000, basePrice: 1.10 },
   { id: 'youtube_inscritos', network: 'YouTube', service: 'Inscritos [Monetizável]', min: 200, max: 100000, basePrice: 6.00 },
   { id: 'youtube_likes', network: 'YouTube', service: 'Likes', min: 10, max: 50000, basePrice: 0.60 },
   { id: 'youtube_visualizacoes', network: 'YouTube', service: 'Visualizações Rápidas em Vídeo', min: 100, max: 300000, basePrice: 1.695 },
   { id: 'youtube_visualizacoes_reais', network: 'YouTube', service: 'Visualizações em Vídeos [Retenção Aleatória]', min: 20000, max: 10000000, basePrice: 1.275 },
   { id: 'youtube_shorts', network: 'YouTube', service: 'Shorts (Curtidas Alta Qualidade)', min: 10, max: 100000, basePrice: 0.80 },
   { id: 'x_visualizacoes', network: 'X', service: 'Visualizações Em Vídeo', min: 500, max: 1000000000, basePrice: 0.02 },
   { id: 'x_curtidas', network: 'X', service: 'Curtidas', min: 100, max: 100000, basePrice: 1.60 },
   { id: 'x_retweets', network: 'X', service: 'Retweets Mundiais', min: 50, max: 100000, basePrice: 3.095 },
   { id: 'x_seguidores', network: 'X', service: 'Seguidores Mundiais', min: 25, max: 20000, basePrice: 7.00 },
   { id: 'telegram_inscritos', network: 'Telegram', service: 'Inscritos / Membros', min: 100, max: 10000, basePrice: 1.10 },
   { id: 'telegram_visualizacoes', network: 'Telegram', service: 'Visualizações Em Post', min: 10, max: 10000000, basePrice: 0.05 },
   { id: 'telegram_reacoes', network: 'Telegram', service: 'Reação para Publicações', min: 10, max: 1000000, basePrice: 0.125 },
   { id: 'kwai_seguidores_brasileiros', network: 'Kwai', service: 'Seguidores / Brasileiros', min: 10, max: 100000, basePrice: 0.40 },
   { id: 'kwai_curtidas_brasileiros', network: 'Kwai', service: 'Curtidas / Brasileiros', min: 10, max: 100000, basePrice: 0.30 },
   { id: 'kwai_visualizacoes', network: 'Kwai', service: 'Visualizações Em Vídeo Brasileiros', min: 100, max: 1000000, basePrice: 0.55 }
];

document.addEventListener('DOMContentLoaded', function() {
   const currentYear = new Date().getFullYear();
   document.getElementById('currentYear').textContent = currentYear;

   const categoriaSelect = document.getElementById('categoria');
   const quantidadeInput = document.getElementById('quantidade');
   const minQuantidadeSpan = document.getElementById('minQuantidade');
   const maxQuantidadeSpan = document.getElementById('maxQuantidade');
   const valorPagarInput = document.getElementById('valorPagar');
   const linkInput = document.getElementById('link');

   // Populate the select options
   servicesData.forEach(service => {
       const option = document.createElement('option');
       option.value = service.id;
       option.textContent = `${service.network} - ${service.service}`;
       
       const fileExtension = service.network.toLowerCase() === 'kwai' ? 'png' : 'svg';
       option.dataset.icon = `./img/redes-sociais/${service.network.toLowerCase()}.${fileExtension}`;
       
       categoriaSelect.appendChild(option);
   });

   function updateSelectIcon() {
       const selectedOption = categoriaSelect.options[categoriaSelect.selectedIndex];
       if (selectedOption && selectedOption.dataset.icon) {
           categoriaSelect.style.backgroundImage = `url('${selectedOption.dataset.icon}')`;
       } else {
           categoriaSelect.style.backgroundImage = 'none';
       }
   }

   categoriaSelect.addEventListener('change', function() {
       updateSelectIcon();
       const selectedService = servicesData.find(service => service.id === this.value);
       if (selectedService) {
           minQuantidadeSpan.textContent = selectedService.min;
           maxQuantidadeSpan.textContent = selectedService.max;
           quantidadeInput.min = selectedService.min;
           quantidadeInput.max = selectedService.max;
           quantidadeInput.value = selectedService.min;
           updateValorPagar();
       }
   });

   updateSelectIcon();

   quantidadeInput.addEventListener('input', updateValorPagar);

   function calculatePrice(basePrice, quantity) {
       const pricePerUnit = basePrice / 100; // Calculate price per unit
       const pricePerQuantity = pricePerUnit * quantity;
       return (pricePerQuantity * 0.1) + pricePerQuantity + 4; // Calculate total price
   }

   function updateValorPagar() {
       const selectedService = servicesData.find(service => service.id === categoriaSelect.value);
       if (selectedService) {
           const quantidade = parseInt(quantidadeInput.value) || selectedService.min;
           const basePrice = selectedService.basePrice;
           const valor = calculatePrice(basePrice, quantidade);
           valorPagarInput.value = valor.toFixed(2);
       }
   }

   document.getElementById('orderForm').addEventListener('submit', function(e) {
       e.preventDefault();
       const selectedService = servicesData.find(service => service.id === categoriaSelect.value);
       if (selectedService && linkInput.value && quantidadeInput.value) {
           const orderDetails = {
               service: selectedService.service,
               network: selectedService.network,
               link: linkInput.value,
               quantity: parseInt(quantidadeInput.value),
               price: parseFloat(valorPagarInput.value)
           };
       } else {
           alert('Por favor, preencha todos os campos corretamente.');
       }
   });

   // Inicializar o formulário com o primeiro serviço
   if (servicesData.length > 0) {
       categoriaSelect.value = servicesData[0].id;
       categoriaSelect.dispatchEvent(new Event('change'));
   }
});
