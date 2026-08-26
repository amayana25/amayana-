# 📱 YORRO Phone UI Enhanced — Guide d'Intégration Complet

## 🎯 Vue d'ensemble

Ce guide explique comment intégrer le système téléphonique amélioré YORRO dans votre application.

### Fichiers améliorés

```
📦 Frontend (amayana-)
├── call-ui-enhanced.css       ✨ Design system moderne + Glassmorphism
├── call-module-enhanced.js    ✨ Module complet avec gestion d'appels
└── PHONE_INTEGRATION.md       📖 Ce guide

📦 Backend (yorro-backend-deploy)
├── phone-engine-enhanced.js   ✨ Moteur multi-réseaux v2.0
├── server.js                  ⚙️ Intégration serveur
└── README.md                  📖 Configuration
```

---

## 🚀 Installation Rapide

### 1. Backend — Déploiement

#### Étape 1 : Configurer les variables d'environnement

```bash
# .env
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

TELNYX_API_KEY=your_telnyx_key
TELNYX_CONNECTION_ID=your_connection_id
TELNYX_FROM_NUMBER=+1234567890

AT_USERNAME=your_at_username
AT_API_KEY=your_at_api_key
AT_PHONE_NUMBER=+1234567890

VONAGE_API_KEY=your_vonage_key
VONAGE_API_SECRET=your_vonage_secret
VONAGE_PHONE_NUMBER=+1234567890

LIVEKIT_API_KEY=your_livekit_key
LIVEKIT_API_SECRET=your_livekit_secret
LIVEKIT_URL=https://your-livekit-server.com

BACKEND_URL=https://your-backend.com
FRONTEND_URL=https://your-frontend.com
ADMIN_KEY=your_secure_admin_key
SECRET_KEY=your_session_secret

# Base de données
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Ports
PORT=3001
```

#### Étape 2 : Déployer le backend

```bash
cd yorro-backend-deploy

# Installer les dépendances
npm install

# Tester localement
npm start

# Déployer sur Render/Railway
git push origin feature/phone-system-enhanced
```

#### Étape 3 : Mettre à jour server.js

```javascript
// server.js
const { router: phoneRouter, initPhoneEngine } = require('./phone-engine-enhanced');

// ... resto du code ...

// Initialiser le moteur téléphonique
app.use('/api/phone', phoneRouter);
initPhoneEngine();
```

---

### 2. Frontend — Intégration UI

#### Étape 1 : Importer les fichiers

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="fr">
<head>
  <!-- ... autres styles ... -->
  <link rel="stylesheet" href="call-ui-enhanced.css">
</head>
<body>
  <!-- ... votre HTML ... -->
  
  <!-- Module téléphonique -->
  <div id="phone-module">
    <!-- sera généré par le JS -->
  </div>

  <script src="call-module-enhanced.js"></script>
  <script>
    // Initialiser le module
    window.YorroPhone = initYorroPhoneModule({
      backendUrl: 'https://your-backend.com',
      frontendUrl: window.location.origin,
      yorroId: 'user-123',
      token: 'your-auth-token',
    });
  </script>
</body>
</html>
```

#### Étape 2 : HTML du module téléphonique

```html
<!-- Insérer dans votre HTML -->
<div class="phone-view">
  <!-- HEADER -->
  <div class="phone-header">
    <h1 class="phone-header-title">
      <span class="phone-header-icon">📞</span>
      YORRO Téléphonie
    </h1>
    <p class="phone-header-sub">Appels multi-réseaux optimisés</p>
  </div>

  <!-- TABS -->
  <div class="phone-tabs">
    <button class="phone-tab active" data-tab="dialer">Clavier</button>
    <button class="phone-tab" data-tab="contacts">Contacts</button>
    <button class="phone-tab" data-tab="history">Historique</button>
  </div>

  <!-- DIALER -->
  <div data-tab-content="dialer" style="display: flex;">
    <div class="dialer-wrap">
      <div class="dialer-header">
        <div class="dialer-header-icon">☎️</div>
        <div>
          <div class="dialer-header-title">Numérotation</div>
          <div class="dialer-header-sub">Appel direct ou via réseau</div>
        </div>
        <div class="dialer-mode-toggle">
          <button class="dialer-mode-btn active" data-network-select>Auto</button>
          <button class="dialer-mode-btn" data-network-select>Manuel</button>
        </div>
      </div>

      <div class="dialer-screen">
        <div class="dialer-number">+</div>
        <div class="dialer-country">Cameroun (CM)</div>
        <div class="dialer-contact-match"></div>
        <button class="dialer-del" aria-label="Supprimer">⌫</button>
      </div>

      <div class="dialer-pad">
        <button class="dial-key" data-digit="1">
          <span class="dial-key-digit">1</span>
          <span class="dial-key-letters">.</span>
        </button>
        <button class="dial-key" data-digit="2">
          <span class="dial-key-digit">2</span>
          <span class="dial-key-letters">ABC</span>
        </button>
        <button class="dial-key" data-digit="3">
          <span class="dial-key-digit">3</span>
          <span class="dial-key-letters">DEF</span>
        </button>
        <!-- 4-9 similaires -->
        <button class="dial-key" data-digit="*">
          <span class="dial-key-digit">*</span>
        </button>
        <button class="dial-key" data-digit="0">
          <span class="dial-key-digit">0</span>
          <span class="dial-key-letters">+</span>
        </button>
        <button class="dial-key" data-digit="#">
          <span class="dial-key-digit">#</span>
        </button>
      </div>

      <div class="call-actions">
        <button class="call-btn green" data-action="call" aria-label="Appeler">📞</button>
        <button class="call-btn red" data-action="end" aria-label="Raccrocher">📵</button>
      </div>
    </div>
  </div>

  <!-- CONTACTS -->
  <div data-tab-content="contacts" style="display: none;">
    <div class="call-contacts">
      <!-- Générés par JS -->
    </div>
  </div>

  <!-- HISTORIQUE -->
  <div data-tab-content="history" style="display: none;">
    <div class="call-history">
      <!-- Générés par JS -->
    </div>
  </div>

  <!-- APPEL ACTIF (Plein écran) -->
  <div class="active-call-screen">
    <div class="call-avatar">👤</div>
    <div class="call-contact-name">+237 6XX XXX XXX</div>
    <div class="call-status">En cours...</div>
    <div class="call-timer">00:00</div>
    <div class="call-type-badge twilio">Twilio</div>

    <div class="call-controls-grid">
      <div class="call-ctrl">
        <button class="call-ctrl-btn" data-control="mute" aria-label="Couper le son">🔊</button>
        <div class="call-ctrl-label">Sourdine</div>
      </div>
      <div class="call-ctrl">
        <button class="call-ctrl-btn" data-control="speaker" aria-label="Haut-parleur">📢</button>
        <div class="call-ctrl-label">Haut-parleur</div>
      </div>
      <div class="call-ctrl">
        <button class="call-ctrl-btn" data-control="video" aria-label="Vidéo">📹</button>
        <div class="call-ctrl-label">Vidéo</div>
      </div>
    </div>

    <button class="call-end-btn" aria-label="Raccrocher">📵</button>
  </div>
</div>
```

---

## 🔧 Configuration Avancée

### 1. Ajouter des contacts programmatiquement

```javascript
// Ajouter un contact
window.YorroPhone.addContact(
  'Patrick Emessiene',
  '+237691234567',
  'yorro'  // ou 'ext'
);

// Ajouter plusieurs contacts
const contacts = [
  { name: 'Support', phone: '+237690000001', type: 'ext' },
  { name: 'Commercial', phone: '+237690000002', type: 'ext' },
];

contacts.forEach(c => {
  window.YorroPhone.addContact(c.name, c.phone, c.type);
});
```

### 2. Écouter les événements d'appel

```javascript
// Observer les changements d'état
const phone = window.YorroPhone;

// Personnalisé - ajouter des events
class PhoneObserver {
  onCallStart(callData) {
    console.log('Appel démarré:', callData);
    // Mettre à jour votre UI
  }

  onCallEnd(callData) {
    console.log('Appel terminé:', callData);
  }

  onNetworkChange(network) {
    console.log('Réseau changé:', network);
  }
}

// Utiliser l'observateur
const observer = new PhoneObserver();
```

### 3. Intégration avec une base de contacts

```javascript
async function loadContactsFromAPI() {
  const response = await fetch('/api/contacts');
  const contacts = await response.json();

  contacts.forEach(contact => {
    window.YorroPhone.addContact(
      contact.name,
      contact.phone,
      contact.type
    );
  });
}

// Charger à l'initialisation
loadContactsFromAPI();
```

---

## 📊 API Reference

### Module YorroPhoneModule

#### Méthodes publiques

```javascript
// Gestion d'appels
await startCall()                    // Démarrer un appel
await endCall()                      // Terminer l'appel actif
muteAudio(muted: boolean)           // Couper le son
toggleSpeaker()                     // Basculer le haut-parleur
toggleVideo(enabled: boolean)       // Activer/désactiver la vidéo

// Contacts
addContact(name, phone, type)       // Ajouter un contact
removeContact(contactId)            // Supprimer un contact
toggleFavorite(contactId)           // Marquer comme favori

// Historique
addToCallHistory(...)               // Ajouter un appel à l'historique
getCallStats()                      // Obtenir les stats du jour

// Export
exportCallHistory(format)           // Exporter l'historique (json/csv)

// Réseau
selectNetwork(network)              // Sélectionner le réseau d'appel
fetchNetworkStatus()                // Récupérer le statut des réseaux

// Utility
normalizePhoneNumber(number)        // Formater un numéro
formatPhoneNumber(number)           // Afficher un numéro formaté
```

#### State public

```javascript
window.YorroPhone.state = {
  currentNumber: string,            // Numéro en cours de composition
  activeCall: object|null,          // Appel actif
  callHistory: array,               // Historique d'appels
  contacts: array,                  // Liste des contacts
  favorites: array,                 // IDs des favoris
  callDuration: number,             // Durée de l'appel actif (sec)
  isCallActive: boolean,            // Un appel est en cours
  isMuted: boolean,                 // L'audio est coupé
  isVideoOn: boolean,               // La vidéo est active
  selectedNetwork: string,          // Réseau sélectionné
  networkStatus: object,            // Statut des réseaux
};
```

---

## 🎨 Personnalisation des couleurs

### Variables CSS

```css
:root {
  /* Couleurs principales */
  --color-primary: #7c6dfa;         /* Violet */
  --color-success: #10b981;         /* Vert */
  --color-warning: #f59e0b;         /* Orange */
  --color-danger: #ef4444;          /* Rouge */
  --color-info: #06b6d4;            /* Cyan */

  /* Fonds */
  --bg-0: #ffffff;
  --bg-1: #f9fafb;
  --bg-2: #f3f4f6;

  /* Texte */
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-0: #0f172a;
    --bg-1: #1e293b;
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
  }
}
```

Personnalisez en surchargeant les variables :

```css
/* custom-phone-theme.css */
:root {
  --color-primary: #your-color;
  --color-success: #your-color;
  /* etc */
}
```

---

## 🚀 Déploiement Vercel

### 1. Configuration vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "public",
  "env": {
    "REACT_APP_BACKEND_URL": "@react_app_backend_url",
    "REACT_APP_FRONTEND_URL": "@react_app_frontend_url"
  },
  "redirects": [
    {
      "source": "/api/:path*",
      "destination": "$REACT_APP_BACKEND_URL/api/:path*"
    }
  ]
}
```

### 2. GitHub Actions (CI/CD)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches:
      - feature/phone-ui-enhanced
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm i -g vercel

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Déployé sur Vercel!'
            })
```

---

## 📱 Tests

### Test localement

```bash
# Frontend
npm start

# Backend
npm run dev

# Test des appels
curl -X POST http://localhost:3001/api/phone/smart-call \
  -H "Content-Type: application/json" \
  -H "x-yorro-id: test-user" \
  -H "x-yorro-token: test-token" \
  -d '{
    "to": "+237691234567",
    "preferredNetwork": "auto",
    "yorroId": "test-user"
  }'
```

### Tests unitaires

```bash
# Backend
npm run test

# Frontend
npm run test:unit
```

---

## ⚠️ Points importants

### Sécurité
- ✅ Les clés API ne doivent PAS être en frontend
- ✅ Utiliser des tokens JWT pour l'authentification
- ✅ Valider tous les numéros de téléphone côté serveur
- ✅ Implémenter le rate limiting
- ✅ CORS configuré correctement

### Performance
- ✅ Cacher les tokens (TokenCache)
- ✅ Lazy load les contacts/historique
- ✅ Compresser les réponses gzip
- ✅ Service Worker pour offline mode

### Accessibilité
- ✅ ARIA labels sur tous les boutons
- ✅ Contraste suffisant des couleurs
- ✅ Clavier navigable complet
- ✅ Support du mode réduction de mouvement

---

## 🐛 Troubleshooting

### Problème: Appels qui ne se connectent pas

**Solution:**
1. Vérifier les credentials API
2. Vérifier les URLs callback
3. Activer le logging debug
4. Vérifier le circuit breaker status

```javascript
// Vérifier le statut
fetch('http://localhost:3001/api/phone/networks')
  .then(r => r.json())
  .then(data => console.log(data));
```

### Problème: Les contacts ne se sauvegardent pas

**Solution:**
1. Vérifier que localStorage n'est pas désactivé
2. Vérifier les permissions de stockage
3. Nettoyer le cache du navigateur

```javascript
// Vérifier le localStorage
console.log(localStorage.getItem('yorro-phone-state'));
```

### Problème: Interface non responsive

**Solution:**
1. Vérifier que le CSS est bien chargé
2. Vérifier la métabalise viewport
3. Tester en mode responsive du navigateur

---

## 📚 Ressources

- [Twilio Docs](https://www.twilio.com/docs)
- [Telnyx Docs](https://telnyx.com/docs)
- [Vonage Docs](https://developer.vonage.com/en/api)
- [WebRTC Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

---

## ✅ Checklist Déploiement

- [ ] Cloner les branches feature
- [ ] Configurer les variables d'environnement
- [ ] Tester localement
- [ ] Vérifier les permissions CORS
- [ ] Déployer le backend
- [ ] Déployer le frontend sur Vercel
- [ ] Tester les appels en prod
- [ ] Configurer le monitoring
- [ ] Documenter pour l'équipe

---

**Version:** 2.0.0  
**Dernière mise à jour:** 2026-08-26  
**Auteur:** Patrick Emessiene Amayna  
**Support:** support@yorro.games
