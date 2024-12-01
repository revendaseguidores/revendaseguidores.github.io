document.addEventListener('DOMContentLoaded', function() {
   // Smooth scrolling for anchor links
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
       anchor.addEventListener('click', function (e) {
           e.preventDefault();
           document.querySelector(this.getAttribute('href')).scrollIntoView({
               behavior: 'smooth'
           });
       });
   });

   // Highlight active section in navbar
   const sections = document.querySelectorAll('main section');
   const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
   const footer = document.querySelector('footer');
   

   function highlightNavLink() {
    let scrollPosition = window.pageYOffset;
  
    // Check if we've scrolled to the footer
    if (footer.offsetTop <= (scrollPosition + window.innerHeight)) {
      navLinks.forEach(navLink => navLink.classList.remove('active'));
      return;
    }
  
    let activeSection = null;
  
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionTop = section.offsetTop - 150;
      const sectionBottom = sectionTop + section.offsetHeight;
  
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        activeSection = section;
        break;
      }
    }
  
    if (activeSection) {
      navLinks.forEach(navLink => {
        if (navLink.getAttribute('href') === `#${activeSection.id}`) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      });
    }
  }

   window.addEventListener('scroll', highlightNavLink);
   window.addEventListener('load', highlightNavLink);

   // Toggle form function (if you have this functionality)
   window.toggleForm = function(formType) {
       const loginContainer = document.getElementById('login-container');
       const registerContainer = document.getElementById('register-container');

       if (formType === 'login') {
           loginContainer.classList.add('active');
           registerContainer.classList.remove('active');
       } else {
           registerContainer.classList.add('active');
           loginContainer.classList.remove('active');
       }
   }
});