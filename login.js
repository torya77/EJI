const form = document.querySelector('.glass');

// Slight 3D tilt based on pointer position
window.addEventListener('pointermove', (e) => {
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;
  form.style.transform = `rotateY(${x * 10}deg) rotateX(${ -y * 10}deg)`;
});

// Simple demo behaviour on submit
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  form.style.transform = 'scale(0.98)';
  setTimeout(() => {
    form.style.transform = '';
    alert('Connexion simulée !');
  }, 150);
});
