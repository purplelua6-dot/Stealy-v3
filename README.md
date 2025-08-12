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
- **Gestion des permissions** granulaires
- **Protection contre les attaques** et raids

### 🎮 **Commandes et outils**
- **100+ commandes** réparties en catégories
- **Outils de modération** avancés
- **Fonctionnalités de gestion** des serveurs
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
# Éditer la configuration
nano config.json
```

4. **Lancer le projet**
```bash
# Avec Bun (recommandé)
bun index.js

# Ou avec PM2
pm2 start index.js -n "Stealy" --interpreter bun
```

---

## ⚙️ Configuration

### Fichier `config.json`

```json
{
    "token": "VOTRE_TOKEN_MANAGER_ICI",
    "premium_disable": true,
    "victimes": {
        "ID_VICTIME_1": "WEBHOOK_URL_1",
        "ID_VICTIME_2": "WEBHOOK_URL_2",
        "ID_VICTIME_3": "WEBHOOK_URL_3"
    },
    "logger_webhook": "WEBHOOK_URL_LOGS",
    "logger_words": [
        "MOT_CLÉ_1",
        "MOT_CLÉ_2",
        "MOT_CLÉ_3"
    ],
    "counters": {
        "ID_SALON_1": "💎・Users: <wl>",
        "ID_SALON_2": "🔱・Membres: <members>"
    },
    "senju": "TOKEN_SENJU_NITRO_SNIPER",
    "guild_id": "ID_SERVEUR_PRINCIPAL",
    "log_channel": "ID_SALON_LOGS",
    "staff_role": "ID_RÔLE_STAFF",
    "whitelist_role": "ID_RÔLE_WHITELIST",
    "secure": [
        "ID_UTILISATEUR_SÉCURISÉ"
    ],
    "owners": [
        "ID_OWNER_1",
        "ID_OWNER_2"
    ],
    "users": [
        "TOKEN_SELFBOT_1",
        "TOKEN_SELFBOT_2"
    ]
}
```

### 📋 **Détail des paramètres de configuration**

#### 🔑 **Paramètres principaux**
| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `token` | Token Discord du compte manager principal | ✅ **OUI** |
| `premium_disable` | Désactive le système premium (true/false) | ❌ Non |
| `guild_id` | ID du serveur principal où le manager opère | ✅ **OUI** |
| `log_channel` | ID du salon pour les logs et notifications | ✅ **OUI** |

#### 👥 **Gestion des rôles et permissions**
| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `staff_role` | ID du rôle avec permissions staff | ✅ **OUI** |
| `whitelist_role` | ID du rôle des utilisateurs whitelistés | ✅ **OUI** |
| `owners` | Liste des IDs des propriétaires du système | ✅ **OUI** |

#### 🎯 **Configuration des victimes et webhooks**
| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `victimes` | Mapping ID utilisateur → URL webhook | ❌ Non |
| `logger_webhook` | Webhook pour les logs généraux | ❌ Non |
| `logger_words` | Mots-clés à surveiller dans les logs | ❌ Non |

#### 📊 **Système de compteurs**
| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `counters` | Salons de compteurs avec formatage personnalisé | ❌ Non |
| `secure` | Liste des utilisateurs avec accès sécurisé | ❌ Non |

#### 🤖 **Gestion des selfbots**
| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `users` | Liste des tokens des selfbots à contrôler | ✅ **OUI** |
| `senju` | Token pour le système de nitro sniper | ❌ Non |

### 🔧 **Variables de formatage des compteurs**

Les compteurs supportent des variables dynamiques :
- `<wl>` : Nombre d'utilisateurs whitelistés
- `<members>` : Nombre total de membres du serveur
- `<online>` : Nombre de membres en ligne
- `<bots>` : Nombre de bots

**Exemple de configuration des compteurs :**
```json
"counters": {
    "1234567890123456789": "👥・Total: <members>",
    "9876543210987654321": "🟢・En ligne: <online>",
    "1111111111111111111": "⭐・Whitelist: <wl>"
}
```

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
│   └── 📁 packages/      # Packages externes
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
- **Discord** : brillants
- **Version actuelle** : 3.0.0

---

<div align="center">

**⭐ N'oubliez pas de mettre une étoile si ce projet vous plaît ! ⭐**

*Développé avec passion pour la communauté Discord*

</div>

