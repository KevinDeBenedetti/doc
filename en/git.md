# Basic commands

## Initial configuration

### Define a name

```bash
git config --global user.name "Your name"
```

### Define an email

```bash
git config user.email "your@email.com"
```

***This config is necessary for commits.***

## Start a project

### Init a repository in the current folder
```bash
git init
```

### Clone an existing repository
```bash
git clone https://github.com/user/repo.git
```

## Workflow

### View the status of modified files
```bash
git status
```

### Add a file to track
```bash
git add file.txt
```

### Add all updated files
```bash
git add .
```

### Add changes
```bash
git commit -m "Description message"
```

### Push to remote repository
```bash
git push origin main
```

### Retrieve the updates
```bash
git pull
```

## Branches

### Show the current branch
```bash
git branch
```

### List all branches
```bash
git branch -a
```

### Create a new branch
```bash
git branch new-branch
```

### Switch branches
```bash
git checkout branch-name
```

### Create and Switch on a branch
```bash
git checkout -b branch-name
```

### Merge a branch
```bash
git merge branch-name
```

## Collaboration

### Add a new remote repository
```bash
git remote add origin https://github.com/user/repo.git
```

