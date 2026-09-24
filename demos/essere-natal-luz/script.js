/**
 * Essere Viagens — Master Template Engine
 * Gerenciamento do Carrossel de Fotos, Player de Vídeo, Formulário Wizard (10 Etapas) e FAQ Accordion.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. CARROSSEL INTERATIVO DO SKY SERRA HOTEL
  // ==========================================
  const hotelActiveImg = document.getElementById('hotel-active-img');
  const hotelCaption = document.getElementById('hotel-caption');
  const hotelThumbs = document.querySelectorAll('.hotel-thumb');
  const btnPrevHotel = document.getElementById('btn-prev-hotel');
  const btnNextHotel = document.getElementById('btn-next-hotel');

  let currentHotelIdx = 0;

  function setHotelImage(idx) {
    if (idx < 0) idx = hotelThumbs.length - 1;
    if (idx >= hotelThumbs.length) idx = 0;
    currentHotelIdx = idx;

    const targetThumb = hotelThumbs[currentHotelIdx];
    if (targetThumb && hotelActiveImg) {
      const newSrc = targetThumb.getAttribute('data-src');
      const newCaption = targetThumb.getAttribute('data-caption');

      hotelActiveImg.style.opacity = '0.4';
      setTimeout(() => {
        hotelActiveImg.src = newSrc;
        hotelActiveImg.style.opacity = '1';
        if (hotelCaption) hotelCaption.textContent = newCaption;
      }, 150);

      hotelThumbs.forEach(t => t.classList.remove('active-thumb'));
      targetThumb.classList.add('active-thumb');
    }
  }

  hotelThumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      setHotelImage(index);
    });
  });

  if (btnPrevHotel) {
    btnPrevHotel.addEventListener('click', () => {
      setHotelImage(currentHotelIdx - 1);
    });
  }

  if (btnNextHotel) {
    btnNextHotel.addEventListener('click', () => {
      setHotelImage(currentHotelIdx + 1);
    });
  }


  // ==========================================
  // 2. PLAYER DE VÍDEO INSTITUCIONAL REAL
  // ==========================================
  const essereVideo = document.getElementById('essere-video');
  const videoOverlay = document.getElementById('video-overlay');

  if (essereVideo && videoOverlay) {
    videoOverlay.addEventListener('click', () => {
      videoOverlay.style.opacity = '0';
      setTimeout(() => {
        videoOverlay.style.display = 'none';
      }, 250);
      essereVideo.setAttribute('controls', 'true');
      essereVideo.play();
    });

    essereVideo.addEventListener('pause', () => {
      if (essereVideo.seeking) return;
      videoOverlay.style.display = 'flex';
      setTimeout(() => {
        videoOverlay.style.opacity = '1';
      }, 10);
    });
  }


  // ==========================================
  // 3. FORMULÁRIO WIZARD INTELIGENTE (10 ETAPAS)
  // ==========================================
  let currentStep = 1;
  const totalSteps = 10;

  const wizardSteps = document.querySelectorAll('.wizard-step');
  const stepLabel = document.getElementById('wizard-step-label');
  const progressBar = document.getElementById('wizard-progress-bar');
  const progressPercent = document.getElementById('wizard-progress-percent');

  // Armazenamento das Respostas
  const formData = {
    name: '',
    city: 'Recife (REC)',
    adults: '2 Adultos (Casal)',
    children: 'Apenas Adultos (Sem crianças)',
    rooms: '1 Quarto (Casal / Duplo)',
    dates: '20 a 25 de Novembro (Pacote Anunciado)',
    goal: 'Aproveitar o Pacote Promocional de Gramado',
    timing: 'Imediato (Quero fechar para garantir o 1º Lote)',
    budget: 'Dentro do anunciado (10x de R$ 329 por pessoa)',
    priority: 'Melhor Preço e Parcelamento em 10x',
    phone: '',
    obs: ''
  };

  function updateWizardUI() {
    wizardSteps.forEach(step => {
      const stepNum = parseInt(step.getAttribute('data-step'), 10);
      if (stepNum === currentStep) {
        step.classList.remove('hidden');
      } else {
        step.classList.add('hidden');
      }
    });

    if (stepLabel) stepLabel.textContent = `Etapa ${currentStep} de ${totalSteps}`;
    const pct = Math.round((currentStep / totalSteps) * 100);
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressPercent) progressPercent.textContent = `${pct}%`;
  }

  // Configuração dos botões de opção do wizard
  document.querySelectorAll('[data-field]').forEach(container => {
    const fieldName = container.getAttribute('data-field');
    const buttons = container.querySelectorAll('.wizard-option-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => {
          b.classList.remove('active-option');
          const icon = b.querySelector('i');
          if (icon) icon.classList.add('opacity-0');
        });

        btn.classList.add('active-option');
        const activeIcon = btn.querySelector('i');
        if (activeIcon) activeIcon.classList.remove('opacity-0');

        formData[fieldName] = btn.getAttribute('data-value') || btn.textContent.trim();
      });
    });
  });

  // Botões Avançar
  document.querySelectorAll('.btn-next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep === 1) {
        const nameInput = document.getElementById('wiz-name');
        const cityInput = document.getElementById('wiz-city');
        if (!nameInput.value.trim()) {
          alert('Por favor, informe seu nome para continuar.');
          nameInput.focus();
          return;
        }
        formData.name = nameInput.value.trim();
        formData.city = cityInput.value.trim() || 'Recife (REC)';
      }

      if (currentStep < totalSteps) {
        currentStep++;
        updateWizardUI();
      }
    });
  });

  // Botões Voltar
  document.querySelectorAll('.btn-prev-step').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateWizardUI();
      }
    });
  });

  // Disparo Final para WhatsApp Oficial
  const btnSubmitWizard = document.getElementById('btn-submit-wizard');
  if (btnSubmitWizard) {
    btnSubmitWizard.addEventListener('click', () => {
      const phoneInput = document.getElementById('wiz-phone');
      const obsInput = document.getElementById('wiz-obs');

      if (!phoneInput.value.trim()) {
        alert('Por favor, insira o seu número de WhatsApp com DDD para receber a cotação.');
        phoneInput.focus();
        return;
      }

      formData.phone = phoneInput.value.trim();
      formData.obs = obsInput ? obsInput.value.trim() : '';

      // Montagem da Mensagem Estruturada
      const msg = 
`✨ *PROPOSTA DE VIAGEM — NATAL LUZ EM GRAMADO 2026* ✨
_Cotação solicitada via Landing Page Oficial da Essere Viagens_

👤 *Nome:* ${formData.name}
📍 *Origem / Saída:* ${formData.city}
👥 *Adultos:* ${formData.adults}
👶 *Crianças:* ${formData.children}
🛏️ *Quartos:* ${formData.rooms}
📅 *Período Desejado:* ${formData.dates}
🎯 *Objetivo:* ${formData.goal}
⏳ *Momento de Compra:* ${formData.timing}
💰 *Expectativa de Investimento:* ${formData.budget}
⭐ *Prioridade:* ${formData.priority}
📱 *WhatsApp:* ${formData.phone}
${formData.obs ? `📝 *Observação:* ${formData.obs}` : ''}

👉 _Gostaria de verificar a disponibilidade do 1º Lote (A partir de 10x de R$ 329/pessoa) e receber o atendimento de um consultor!_`;

      const encodedMsg = encodeURIComponent(msg);
      const whatsappUrl = `https://wa.me/5581993077045?text=${encodedMsg}`;

      // Dispara evento de conversão (Lead) no Meta Pixel
      if (typeof fbq === 'function') {
        fbq('track', 'Lead', {
          content_name: 'Proposta Natal Luz Gramado 2026',
          currency: 'BRL',
          value: 3290.00
        });
      }

      window.open(whatsappUrl, '_blank');
    });
  }

  // Rastreamento automático de cliques em links de WhatsApp (Contact)
  document.querySelectorAll('a[href*="chat.whatsapp.com"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof fbq === 'function') {
        fbq('track', 'Contact', { content_name: 'Grupo VIP WhatsApp' });
      }
    });
  });

  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof fbq === 'function') {
        fbq('track', 'Contact', { content_name: 'Contato Direto WhatsApp' });
      }
    });
  });


  // ==========================================
  // 4. FAQ ACCORDION (DÚVIDAS FREQUENTES)
  // ==========================================
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const icon = toggle.querySelector('i');
      const isOpen = !content.classList.contains('hidden');

      // Fecha todos
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-toggle i').forEach(ic => ic.style.transform = 'rotate(0deg)');

      // Abre o clicado se estava fechado
      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // ==========================================
  // 5. INICIALIZAR ANIMAÇÕES ON SCROLL (AOS)
  // ==========================================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic'
    });
  }

  // ==========================================
  // 6. CONTAGEM REGRESSIVA DINÂMICA
  // ==========================================
  const counterEl = document.getElementById('days-counter');
  if (counterEl) {
    // A data base de início do pacote é 20 de Novembro de 2026
    const targetDate = new Date('2026-11-20T00:00:00');
    
    // Pega a data atual
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera as horas para focar apenas em 'dias completos'
    
    // Calcula a diferença em milissegundos
    const diffTime = targetDate - today;
    
    // Converte para dias (1000ms * 60s * 60m * 24h = 86400000ms)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Atualiza o HTML se a data ainda não passou
    if (diffDays > 0) {
      counterEl.textContent = diffDays;
    } else if (diffDays === 0) {
      // Se for no exato dia da viagem
      counterEl.parentElement.innerHTML = '<strong class="text-2xl sm:text-3xl text-white font-extrabold mx-1">O GRANDE DIA CHEGOU!</strong>';
    } else {
      // Se a viagem já passou
      counterEl.parentElement.style.display = 'none';
    }
  }

});
