'use strict';

window.addEventListener('DOMContentLoaded', function() {

  document.querySelectorAll('img').forEach(img => img.loading = 'lazy');

  // ========== ساخت لایت‌باکس ==========
  if(!document.getElementById('lb')) {
    document.body.insertAdjacentHTML('beforeend', `<div id="lb" onclick="this.style.display='none'" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;justify-content:center;align-items:center"><img id="lbi" style="max-width:90%;max-height:90%;object-fit:contain"><b onclick="event.stopPropagation();document.getElementById('lb').style.display='none'" style="position:absolute;top:20px;right:30px;color:#fff;font-size:40px;cursor:pointer;font-family:Arial">&times;</b></div>`);
    window.lb = document.getElementById('lb');
    window.lbi = document.getElementById('lbi');
  }

  // ========== فقط لینک‌های دارای attribute data-lightbox ==========
  document.querySelectorAll('a[data-lightbox]').forEach(a => {
    a.addEventListener('click', e => {
      let img = a.querySelector('img');
      if(img && img.src) {
        e.preventDefault();
        lbi.src = img.src;
        lb.style.display = 'flex';
      } else if(a.getAttribute('db64')) {
        e.preventDefault();
        lbi.src = a.getAttribute('db64');
        lb.style.display = 'flex';
      }
    });
  });

  // ========== element toggle function ==========
  const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

  // ========== sidebar variables ==========
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");

  // sidebar toggle functionality for mobile
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

  // ========== testimonials variables ==========
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");

  // modal variable
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalTitles = document.querySelector("[data-modal-titles]");
  const modalTime = document.querySelector("[data-modal-time]");
  const modalText = document.querySelector("[data-modal-text]");

  // modal toggle function
  const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  // add click event to all modal items
  for (let i = 0; i < testimonialsItem.length; i++) {

    testimonialsItem[i].addEventListener("click", function () {

      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalTitles.innerHTML = this.querySelector("[data-testimonials-titles]").innerHTML;
      modalTime.innerHTML = this.querySelector("[data-testimonials-time]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

      testimonialsModalFunc();

    });

  }

  // add click event to modal close button
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);

});