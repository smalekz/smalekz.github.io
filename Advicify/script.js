// اسکرول نرم برای CTAها و ثبت lead ساده
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#lead-form');
    if(form){
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        // در عمل اینجا به سرور ارسال کن (fetch/axios)
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true; btn.textContent = 'در حال ثبت...';
        setTimeout(() => {
          btn.textContent = 'ثبت شد ✅';
          const msg = document.querySelector('#lead-msg');
          if(msg){ msg.textContent = 'با شما تماس می‌گیریم. ممنون از اعتمادتان.'; msg.style.color = '#22c55e'; }
        }, 900);
      });
    }
  });
  