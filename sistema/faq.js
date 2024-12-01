document.addEventListener('DOMContentLoaded', function() {
   // Smooth scrolling for accordion items
   const accordionItems = document.querySelectorAll('.accordion-item');
   accordionItems.forEach(item => {
       item.addEventListener('shown.bs.collapse', function() {
           item.scrollIntoView({ behavior: 'smooth', block: 'center' });
       });
   });

   // Add animation to contact icons
   const contactIcons = document.querySelectorAll('.contact-icons a');
   contactIcons.forEach(icon => {
       icon.addEventListener('mouseenter', function() {
           this.style.transform = 'scale(1.2)';
       });
       icon.addEventListener('mouseleave', function() {
           this.style.transform = 'scale(1)';
       });
   });

   // Add a "Copy to clipboard" feature for contact information
   const emailIcon = document.querySelector('.contact-icons a[href^="mailto:"]');
   const whatsappIcon = document.querySelector('.contact-icons a[href^="https://wa.me/"]');

   if (emailIcon) {
       emailIcon.addEventListener('click', function(e) {
           e.preventDefault();
           const email = this.getAttribute('href').replace('mailto:', '');
           copyToClipboard(email, 'E-mail copiado para a área de transferência!');
       });
   }

   if (whatsappIcon) {
       whatsappIcon.addEventListener('click', function(e) {
           e.preventDefault();
           const whatsapp = this.getAttribute('href').replace('https://wa.me/', '');
           copyToClipboard(whatsapp, 'Número do WhatsApp copiado para a área de transferência!');
       });
   }

   function copyToClipboard(text, message) {
       navigator.clipboard.writeText(text).then(function() {
           alert(message);
       }, function(err) {
           console.error('Erro ao copiar texto: ', err);
       });
   }
});