// ════════════════════════════════════════════════════════════
// YORRO PHONE MODULE — Frontend Enhanced v2.0
// © Patrick Emessiene Amayna — Tous droits réservés
//
// AMÉLIORATIONS:
// ✅ Gestion complète des appels
// ✅ Interface réactive en temps réel
// ✅ Historique intelligent
// ✅ Contacts avec favoris
// ✅ Notifications
// ✅ Accessibilité complète
// ✅ Service Worker prêt
// ════════════════════════════════════════════════════════════

class YorroPhoneModule {
  constructor(config = {}) {
    this.config = {
      backendUrl: config.backendUrl || 'http://localhost:3001',
      frontendUrl: config.frontendUrl || window.location.origin,
      ...config,
    };

    this.state = {
      currentNumber: '',
      activeCall: null,
      callHistory: [],
      contacts: [],
      favorites: [],
      callDuration: 0,
      isCallActive: false,
      isMuted: false,
      isVideoOn: true,
      selectedNetwork: 'auto',
      networkStatus: {},
    };

    this.timers = {};
    this.mediaStream = null;
    this.peerConnection = null;
    this.callStartTime = null;

    this.init();
  }

  // ════════════════════════════════════════════
  // INITIALISATION
  // ════════════════════════════════════════════

  init() {
    console.log('📞 Initialisation du module téléphonique YORRO...');
    this.setupEventListeners();
    this.loadFromStorage();
    this.fetchNetworkStatus();
    this.setupNotifications();
    this.registerServiceWorker();
  }

  setupEventListeners() {
    // Dialer keys
    document.querySelectorAll('.dial-key').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleDialKey(e));
    });

    // Call buttons
    document.querySelectorAll('.call-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleCallAction(e));
    });

    // Phone tabs
    document.querySelectorAll('.phone-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchTab(e));
    });

    // Delete button
    const deleteBtn = document.querySelector('.dialer-del');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => this.deleteNumber());
      deleteBtn.addEventListener('long-press', () => this.clearNumber());
    }

    // Contact/history items
    document.addEventListener('click', (e) => {
      if (e.target.closest('.history-item')) {
        const item = e.target.closest('.history-item');
        this.dialFromHistory(item);
      }
      if (e.target.closest('.call-contact-item')) {
        const item = e.target.closest('.call-contact-item');
        this.dialContact(item);
      }
      if (e.target.closest('.recall-btn')) {
        e.stopPropagation();
        const item = e.target.closest('.history-item');
        this.dialFromHistory(item);
      }
    });

    // Call controls in active call
    document.querySelectorAll('.call-ctrl-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleCallControl(e));
    });

    // End call button
    const endBtn = document.querySelector('.call-end-btn');
    if (endBtn) {
      endBtn.addEventListener('click', () => this.endCall());
    }

    // Network selector
    document.querySelectorAll('[data-network]').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectNetwork(e));
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
  }

  // ════════════════════════════════════════════
  // DIALER LOGIC
  // ════════════════════════════════════════════

  handleDialKey(event) {
    const key = event.currentTarget;
    const digit = key.dataset.digit || key.innerText.split('\n')[0];

    if (digit === '⌫') {
      this.deleteNumber();
    } else if (digit && /^[\d*#+]$/.test(digit)) {
      this.addNumber(digit);
      this.playDialTone(digit);
    }
  }

  addNumber(digit) {
    if (this.state.currentNumber.length < 15) {
      this.state.currentNumber += digit;
      this.updateDialerDisplay();
      this.saveToStorage();
    }
  }

  deleteNumber() {
    this.state.currentNumber = this.state.currentNumber.slice(0, -1);
    this.updateDialerDisplay();
    this.saveToStorage();
  }

  clearNumber() {
    this.state.currentNumber = '';
    this.updateDialerDisplay();
    this.saveToStorage();
  }

  updateDialerDisplay() {
    const display = document.querySelector('.dialer-number');
    if (display) {
      display.textContent = this.formatPhoneNumber(this.state.currentNumber) || '+';
      display.classList.add('typing');
      setTimeout(() => display.classList.remove('typing'), 100);
    }

    // Check contact match
    this.checkContactMatch(this.state.currentNumber);
  }

  formatPhoneNumber(number) {
    if (!number) return '';
    // Format like: +237 6XX XXX XXX
    if (number.startsWith('+')) {
      return number.slice(0, 5) + ' ' + number.slice(5, 8) + ' ' + number.slice(8, 11) + ' ' + number.slice(11);
    }
    return number;
  }

  checkContactMatch(number) {
    const match = this.state.contacts.find(c => c.phone.includes(number));
    const matchDisplay = document.querySelector('.dialer-contact-match');
    if (matchDisplay) {
      if (match) {
        matchDisplay.textContent = `🔍 ${match.name} (${match.type})`;
        matchDisplay.classList.add('show');
      } else {
        matchDisplay.classList.remove('show');
      }
    }
  }

  playDialTone(digit) {
    // Implémentation simple du son de numérotation
    if (!window.AudioContext && !window.webkitAudioContext) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const freq = this.getDialToneFrequency(digit);
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.1);
  }

  getDialToneFrequency(digit) {
    const freqMap = {
      '1': 697, '2': 697, '3': 697,
      '4': 770, '5': 770, '6': 770,
      '7': 852, '8': 852, '9': 852,
      '*': 941, '0': 941, '#': 941,
    };
    return freqMap[digit] || 1000;
  }

  // ════════════════════════════════════════════
  // APPEL
  // ════════════════════════════════════════════

  async handleCallAction(event) {
    const btn = event.currentTarget;
    const action = btn.dataset.action;

    if (action === 'call' || btn.classList.contains('green')) {
      await this.startCall();
    } else if (action === 'end' || btn.classList.contains('red')) {
      await this.endCall();
    }
  }

  async startCall() {
    if (!this.state.currentNumber || this.state.currentNumber.length < 10) {
      this.showNotification('Numéro invalide', 'Entrez un numéro à 10 chiffres minimum', 'error');
      return;
    }

    if (this.state.isCallActive) {
      this.showNotification('Appel en cours', 'Un appel est déjà actif', 'warning');
      return;
    }

    try {
      this.showNotification('Connexion...', 'Établissement de l\'appel', 'info');

      const phoneNumber = this.normalizePhoneNumber(this.state.currentNumber);
      const response = await this.apiCall('/phone/smart-call', {
        to: phoneNumber,
        preferredNetwork: this.state.selectedNetwork,
        yorroId: this.config.yorroId,
      });

      if (response.success) {
        this.state.activeCall = {
          id: response.callId,
          to: phoneNumber,
          network: response.selectedNetwork,
          startTime: Date.now(),
          status: 'ringing',
        };

        this.state.isCallActive = true;
        this.callStartTime = Date.now();
        this.startCallTimer();
        this.showActiveCallScreen();
        this.addToCallHistory(phoneNumber, response.selectedNetwork, 'outgoing');

        this.showNotification('Appel en cours', `${phoneNumber} via ${response.selectedNetwork}`, 'success');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel:', error);
      this.showNotification('Erreur', error.message, 'error');
    }
  }

  async endCall() {
    if (!this.state.activeCall) return;

    try {
      await this.apiCall('/call/end', { callSid: this.state.activeCall.id });
      this.terminateCall();
      this.showNotification('Appel terminé', '', 'info');
    } catch (error) {
      console.error('Erreur lors de la terminaison:', error);
      this.terminateCall();
    }
  }

  terminateCall() {
    this.state.isCallActive = false;
    this.state.activeCall = null;
    clearInterval(this.timers.callDuration);
    this.state.callDuration = 0;
    this.hideActiveCallScreen();
    this.state.currentNumber = '';
    this.updateDialerDisplay();
  }

  startCallTimer() {
    clearInterval(this.timers.callDuration);
    this.timers.callDuration = setInterval(() => {
      if (this.state.isCallActive) {
        this.state.callDuration++;
        this.updateCallTimer();
      }
    }, 1000);
  }

  updateCallTimer() {
    const timer = document.querySelector('.call-timer');
    if (timer) {
      const hours = Math.floor(this.state.callDuration / 3600);
      const minutes = Math.floor((this.state.callDuration % 3600) / 60);
      const seconds = this.state.callDuration % 60;

      const timeStr = [hours, minutes, seconds]
        .map(v => String(v).padStart(2, '0'))
        .filter((v, i) => i === 0 || v !== '00')
        .join(':');

      timer.textContent = timeStr;
    }
  }

  showActiveCallScreen() {
    const screen = document.querySelector('.active-call-screen');
    if (screen) {
      const contactName = document.querySelector('.call-contact-name');
      if (contactName) {
        contactName.textContent = this.state.activeCall.to;
      }
      screen.classList.add('show');
    }
  }

  hideActiveCallScreen() {
    const screen = document.querySelector('.active-call-screen');
    if (screen) {
      screen.classList.remove('show');
    }
  }

  // ════════════════════════════════════════════
  // CONTRÔLES D'APPEL
  // ════════════════════════════════════════════

  async handleCallControl(event) {
    const btn = event.currentTarget;
    const control = btn.dataset.control;

    switch (control) {
      case 'mute':
        this.state.isMuted = !this.state.isMuted;
        btn.classList.toggle('muted', this.state.isMuted);
        btn.classList.toggle('active-ctrl', this.state.isMuted);
        this.muteAudio(this.state.isMuted);
        break;

      case 'speaker':
        btn.classList.toggle('active-ctrl');
        this.toggleSpeaker();
        break;

      case 'video':
        this.state.isVideoOn = !this.state.isVideoOn;
        btn.classList.toggle('active-ctrl', this.state.isVideoOn);
        this.toggleVideo(this.state.isVideoOn);
        break;

      case 'dialpad':
        document.querySelector('.dialer-wrap')?.classList.toggle('show');
        break;

      case 'contacts':
        document.querySelector('.call-contacts')?.classList.toggle('show');
        break;
    }
  }

  muteAudio(muted) {
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
      });
    }
    console.log(`🔇 Audio ${muted ? 'désactivé' : 'activé'}`);
  }

  toggleSpeaker() {
    console.log('📢 Haut-parleur basculé');
  }

  toggleVideo(enabled) {
    if (this.mediaStream) {
      this.mediaStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
    console.log(`📹 Vidéo ${enabled ? 'activée' : 'désactivée'}`);
  }

  // ════════════════════════════════════════════
  // HISTORIQUE & CONTACTS
  // ════════════════════════════════════════════

  addToCallHistory(number, network, type = 'outgoing', duration = 0) {
    const contact = this.state.contacts.find(c => c.phone === number);
    const historyItem = {
      id: Date.now(),
      number,
      name: contact?.name || 'Inconnu',
      network,
      type, // 'outgoing', 'incoming', 'missed'
      duration,
      timestamp: new Date(),
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    this.state.callHistory.unshift(historyItem);
    if (this.state.callHistory.length > 100) {
      this.state.callHistory.pop();
    }

    this.saveToStorage();
    this.renderCallHistory();
  }

  dialFromHistory(element) {
    const number = element.dataset.number;
    this.state.currentNumber = number;
    this.updateDialerDisplay();
    this.switchTab({ target: { dataset: { tab: 'dialer' } } });
  }

  dialContact(element) {
    const contactId = element.dataset.contactId;
    const contact = this.state.contacts.find(c => c.id === contactId);
    if (contact) {
      this.state.currentNumber = contact.phone;
      this.updateDialerDisplay();
      this.switchTab({ target: { dataset: { tab: 'dialer' } } });
    }
  }

  renderCallHistory() {
    const container = document.querySelector('.call-history');
    if (!container) return;

    if (this.state.callHistory.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-tertiary); padding: 20px;">Aucun appel</p>';
      return;
    }

    container.innerHTML = this.state.callHistory.map(item => `
      <div class="history-item" data-number="${item.number}" role="button" tabindex="0" aria-label="Appel à ${item.number}">
        <div class="history-icon ${item.type}" title="${item.type}">
          ${item.type === 'outgoing' ? '📤' : item.type === 'incoming' ? '📥' : '📞'}
        </div>
        <div class="history-info">
          <div class="history-name">${item.name}</div>
          <div class="history-meta">
            <span>${item.number}</span> • 
            <span>${item.network}</span> • 
            <span>${item.time}</span>
          </div>
        </div>
        <button class="recall-btn" aria-label="Rappeler">Rappeler</button>
      </div>
    `).join('');
  }

  renderContacts() {
    const container = document.querySelector('.call-contacts');
    if (!container) return;

    if (this.state.contacts.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-tertiary); padding: 20px;">Aucun contact</p>';
      return;
    }

    container.innerHTML = this.state.contacts
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(contact => `
        <div class="call-contact-item" data-contact-id="${contact.id}" role="button" tabindex="0">
          <div class="call-contact-avatar" style="background: linear-gradient(135deg, hsl(${Math.random() * 360}, 70%, 60%) 0%, hsl(${Math.random() * 360}, 70%, 60%) 100%)">
            ${contact.name.charAt(0).toUpperCase()}
          </div>
          <div class="call-contact-info">
            <div class="call-contact-name">${contact.name}</div>
            <div class="call-contact-num">${contact.phone}</div>
          </div>
          <div class="call-contact-type ${contact.type}">${contact.type}</div>
        </div>
      `).join('');
  }

  // ════════════════════════════════════════════
  // TABS
  // ════════════════════════════════════════════

  switchTab(event) {
    const tab = event.target.dataset.tab || event.target;
    const tabs = document.querySelectorAll('.phone-tab');
    const contents = document.querySelectorAll('[data-tab-content]');

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.style.display = 'none');

    event.target.classList.add('active');
    const content = document.querySelector(`[data-tab-content="${tab}"]`);
    if (content) content.style.display = 'flex';
  }

  // ════════════════════════════════════════════
  // RÉSEAU & SÉLECTION
  // ════════════════════════════════════════════

  selectNetwork(event) {
    const btn = event.currentTarget;
    const network = btn.dataset.network;
    this.state.selectedNetwork = network;

    document.querySelectorAll('[data-network]').forEach(b => {
      b.classList.remove('selected-net');
    });
    btn.classList.add('selected-net');

    this.saveToStorage();
  }

  async fetchNetworkStatus() {
    try {
      const response = await this.apiCall('/phone/networks');
      this.state.networkStatus = response.networks || {};
      this.updateNetworkIndicators();
    } catch (error) {
      console.warn('Erreur lors de la récupération du statut réseau:', error);
    }
  }

  updateNetworkIndicators() {
    Object.entries(this.state.networkStatus).forEach(([network, status]) => {
      const indicator = document.querySelector(`[data-network-status="${network}"]`);
      if (indicator) {
        indicator.className = status.configured ? 'online' : 'offline';
      }
    });
  }

  // ════════════════════════════════════════════
  // NOTIFICATIONS
  // ════════════════════════════════════════════

  setupNotifications() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  showNotification(title, message = '', type = 'info') {
    console.log(`[${type.toUpperCase()}] ${title}: ${message}`);

    // Toast UI
    const toast = document.createElement('div');
    toast.className = `notification notification-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="notification-icon">
        ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
      </div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        ${message ? `<div class="notification-message">${message}</div>` : ''}
      </div>
    `;

    document.body.appendChild(toast);
    toast.offsetHeight; // Trigger reflow
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);

    // Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/icon-192.png',
        tag: 'yorro-phone',
      });
    }
  }

  // ════════════════════════════════════════════
  // API CALLS
  // ════════════════════════════════════════════

  async apiCall(endpoint, body = {}) {
    try {
      const response = await fetch(`${this.config.backendUrl}/api${endpoint}`, {
        method: body ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-yorro-token': this.config.token,
          'x-yorro-id': this.config.yorroId,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'API Error');
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  normalizePhoneNumber(number) {
    let normalized = number.replace(/[\s\-().]/g, '');
    if (!normalized.startsWith('+')) {
      normalized = '+237' + normalized;
    }
    return normalized;
  }

  // ════════════════════════════════════════════
  // STORAGE
  // ════════════════════════════════════════════

  saveToStorage() {
    const data = {
      callHistory: this.state.callHistory,
      contacts: this.state.contacts,
      favorites: this.state.favorites,
      selectedNetwork: this.state.selectedNetwork,
    };
    localStorage.setItem('yorro-phone-state', JSON.stringify(data));
  }

  loadFromStorage() {
    try {
      const data = JSON.parse(localStorage.getItem('yorro-phone-state') || '{}');
      this.state.callHistory = data.callHistory || [];
      this.state.contacts = data.contacts || [];
      this.state.favorites = data.favorites || [];
      this.state.selectedNetwork = data.selectedNetwork || 'auto';
      this.renderCallHistory();
      this.renderContacts();
    } catch (error) {
      console.warn('Erreur lors du chargement du stockage:', error);
    }
  }

  // ════════════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ════════════════════════════════════════════

  handleKeyboardShortcuts(event) {
    if (!this.state.isCallActive && /^\d$/.test(event.key)) {
      this.addNumber(event.key);
      event.preventDefault();
    }

    switch (event.key) {
      case 'Backspace':
        if (!this.state.isCallActive) {
          this.deleteNumber();
          event.preventDefault();
        }
        break;
      case 'Enter':
        if (!this.state.isCallActive) {
          this.handleCallAction({ currentTarget: { classList: ['green'] } });
          event.preventDefault();
        }
        break;
      case 'Escape':
        if (this.state.isCallActive) {
          this.endCall();
          event.preventDefault();
        }
        break;
      case 'm':
      case 'M':
        if (this.state.isCallActive && event.ctrlKey) {
          this.state.isMuted = !this.state.isMuted;
          this.muteAudio(this.state.isMuted);
          event.preventDefault();
        }
        break;
    }
  }

  // ════════════════════════════════════════════
  // SERVICE WORKER
  // ════════════════════════════════════════════

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw-phone.js')
        .then(reg => console.log('✅ Service Worker enregistré'))
        .catch(err => console.warn('Service Worker non disponible:', err));
    }
  }

  // ════════════════════════════════════════════
  // PUBLIC API
  // ════════════════════════════════════════════

  addContact(name, phone, type = 'yorro') {
    const contact = {
      id: Date.now().toString(),
      name,
      phone: this.normalizePhoneNumber(phone),
      type,
    };
    this.state.contacts.push(contact);
    this.saveToStorage();
    this.renderContacts();
    return contact;
  }

  removeContact(contactId) {
    this.state.contacts = this.state.contacts.filter(c => c.id !== contactId);
    this.saveToStorage();
    this.renderContacts();
  }

  toggleFavorite(contactId) {
    const idx = this.state.favorites.indexOf(contactId);
    if (idx >= 0) {
      this.state.favorites.splice(idx, 1);
    } else {
      this.state.favorites.push(contactId);
    }
    this.saveToStorage();
    this.renderContacts();
  }

  getCallStats() {
    const now = Date.now();
    const today = new Date().toDateString();
    const todaysCalls = this.state.callHistory.filter(
      c => new Date(c.timestamp).toDateString() === today
    );

    const totalDuration = todaysCalls.reduce((sum, c) => sum + (c.duration || 0), 0);
    const incomingCount = todaysCalls.filter(c => c.type === 'incoming').length;
    const outgoingCount = todaysCalls.filter(c => c.type === 'outgoing').length;
    const missedCount = todaysCalls.filter(c => c.type === 'missed').length;

    return {
      totalCalls: todaysCalls.length,
      incomingCount,
      outgoingCount,
      missedCount,
      totalDuration: Math.round(totalDuration / 60), // en minutes
    };
  }

  exportCallHistory(format = 'json') {
    const data = {
      exportDate: new Date().toISOString(),
      calls: this.state.callHistory,
      stats: this.getCallStats(),
    };

    if (format === 'csv') {
      return this.convertToCSV(data.calls);
    }

    return JSON.stringify(data, null, 2);
  }

  convertToCSV(calls) {
    const headers = ['Numéro', 'Nom', 'Type', 'Réseau', 'Date', 'Heure', 'Durée'];
    const rows = calls.map(c => [
      c.number,
      c.name,
      c.type,
      c.network,
      c.date,
      c.time,
      `${c.duration}s`,
    ]);

    return [
      headers.join(','),
      ...rows.map(r => r.join(',')),
    ].join('\n');
  }
}

// ════════════════════════════════════════════════════════════
// INITIALISATION GLOBALE
// ════════════════════════════════════════════════════════════

window.YorroPhone = null;

function initYorroPhoneModule(config = {}) {
  window.YorroPhone = new YorroPhoneModule({
    backendUrl: config.backendUrl || 'http://localhost:3001',
    frontendUrl: config.frontendUrl || window.location.origin,
    yorroId: config.yorroId || localStorage.getItem('yorroId'),
    token: config.token || localStorage.getItem('yorro-token'),
    ...config,
  });
  return window.YorroPhone;
}

// Initialisation au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initYorroPhoneModule();
  });
} else {
  initYorroPhoneModule();
}

export { YorroPhoneModule, initYorroPhoneModule };
