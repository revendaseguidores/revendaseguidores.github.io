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

  // Toggle form function
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

      // Fill coupon field if switching to register form
      if (formType === 'register') {
          fillCouponFromURL();
      }
  }

  // Function to fill coupon from URL
  function fillCouponFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      const couponCode = urlParams.get('cupom');
      if (couponCode) {
          const couponInput = document.getElementById('register-coupon');
          if (couponInput) {
              couponInput.value = couponCode;
          }
      }
  }

  // Call checkCouponAndToggleForm on page load
  if (typeof checkCouponAndToggleForm === 'function') {
      checkCouponAndToggleForm();
  }
});