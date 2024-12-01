const servicesData = [
   { id: 'instagram_seguidores_mundiais', network: 'Instagram', service: 'Seguidores Mundiais', min: 10, max: 5000000, basePrice: 1.331 },
   { id: 'instagram_seguidores_brasileiros', network: 'Instagram', service: 'Seguidores Brasileiros', min: 10, max: 100000, basePrice: 3.718 },
   { id: 'instagram_seguidores_organicos', network: 'Instagram', service: 'Seguidores Orgânicos', min: 50, max: 1000000, basePrice: 5.489 },
   { id: 'instagram_curtidas_mundiais', network: 'Instagram', service: 'Curtidas Mundiais', min: 30, max: 100000, basePrice: 0.07 },
   { id: 'instagram_curtidas_brasileiras', network: 'Instagram', service: 'Curtidas Brasileiras', min: 20, max: 30000, basePrice: 0.99 },
   { id: 'instagram_curtidas_organicas', network: 'Instagram', service: 'Curtidas Orgânicas', min: 10, max: 6000, basePrice: 0.671 },
   { id: 'instagram_visualizacoes_reels', network: 'Instagram', service: 'Visualizações nos REELS', min: 100, max: 2147483647, basePrice: 0.006 },
   { id: 'instagram_visualizacoes_stories', network: 'Instagram', service: 'Visualizações nos Stories', min: 20, max: 20000, basePrice: 0.13 },
   { id: 'instagram_visualizacoes_live', network: 'Instagram', service: 'Visualizações em Live', min: 10, max: 20000, basePrice: 4.18 },
   { id: 'instagram_comentarios_emojis', network: 'Instagram', service: 'Comentários Emojis', min: 100, max: 1000000, basePrice: 1.034 },
   { id: 'tiktok_seguidores_rapidos', network: 'TikTok', service: 'Seguidores / Rápidos', min: 10, max: 10000, basePrice: 1.289 },
   { id: 'tiktok_seguidores_brasileiros', network: 'TikTok', service: 'Seguidores / Brasileiros', min: 10, max: 100000, basePrice: 2.215 },
   { id: 'tiktok_curtidas_mundiais', network: 'TikTok', service: 'Curtidas / Mundiais', min: 10, max: 1000000, basePrice: 0.17 },
   { id: 'tiktok_curtidas_brasileiros', network: 'TikTok', service: 'Curtidas / Brasileiros', min: 10, max: 500000, basePrice: 0.277 },
   { id: 'tiktok_visualizacoes', network: 'TikTok', service: 'Visualizações', min: 100, max: 100000000, basePrice: 0.088 },
   { id: 'tiktok_visualizacoes_lives', network: 'TikTok', service: 'Visualizações / Em Lives', min: 50, max: 100000, basePrice: 4.62 },
   { id: 'tiktok_comentarios_mundiais', network: 'TikTok', service: 'Comentários / Mundiais', min: 10, max: 1000, basePrice: 6.589 },
   { id: 'facebook_seguidores', network: 'Facebook', service: 'Seguidores', min: 100, max: 5000, basePrice: 2.112 },
   { id: 'facebook_comentarios_emojis', network: 'Facebook', service: 'Comentários Emojis / Avaliações', min: 5, max: 1000, basePrice: 25.30 },
   { id: 'facebook_curtidas_pagina', network: 'Facebook', service: 'Curtidas em Página', min: 100, max: 100000, basePrice: 2.13 },
   { id: 'facebook_curtidas_publicacao', network: 'Facebook', service: 'Curtidas em Publicação', min: 100, max: 20000, basePrice: 1.076 },
   { id: 'facebook_reacao_post', network: 'Facebook', service: 'Reação em Post', min: 50, max: 100000, basePrice: 0.88 },
   { id: 'youtube_inscritos', network: 'YouTube', service: 'Inscritos [Monetizável]', min: 100, max: 100000, basePrice: 5.689 },
   { id: 'youtube_likes', network: 'YouTube', service: 'Likes', min: 50, max: 25000, basePrice: 1.076 },
   { id: 'youtube_visualizacao_anuncio', network: 'YouTube', service: 'Visualização por Anúncio', min: 10000, max: 10000000, basePrice: 1.872 },
   { id: 'youtube_visualizacoes_brasileiras', network: 'YouTube', service: 'Visualizações Brasileiras ADS / Por Estado', min: 5000, max: 100000, basePrice: 7.143 },
   { id: 'youtube_visualizacoes_brasileiras_reais', network: 'YouTube', service: 'Visualizações / ADS - 100% reais / Brasileiros', min: 3000, max: 50000, basePrice: 3.276 },
   { id: 'youtube_visualizacao_live_rapido', network: 'YouTube', service: 'Visualização em Transmissão ao VIVO (Super Rápido)', min: 50, max: 50000, basePrice: 0.981 },
   { id: 'youtube_visualizacao_live', network: 'YouTube', service: 'Visualização em Transmissão ao VIVO', min: 100, max: 20000, basePrice: 7.946 },
   { id: 'youtube_shorts', network: 'YouTube', service: 'Shorts (Visualizações / Curtidas)', min: 50, max: 100000, basePrice: 0.97 },
   { id: 'twitter_visualizacoes', network: 'Twitter', service: 'Visualizações', min: 20, max: 200000, basePrice: 0.035 },
   { id: 'twitter_curtidas', network: 'Twitter', service: 'Curtidas', min: 20, max: 1000, basePrice: 0.748 },
   { id: 'twitter_retweets', network: 'Twitter', service: 'Retweets', min: 20, max: 100000, basePrice: 1.388 },
   { id: 'twitter_seguidores', network: 'Twitter', service: 'Seguidores Sem Reposição', min: 100, max: 5000, basePrice: 1.179 },
   { id: 'telegram_inscritos', network: 'Telegram', service: 'Inscritos / Membros', min: 500, max: 20000, basePrice: 0.867 },
   { id: 'telegram_visualizacoes', network: 'Telegram', service: 'Visualizações', min: 100, max: 100000000, basePrice: 0.006 },
   { id: 'telegram_reacoes', network: 'Telegram', service: 'Reação para Publicações', min: 15, max: 1000000, basePrice: 0.099 },
   { id: 'kwai_seguidores_brasileiros', network: 'Kwai', service: 'Seguidores / Brasileiros', min: 10, max: 600000, basePrice: 0.301 },
   { id: 'kwai_curtidas_brasileiros', network: 'Kwai', service: 'Curtidas / Brasileiros', min: 10, max: 50000, basePrice: 0.187 },
   { id: 'kwai_visualizacoes', network: 'Kwai', service: 'Visualizações / Global', min: 100, max: 1000000, basePrice: 0.634 }
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
       return (pricePerQuantity * 0.1) + pricePerQuantity + 2; // Calculate total price
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