# Commandes de base

## Configuration initiale

### Définir un nom

```bash
git config --global user.name "Your name"
```

### Définir un email

```bash
git config user.email "your@email.com"
```

***Cette configuration est obligatoire pour les commits.***

## Démarrer un projet

### Initialiser un dépôt dans le dossier courant
```bash
git init
```

### Cloner un dépôt existant
```bash
git clone https://github.com/user/repo.git
```

## Workflow

### Voir l'état des fichiers modifiés
```bash
git status
```

### Ajouter un fichier au suivi
```bash
git add file.txt
```

### Ajouter tous les fichiers modifiés
```bash
git add .
```

### Ajouter des changements
```bash
git commit -m "Description message"
```

### Pousser vers le dépôt distant
```bash
git push origin main
```

### Récupère les mises à jour
```bash
git pull
```

## Branches

### Afficher la branche actuelle
```bash
git branch
```

### Lister les branches
```bash
git branch -a
```

### Créer une nouvelle branche
```bash
git branch new-branch
```

### Changer de branche
```bash
git checkout branch-name
```

### Créer et Switcher sur une branche
```bash
git checkout -b branch-name
```

### Fusionner une branche
```bash
git merge branch-name
```

## Collaboration

### Ajouter un dépôt distant
```bash
git remote add origin https://github.com/user/repo.git
```

### Lister les dépôts distants
```bash
git remote -v
```

### Récupère les changements sans fusion
```bash
git fetch
```

## Historique

### Afficher l'historique des commits
```bash
git log
```

### Voir les différences entre fichiers
```bash
git diff
```

### Annuler un fichier modifié (avant commit)
```bash
git restore file.txt
```

## Commandes utiles

### Stash (sauvegarder temporairement)
```bash
git stash
```

### Appliquer un stash
```bash
git stash pop
```

### Supprimer un fichier du suivi
```bash
git rm file.txt
```

### Renommer / Déplacer un fichier
```bash
git mv old-name new-name
```

### Créer un tag
```bash
git tag v1.0.0
```

### Reminder
```bash
git help [commande]
```