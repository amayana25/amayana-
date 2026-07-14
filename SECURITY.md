# Politique de Sécurité

## Versions Prises en Charge

| Version | Statut | Fin du Support |
|---------|--------|-----------------|
| 1.0.x   | ✅ Supportée | Décembre 2026 |
| 0.x     | ⚠️ Ancien | Juillet 2026 |

**Note:** Seule la version actuelle reçoit les mises à jour de sécurité critiques. Nous recommandons de mettre à jour vers la dernière version dès que possible.

## Signalement des Vulnérabilités

Nous prenons la sécurité de YORRO GAMES ARCHITECTE très au sérieux. Si vous découvrez une vulnérabilité, **veuillez NE PAS** la publier publiquement.

### 📧 Comment Signaler une Vulnérabilité

1. **Ne créez pas d'issue publique** - les vulnérabilités publiques peuvent être exploitées avant correction
2. **Envoyez un rapport privé** via:
   - Email: security@yourcompany.com
   - GitHub Security Advisory: Utilisez la fonction "Report a vulnerability" dans le dépôt
   - Autre contact: https://github.com/amayana25

### 📝 Informations à Inclure

Veuillez inclure dans votre rapport:

- **Description détaillée** de la vulnérabilité
- **Étapes pour reproduire** le problème
- **Impact potentiel** (gravité: Critique, Haute, Moyenne, Basse)
- **Proof of Concept (POC)** ou code d'exemple (si applicable)
- **Système d'exploitation et navigateur** affectés
- **Vos coordonnées** pour le suivi (nom, email)

### ⏱️ Délai de Réponse

- **Accusé de réception:** Dans les 24-48 heures
- **Première évaluation:** Dans les 7 jours
- **Correction et patch:** Varie selon la gravité

## Processus de Correction

1. Nous confirmons la réception de votre rapport
2. Nous évaluons la gravité et l'impact
3. Nous développons et testons un correctif
4. Nous publions une version corrigée
5. Nous vous créditions dans les notes de version (si vous le souhaitez)

## Bonnes Pratiques de Sécurité

### Pour les Utilisateurs

- ✅ Gardez votre version à jour
- ✅ Utilisez HTTPS pour toutes les connexions
- ✅ Activez l'authentification à deux facteurs (2FA)
- ✅ Ne partagez jamais vos credentials
- ❌ N'utilisez pas votre vrai mot de passe sur plusieurs services

### Pour les Développeurs

- ✅ Validez toutes les entrées utilisateur
- ✅ Utilisez des variables d'environnement pour les secrets
- ✅ Effectuez des tests de sécurité réguliers
- ✅ Maintenez vos dépendances à jour
- ❌ Ne commitez jamais d'API keys ou tokens

## Dépendances et Mises à Jour

Nous effectuons des audits de sécurité réguliers de nos dépendances:

```bash
# Audit de sécurité
npm audit

# Mise à jour des dépendances
npm update
```

## Divulgation Responsable

Nous suivons les principes de **divulgation responsable**:

- ✅ Nous travaillons avec les chercheurs en sécurité
- ✅ Nous accordons un délai raisonnable pour les correctifs avant la publication
- ✅ Nous créditions les chercheurs (sauf demande contraire)
- ✅ Nous publions les détails après correction

## Conformité et Standards

Ce projet aspire à se conformer à:

- OWASP Top 10
- CWE (Common Weakness Enumeration)
- Standards de sécurité web modernes

## Revue et Mise à Jour

Cette politique de sécurité est révisée régulièrement pour s'adapter aux menaces émergentes.

**Dernière mise à jour:** Juillet 2026

---

**Merci de contribuer à la sécurité de YORRO GAMES ARCHITECTE!** 🔒

Pour toute question, contactez-nous via: security@yourcompany.com
