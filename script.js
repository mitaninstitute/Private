// script.js
// کۆمەنتەکان بە کوردی: ئەم فایلە JS یە بۆ گۆڕینی زمان، سەرنجاندنی مینو و فۆرمەکان.

/* تۆگڵی مینو - بۆ مۆبایل */
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('show');
}

/* گۆڕینی زمان - backend نەخۆریە، هەموو دەقەکان لە DOM دەگۆڕێت */
function changeLanguage() {
  const lang = document.getElementById('languageSelector').value;
  const elements = document.querySelectorAll('[data-en]');

  // بەکارهێنانی RTL بۆ عەرەبی و کوردی (Sorani) - ئەگەر دەتەوێت کوردی LTR بێت گۆڕاوی لێ بکە
  if (lang === 'ar' || lang === 'ku') {
    document.body.dir = 'rtl';
    document.body.style.textAlign = 'right';
  } else {
    document.body.dir = 'ltr';
    document.body.style.textAlign = 'left';
  }

  elements.forEach(el => {
    const txt = el.getAttribute('data-' + lang);
    if (txt) el.textContent = txt;
  });
}

/* نمونهی فۆرم - پاشان دەتوانیت API یەک بەکارهێنیت */
function submitContact(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    alert(getTextByLang('Please fill all fields', 'يرجى ملء جميع الحقول', 'تکایە هەموو خانەکان پڕبکە'));
    return;
  }

  // ئەم نمونەیە تەنها لە فەرمی لۆکال کاردەکات - لەگەڵ بئک-ئەند API دروست کرابێت دەتوانیت POST بکەیت
  alert(getTextByLang('Message sent. Thank you!', 'تم إرسال الرسالة. شكرًا!', 'پەیام نێردرا. سوپاس!'));

  // بە دڵخوازت لێرە خالی بکە پەیام و فۆرم نابینیت
  document.getElementById('contactForm').reset();
}

/* هێندە زانیارییەک بۆ alert بەپێی زمان */
function getTextByLang(en, ar, ku) {
  const lang = document.getElementById('languageSelector').value;
  if (lang === 'ar') return ar;
  if (lang === 'ku') return ku;
  return en;
}

/* تا بارکردنی پەڕە - فەرمی زمان بە دیفۆڵت لێرە دابنێ */
document.addEventListener('DOMContentLoaded', function() {
  // دیفۆڵت زمان: کوردی
  document.getElementById('languageSelector').value = 'ku';
  changeLanguage();
});

// Replace onclick="toggleMenu()" with:
document.getElementById('menuToggle').addEventListener('click', function() {
  document.getElementById('navLinks').classList.toggle('show');
});

// Replace onchange="changeLanguage()" with:
document.getElementById('languageSelector').addEventListener('change', changeLanguage);

// Replace onsubmit="submitContact(event)" with:
document.getElementById('contactForm').addEventListener('submit', submitContact);


