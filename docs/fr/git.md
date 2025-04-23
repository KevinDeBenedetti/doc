<!-- Translated on 23/04/2025 -->

```
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

### List remote repositories
```bash
git remote -v
```

### Retrieve changes without merging
```bash
git fetch
```

## History

### View history of commits
```bash
git log
```

### See the differences between files
```bash
git diff
```

### Cancel a modified file (before commit)
```bash
git restore file.txt
```

## Useful commands

### Stash (save temporarily)
```bash
git stash
```

### Apply a stash
```bash
git stash pop
```

### Delete a file from the trace
```bash
git rm file.txt
```

### Rename / Move a file
```bash
git mv old-name new-name
```

### Create a tag
```bash
git tag v1.0.0
```

### Reminder
```bash
git help [commande]
```

## `Pull Request`

### Create PR
```bash
gh pr create --title "New fonctionnality" --body "Detailed description" --base <branch>
```
- `title`: title of the PR.
- `--body`: modifications description.
- `--base`: the vised branch.

You can also use this command, to launch the interactiv assistant without arguments.
```bash
gh pr create
```

### List opened PR
```bash
gh pr list
```

### Approuve a PR
```bash
gh pr review <PR_NUMBER> --approuve
```
- `title`: title of the PR.
- `--body`: modifications description.
- `--base`: the vised branch.

You can also use this command, to launch the interactiv assistant without arguments.
```bash
gh pr create
```
