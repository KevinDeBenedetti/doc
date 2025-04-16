<!-- Translated on 16/04/2025 -->

# Commandes de base

## Configuration initiale

### Définir un nom

```bash
git config --global user.name "Your name"
```

### Définir une adresse e-mail

```bash
git config user.email "your@email.com"
```

***Cette configuration est nécessaire pour les commits.***

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

### Afficher l'état des fichiers modifiés
```bash
git status
```

### Ajouter un fichier à suivre
```bash
git add file.txt
```

### Ajouter tous les fichiers mis à jour
```bash
git add .
```

### Ajouter des modifications
```bash
git commit -m "Description message"
```

### Pousser vers un dépôt distant
```bash
git push origin main
```

### Récupérer les mises à jour
```bash
git pull
```

## Branches

### Afficher la branche courante
```bash
git branch
```

### Lister toutes les branches
```bash
git branch -a
```

### Créer une nouvelle branche
```bash
git branch new-branch
```

### Basculer entre les branches
```bash
git checkout branch-name
```

### Créer et basculer vers une branche
```bash
git checkout -b branch-name
```

### Fusionner une branche
```bash
git merge branch-name
```

## Collaboration

### Ajouter un nouveau dépôt distant
```bash
git remote add origin https://github.com/user/repo.git
```

### Lister les dépôts distants
```bash
git remote -v
```

### Récupérer les modifications sans fusionner
```bash
git fetch
```

## Historique

### Afficher l'historique des commits
```bash
git log
```

### Voir les différences entre les fichiers
```bash
git diff
```

### Annuler une modification d'un fichier (avant commit)
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

### Créer une étiquette
```bash
git tag v1.0.0
```

### Rappel
```bash
git help [commande]
```

## `Pull Request`

### Créer une PR
```bash
gh pr create --title "New fonctionnality" --body "Detailed description" --base <branch>
```
- `title`: titre de la PR.
- `--body`: description des modifications.
- `--base`: la branche visée.

Vous pouvez également utiliser cette commande, pour lancer l'assistant interactif sans arguments.
```bash
gh pr create
```

### Lister les PR ouvertes

```bash
gh pr list
```

### Approuver une PR

```bash
gh pr review <PR_NUMBER> --approuve
```
