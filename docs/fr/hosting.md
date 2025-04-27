---
translated: true
translatedDate: 27/04/2025
verified: true
---

# Hébergement

::: details Table des matières
[[toc]]
:::

## SSH

### Connexion
```sh
ssh <username>@<ip_vps>
```

### Connexion avec clé
```sh
ssh -i ~/.ssh/<key_name>.pub <username>@<ip_vps>
```

### Alias

#### Créer un alias
Dans le fichier `~/.ssh/config`, créer un alias avec la clé privée.
```sh
Host <alias_name>
  Hostname <ip_vps>
  User <username>
  IdentityFile ~/.ssh/<key_name>
  IdentitiesOnly yes
```

#### Connexion avec alias
```sh
ssh <alias_name>
```

### Configurer une clé SSH

1. Copier la clé publique sur le serveur distant
2. Configurer automatiquement les droits
3. Ajouter la clé dans le fichier `authorized_keys` sur le serveur distant

```sh
ssh-copy-id -i ~/.ssh/<key_name>.pub <username>@<ip_vps>
```

### Copie

#### Copier un fichier avec SSH
```sh
scp -r <file_name> <username>@<ip_vps>:~/
```

#### Copier un fichier avec SSH, sur un port personnalisé
```sh
scp -r -P <port> <file_name> <username>@<ip_vps>:~/
```

### Suppression
```sh
ssh-keygen -R <ip_vps>
```

### Connexion à un serveur distant

1. Créer une clé SSH
Créer une paire de clés SSH sur local.
```sh
ssh-keygen -t rsa -b 4096 -C "email@email.email" -f ~/.ssh/<key_name>
```

2. Ajouter la clé publique SSH sur le serveur distant
Copier la clé avec cette commande.
```sh
pbcopy < ~/.ssh/<key_name>.pub
```

3. Connexion au VPS
```sh
ssh -i ~/.ssh/<key_name> root@<ip_vps>
```

### Autoriser une clé dans le fichier `authorised_keys`
```sh
echo "<public_keys>" >> ~/.ssh/authorised_keys
```

## Pare-feu

Le pare-feu est un système de sécurité qui filtre les connexions entrantes et sortantes.

- Trafic entrant : Autoriser uniquement les ports requis.
- Trafic sortant : Généralement, autoriser tout, sauf les besoins spécifiques.

### Règles nécessaires

| Protocole | PORT |
|:--------:|:----:|
| SSH      | 22   |
| HTTP     | 80   |
| HTTPS    | 443  |
| DNS      | 53   |
| SMTP     | 25   |
| IMAP     | 143  |
| POP3     | 110  |
| FTP      | 21   |

### Trafic entrant

| Protocole | Source IP | Source Port | Destination IP | Destination Port | Action |
|:--------:|:---------:|:-----------:|:--------------:|:----------------:|:------:|
| TCP      | 0.0.0.0/0 | Any         | VPS IP        | 22 / SSH       | ACCEPT |
| TCP      | 0.0.0.0/0 | Any         | VPS IP        | Any            | ACCEPT |

### Trafic sortant

| Protocole | Source IP | Source Port | Destination IP | Destination Port | Action |
|:--------:|:---------:|:-----------:|:--------------:|:----------------:|:------:|
| All      | VPS IP    | Any         | 0.0.0.0/0      | Any     | ACCEPT |


## Dokploy

### Notifications

#### Telegram

  1. Nom : Entrez un nom pour le bot.
  2. Token du bot : Entrez le token du bot. Disponible sur l'application Telegram à @BotFather. Entrez le bot.
  3. ID du chat : Entrez l'ID du chat. Pour récupérer l'ID du channel, aller sur https://api.telegram.org/bot<BOT_TOKEN>/getUpdates

::: tip Ressources
[GitHub](https://gist.github.com/nafiesl/4ad622f344cd1dc3bb1ecbe468ff9f8a)

[Documentation](https://docs.dokploy.com/docs/core/telegram)
:::
