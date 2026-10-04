/**
 * VIBRA — Movimiento · Bienestar · Presencia
 * Interactive Logic & Enhanced UX
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initModals();
  initWhatsAppHelper();
  initEmailCopy();
  initZenAudio();
});

// 1. Sticky Header
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// 2. Mobile Navigation
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.main-navigation');
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    nav.classList.toggle('mobile-open');
    const isOpen = nav.classList.contains('mobile-open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking link
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
    });
  });
}

// 3. Modals System (Video, Founder Story, Programs, Growth Suggestions)
function initModals() {
  const backdrops = document.querySelectorAll('.modal-backdrop');
  
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Pause iframe if exists
    const iframe = modal.querySelector('iframe');
    if (iframe) {
      const src = iframe.src;
      iframe.src = '';
      iframe.src = src;
    }
  }

  function openModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (!targetModal) return;
    targetModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // Close buttons inside modals
  document.querySelectorAll('.modal-close-btn, [data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentModal = btn.closest('.modal-backdrop');
      closeModal(parentModal);
    });
  });

  // Click outside modal dialog to close
  backdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  // Escape key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      backdrops.forEach(modal => {
        if (modal.classList.contains('open')) {
          closeModal(modal);
        }
      });
    }
  });

  // Trigger buttons with data-open-modal
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-open-modal');
      openModal(targetId);
    });
  });

  // Expose to window for inline onclick handlers if needed
  window.openVibraModal = openModal;
  window.closeVibraModal = closeModal;
}

// 4. WhatsApp Topic Formatter & Direct Redirection
function initWhatsAppHelper() {
  // Vibra WhatsApp contact configuration
  // Necochea code: +54 9 2262 (users can configure this easily)
  const defaultPhone = "5492262000000"; 
  
  window.openWhatsAppTopic = function(topic) {
    let message = "¡Hola chicas de Vibra! ";
    switch(topic) {
      case 'clases':
        message += "Quisiera información sobre las clases de Yoga, Pilates y horarios presenciales/online.";
        break;
      case 'cero':
        message += "Vi la propuesta de 'Movimiento desde cero' y me gustaría saber cómo empezar mi camino en Vibra.";
        break;
      case 'tienda':
        message += "Quisiera consultar por disponibilidad y envíos de los productos de Tienda Vibra.";
        break;
      case 'programas':
        message += "Me interesan los Programas Especiales (Pádel, Running, Natación, Fútbol). ¿Tienen más detalles?";
        break;
      case 'empresa':
        message += "Hola Joana y Yoshi! Me comunico para consultar sobre propuestas de bienestar y pausas activas para empresas (Vibra Corporativo).";
        break;
      default:
        message += "Quisiera conocer más sobre las propuestas de Vibra.";
        break;
    }

    const url = `https://wa.me/${defaultPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };
}

// 5. Email Quick Copy & Toast
function initEmailCopy() {
  window.copyEmailToClipboard = function(emailAddress) {
    const email = emailAddress || 'hola@vibramovimiento.com.ar';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email copiado: ${email}`);
      }).catch(() => {
        window.location.href = `mailto:${email}?subject=Consulta%20desde%20la%20Web%20Vibra`;
      });
    } else {
      window.location.href = `mailto:${email}?subject=Consulta%20desde%20la%20Web%20Vibra`;
    }
  };
}

// Show Toast message
function showToast(message) {
  let toast = document.getElementById('vibra-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'vibra-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
    <span>${message}</span>
  `;
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// 6. Zen Ambient Sound Generator (Web Audio API)
// Provides a tranquil, meditative soundscape (soft warm waves) without external audio files
function initZenAudio() {
  const toggleBtn = document.getElementById('zenAudioBtn');
  if (!toggleBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let gainNode = null;
  let filterNode = null;
  let noiseNode = null;

  function startZenAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Create pink noise buffer for soft oceanic swell
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
        b6 = white * 0.115926;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      // Lowpass filter for smooth surf tone
      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(260, audioCtx.currentTime);

      // Gain node for gentle volume & swell
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 3);

      // LFO for rhythmic gentle waves
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.1, audioCtx.currentTime); // 10 second ocean swell
      lfoGain.gain.setValueAtTime(100, audioCtx.currentTime);
      lfo.connect(filterNode.frequency);
      lfo.start();

      noiseNode.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      noiseNode.start();

      isPlaying = true;
      toggleBtn.classList.add('active');
      toggleBtn.querySelector('span').textContent = 'Sonido Zen: ON';
      showToast('Modo Calma activado: Olas suaves de Necochea');
    } catch (e) {
      console.warn('Web Audio not supported or allowed', e);
    }
  }

  function stopZenAudio() {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
      setTimeout(() => {
        if (noiseNode) {
          try { noiseNode.stop(); } catch(e){}
        }
        if (audioCtx) {
          audioCtx.close();
        }
        isPlaying = false;
        toggleBtn.classList.remove('active');
        toggleBtn.querySelector('span').textContent = 'Sonido Zen';
      }, 1000);
    } else {
      isPlaying = false;
      toggleBtn.classList.remove('active');
      toggleBtn.querySelector('span').textContent = 'Sonido Zen';
    }
  }

  toggleBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startZenAudio();
    } else {
      stopZenAudio();
    }
  });
}
