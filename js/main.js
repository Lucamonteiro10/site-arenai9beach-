/**
 * ARENA i9 BEACH - SCRIPT PRINCIPAL
 * Interatividades: Simulador de reservas, WhatsApp Dinâmico, Tabs, Stories, Galeria & FAQ
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // 1. HEADER SCROLL & NAVEGAÇÃO MOBILE
  // ========================================================================
  const siteHeader = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  const navOverlay = document.getElementById('navOverlay');

  function toggleMobileMenu(open) {
    const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('active');
    if (shouldOpen) {
      navMenu.classList.add('active');
      mobileToggle.textContent = '✕';
      mobileToggle.setAttribute('aria-expanded', 'true');
      if (navOverlay) navOverlay.classList.add('active');
      document.body.classList.add('menu-open');
    } else {
      navMenu.classList.remove('active');
      mobileToggle.textContent = '☰';
      mobileToggle.setAttribute('aria-expanded', 'false');
      if (navOverlay) navOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu());
    if (navOverlay) navOverlay.addEventListener('click', () => toggleMobileMenu(false));

    // Fechar menu mobile ao clicar em um link
    document.querySelectorAll('.nav-link, .mobile-menu-cta a').forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Fechar no ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMobileMenu(false);
      }
    });
  }

  // ========================================================================
  // 2. DESTAQUES DO FEED (STORIES / CLICKS)
  // ========================================================================
  const storyItems = document.querySelectorAll('.story-item');
  storyItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetSelector = item.getAttribute('data-target');
      const targetTab = item.getAttribute('data-tab');

      if (targetSelector) {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });

          if (targetTab) {
            activateTab(targetTab);
          }
        }
      }
    });
  });

  // ========================================================================
  // 3. TABS DAS MODALIDADES
  // ========================================================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function activateTab(tabId) {
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabPanels.forEach(panel => {
      if (panel.id === tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      activateTab(tabId);
    });
  });

  // ========================================================================
  // 4. SIMULADOR INTELIGENTE DE RESERVAS & WHATSAPP
  // ========================================================================
  const bookingState = {
    modalidade: 'Futvôlei',
    basePrice: 120,
    tipo: 'Horário Avulso',
    discount: 1.0,
    dia: 'Segunda a Quinta',
    dayMult: 1.0,
    periodo: 'Noite (18h às 23h - Holofotes LED)',
    extraNight: 20,
    nome: '',
    telefone: ''
  };

  // Elementos do Resumo
  const sumModalidade = document.getElementById('sumModalidade');
  const sumTipo = document.getElementById('sumTipo');
  const sumDia = document.getElementById('sumDia');
  const sumPeriodo = document.getElementById('sumPeriodo');
  const sumPrecoTotal = document.getElementById('sumPrecoTotal');
  const sumPrecoPessoa = document.getElementById('sumPrecoPessoa');
  const btnEnviarWhatsApp = document.getElementById('btnEnviarWhatsApp');
  const inputNome = document.getElementById('capitaoNome');
  const inputTelefone = document.getElementById('capitaoTelefone');

  function updateBookingCalculation() {
    // Cálculo: (basePrice * dayMult + extraNight) * discount
    const subtotal = (bookingState.basePrice * bookingState.dayMult) + bookingState.extraNight;
    const total = Math.round(subtotal * bookingState.discount);

    // Número de atletas estimado por modalidade
    let atletas = 4;
    if (bookingState.modalidade.includes('Society')) {
      atletas = 14;
    } else if (bookingState.modalidade.includes('Poliesportiva')) {
      atletas = 10;
    } else if (bookingState.modalidade.includes('Beach Tennis')) {
      atletas = 4;
    } else if (bookingState.modalidade.includes('Vôlei')) {
      atletas = 4;
    }

    const valorPorPessoa = (total / atletas).toFixed(2).replace('.', ',');

    // Atualiza DOM
    if (sumModalidade) sumModalidade.textContent = bookingState.modalidade;
    if (sumTipo) sumTipo.textContent = bookingState.tipo;
    if (sumDia) sumDia.textContent = bookingState.dia;
    if (sumPeriodo) sumPeriodo.textContent = bookingState.periodo.split('(')[0].trim();
    if (sumPrecoTotal) sumPrecoTotal.textContent = `R$ ${total},00`;
    if (sumPrecoPessoa) {
      sumPrecoPessoa.textContent = `Apenas ~R$ ${valorPorPessoa} por atleta (estimado para ${atletas} jogadores)`;
    }
  }

  // Helper para alternar botões de escolha
  function setupChoiceGroup(containerId, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const buttons = container.querySelectorAll('.choice-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        callback(btn);
        updateBookingCalculation();
      });
    });
  }

  // 1. Modalidade
  setupChoiceGroup('modalidadeChoices', (btn) => {
    bookingState.modalidade = btn.getAttribute('data-value');
    bookingState.basePrice = parseFloat(btn.getAttribute('data-price')) || 120;
  });

  // 2. Tipo
  setupChoiceGroup('tipoChoices', (btn) => {
    bookingState.tipo = btn.getAttribute('data-value');
    bookingState.discount = parseFloat(btn.getAttribute('data-discount')) || 1.0;
  });

  // 3. Dia
  setupChoiceGroup('diaChoices', (btn) => {
    bookingState.dia = btn.getAttribute('data-value');
    bookingState.dayMult = parseFloat(btn.getAttribute('data-mult')) || 1.0;
  });

  // 4. Período
  setupChoiceGroup('periodoChoices', (btn) => {
    bookingState.periodo = btn.getAttribute('data-value');
    bookingState.extraNight = parseFloat(btn.getAttribute('data-extra')) || 0;
  });

  // 5. Botão de Enviar WhatsApp com Mensagem Formatada
  if (btnEnviarWhatsApp) {
    btnEnviarWhatsApp.addEventListener('click', () => {
      const nome = inputNome ? inputNome.value.trim() : '';
      const telefone = inputTelefone ? inputTelefone.value.trim() : '';

      const responsavelText = nome ? `\n👤 *Responsável:* ${nome}` : '';
      const telefoneText = telefone ? `\n📱 *Contato:* ${telefone}` : '';

      const mensagem = `*Olá Arena i9 Beach!* 🏟️☀️
Gostaria de consultar a disponibilidade para jogar na Arena:

📌 *Modalidade:* ${bookingState.modalidade}
⭐ *Tipo:* ${bookingState.tipo}
📅 *Dia pretendido:* ${bookingState.dia}
⏰ *Período:* ${bookingState.periodo}
💰 *Investimento Estimado:* ${sumPrecoTotal.textContent}${responsavelText}${telefoneText}

Poderia me confirmar os horários livres nesta semana? Obrigado!`;

      const encodedMsg = encodeURIComponent(mensagem);
      // Número do WhatsApp oficial da Arena i9 Beach (+55 31 97564-0417)
      const whatsappUrl = `https://wa.me/5531975640417?text=${encodedMsg}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // Inicializa cálculo
  updateBookingCalculation();

  // ========================================================================
  // ========================================================================
  // 5. FILTRO E UPLOAD/PREVIEW DA GALERIA DE FOTOS
  // ========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category') || '';
        const cats = category.split(' ').map(c => c.trim());
        if (filter === 'all' || cats.includes(filter)) {
          item.style.display = '';
          item.style.animation = 'fadeIn 0.3s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Interatividade nos slots de fotos (carregamento e prévia local)
  galleryItems.forEach(item => {
    const fileInput = item.querySelector('.gallery-file-input');
    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          let img = item.querySelector('img');
          if (!img) {
            img = document.createElement('img');
            img.alt = 'Foto carregada na Arena i9';
            item.appendChild(img);
          }
          img.src = event.target.result;
          item.setAttribute('data-img', event.target.result);
          item.classList.add('has-image');

          let overlay = item.querySelector('.gallery-overlay');
          if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            const cat = item.getAttribute('data-category') || 'Arena i9';
            overlay.innerHTML = `
              <span class="gallery-overlay-tag">${cat.toUpperCase()}</span>
              <span class="gallery-overlay-title">Foto da Arena i9</span>
            `;
            item.appendChild(overlay);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // ========================================================================
  // 6. MODAL LIGHTBOX
  // ========================================================================
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightboxModal && lightboxImg && lightboxCaption) {
    galleryItems.forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT') return;

        // Se tiver rota/ambiente de destino configurado, navega para o ambiente do site
        const navTarget = item.getAttribute('data-nav-target');
        if (navTarget) {
          const targetEl = document.querySelector(navTarget);
          const targetTab = item.getAttribute('data-target-tab');
          const selectMod = item.getAttribute('data-select-mod');

          if (targetTab) activateTab(targetTab);
          if (selectMod) {
            const modBtns = document.querySelectorAll('#modalidadeChoices .choice-btn');
            modBtns.forEach(btn => {
              if (btn.getAttribute('data-value') === selectMod || btn.textContent.includes(selectMod)) {
                btn.click();
              }
            });
          }

          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth' });
            return;
          }
        }

        const imgEl = item.querySelector('img');
        const imgSrc = item.getAttribute('data-img') || (imgEl ? imgEl.src : '');

        // Se ainda não tiver imagem definida, dispara o seletor para escolher foto
        if (!imgSrc || imgSrc.trim() === '') {
          const fileInput = item.querySelector('.gallery-file-input');
          if (fileInput) fileInput.click();
          return;
        }

        // Se já tiver imagem e não for link direto, abre o lightbox
        const caption = item.getAttribute('data-caption') || (imgEl ? imgEl.alt : '');
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
        lightboxModal.classList.add('active');
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ========================================================================
  // 7. FAQ ACORDEÃO INTERATIVO
  // ========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Fecha todos os outros
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        // Alterna o atual
        if (!isOpen) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // ========================================================================
  // 8. INTERATIVIDADE NOS SLOTS DE MODALIDADES E EVENTOS
  // ========================================================================
  const interactiveSlots = document.querySelectorAll('.panel-slot, .events-slot');
  interactiveSlots.forEach(slot => {
    const fileInput = slot.querySelector('.slot-file-input');
    if (!fileInput) return;

    slot.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT') return;
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          let img = slot.querySelector('img');
          if (!img) {
            img = document.createElement('img');
            img.alt = 'Foto da Arena i9';
            slot.appendChild(img);
          }
          img.src = event.target.result;
          slot.classList.add('has-image');
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // ========================================================================
  // 9. NAVEGAÇÃO INTELIGENTE AO CLICAR NAS FOTOS DAS MODALIDADES
  // ========================================================================
  document.querySelectorAll('.panel-image-wrapper[data-nav-target], .panel-link[data-nav-target]').forEach(el => {
    el.addEventListener('click', (e) => {
      const targetSelector = el.getAttribute('data-nav-target');
      const selectMod = el.getAttribute('data-select-mod');

      if (selectMod) {
        const modBtns = document.querySelectorAll('#modalidadeChoices .choice-btn');
        modBtns.forEach(btn => {
          if (btn.getAttribute('data-value') === selectMod || btn.textContent.includes(selectMod)) {
            btn.click();
          }
        });
      }

      if (targetSelector) {
        const targetEl = document.querySelector(targetSelector);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

});
