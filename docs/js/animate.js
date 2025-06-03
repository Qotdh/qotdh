  document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll('.animate-up-bouncy');
    elements.forEach((el, index) => {
      el.style.animationDelay = `${index * 200}ms`; // كل عنصر يتأخر بـ 100ms إضافية
    });
  });