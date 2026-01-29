# Git & GitHub 101 Guide
## Keeping Your Project Synchronized

**Created for:** CrazySnakeLite Project
**Date:** 2026-01-29
**Author:** Charlie (Senior Dev)

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Daily Workflow](#daily-workflow)
3. [Understanding Git Basics](#understanding-git-basics)
4. [Common Tasks](#common-tasks)
5. [GitHub Pages Updates](#github-pages-updates)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## Quick Reference

### Most Common Commands (Copy-Paste Ready)

```bash
# See what changed
git status

# Save your changes locally
git add .
git commit -m "Description of what you changed"

# Send changes to GitHub
git push

# Get latest changes from GitHub
git pull

# See your change history
git log --oneline -10
```

---

## Daily Workflow

### Scenario 1: You Made Changes, Want to Save to GitHub

**What you did:** Fixed a bug, added a feature, changed some files

**Steps:**

```bash
# 1. Navigate to your project folder
cd /Users/anthonysalvi/code/CrazySnakeLite

# 2. Check what changed
git status
# (This shows which files you modified in RED)

# 3. Add all changes to staging
git add .
# (This prepares your changes to be committed)

# 4. Commit with a descriptive message
git commit -m "Fix audio bug in Story 4.5

- Replaced HTML5 Audio with Web Audio API
- Fixed sync and freezing issues
- Added volume control"

# 5. Push to GitHub
git push
# (This uploads your changes to GitHub)
```

**Result:** Your changes are now on GitHub and will deploy to GitHub Pages automatically (1-2 minutes)

---

### Scenario 2: Starting Your Work Day

**What you want:** Make sure you have the latest code

**Steps:**

```bash
# 1. Navigate to your project
cd /Users/anthonysalvi/code/CrazySnakeLite

# 2. Get latest changes from GitHub
git pull

# 3. Start working!
```

**When to do this:** Always pull before starting new work, especially if working from multiple computers or with collaborators.

---

### Scenario 3: Check If You Have Uncommitted Changes

**What you want:** See if you have unsaved work

**Steps:**

```bash
# Check status
git status

# If it says "nothing to commit, working tree clean" → All saved ✅
# If it shows modified files in RED → You have unsaved changes
```

---

## Understanding Git Basics

### Three States of Your Files

```
Working Directory  →  Staging Area  →  GitHub
   (Your files)       (git add .)      (git push)
```

1. **Working Directory:** Files on your computer (modified but not saved to Git)
2. **Staging Area:** Changes you've selected to save (after `git add`)
3. **GitHub Repository:** Changes saved online (after `git commit` and `git push`)

### What Each Command Does

| Command | What It Does | When To Use |
|---------|--------------|-------------|
| `git status` | Shows what changed | Before every commit to see what you're saving |
| `git add .` | Adds all changes to staging | When you want to save all your changes |
| `git add file.js` | Adds specific file to staging | When you want to save only certain files |
| `git commit -m "..."` | Saves changes locally with description | After adding files, before pushing |
| `git push` | Uploads commits to GitHub | After committing, to share with others or deploy |
| `git pull` | Downloads changes from GitHub | Before starting work, to get latest code |
| `git log` | Shows history of commits | When you want to see past changes |

---

## Common Tasks

### Task 1: View Your Recent Commit History

```bash
# See last 10 commits (one line each)
git log --oneline -10

# See last 5 commits with details
git log -5

# See who changed what in a specific file
git log --oneline js/audio.js
```

**Output example:**
```
a1b2c3d Fix audio sync issues
e4f5g6h Add menu navigation
i7j8k9l Complete Epic 4 Story 4.5
```

---

### Task 2: See Exactly What Changed in a File

```bash
# See all uncommitted changes
git diff

# See changes in a specific file
git diff js/audio.js

# See changes in your last commit
git diff HEAD~1 HEAD
```

---

### Task 3: Undo Changes (Before Commit)

**Scenario:** You edited a file and want to discard your changes

```bash
# Undo changes in a specific file
git checkout -- js/audio.js

# Undo ALL uncommitted changes (CAREFUL!)
git reset --hard HEAD
```

**⚠️ WARNING:** These commands PERMANENTLY delete your uncommitted changes. Cannot be undone!

---

### Task 4: Undo Last Commit (Already Committed but Not Pushed)

**Scenario:** You committed but realized you made a mistake

```bash
# Undo last commit but KEEP the changes (so you can fix them)
git reset --soft HEAD~1

# Now fix your files, then commit again
git add .
git commit -m "Fixed version of previous commit"
```

---

### Task 5: Write a Good Commit Message

**Bad commit messages:**
```bash
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "changes"
```

**Good commit messages:**
```bash
git commit -m "Fix audio freezing in Story 4.5

- Replaced HTML5 Audio with Web Audio API
- Decoupled playMoveSound from game loop
- Added rate limiting to prevent multiple calls per frame"

git commit -m "Add quality checklist to project

- Created 7-item checklist for story completion
- Covers validation, error handling, performance
- Prevents issues found in Epic 4 code reviews"
```

**Template:**
```bash
git commit -m "Short summary (50 chars or less)

- Bullet point 1 explaining what changed
- Bullet point 2 explaining why
- Bullet point 3 with additional context"
```

---

### Task 6: Create a Backup Before Big Changes

**Scenario:** You're about to make major changes and want a safety net

```bash
# Create a branch as backup
git branch backup-before-refactor

# Make your changes on main branch
# If something goes wrong, you can return to backup:
git checkout backup-before-refactor
```

---

## GitHub Pages Updates

### How GitHub Pages Deployment Works

1. You push code to GitHub (`git push`)
2. GitHub detects changes to `main` branch
3. GitHub Pages automatically rebuilds your site (1-2 minutes)
4. Your game updates at: `https://YOUR_USERNAME.github.io/CrazySnakeLite`

### Check Deployment Status

1. Go to your GitHub repo: `https://github.com/YOUR_USERNAME/CrazySnakeLite`
2. Click **Actions** tab
3. See deployment progress (green ✅ = success, red ❌ = failed)

### Force Rebuild GitHub Pages

If your changes don't appear after 5 minutes:

1. Go to repo **Settings** → **Pages**
2. Click **Visit site** to check current version
3. If still old, make a small change and push again:

```bash
# Add a space to README (triggers rebuild)
echo "" >> README.md
git add README.md
git commit -m "Trigger Pages rebuild"
git push
```

---

## Troubleshooting

### Problem 1: "fatal: not a git repository"

**What it means:** You're not in the project folder

**Solution:**
```bash
# Navigate to your project
cd /Users/anthonysalvi/code/CrazySnakeLite

# Verify you're in the right place
git status
```

---

### Problem 2: "Your branch is ahead of 'origin/main' by X commits"

**What it means:** You have local commits not yet pushed to GitHub

**Solution:**
```bash
# Push your commits
git push
```

---

### Problem 3: "Your branch is behind 'origin/main'"

**What it means:** GitHub has changes you don't have locally

**Solution:**
```bash
# Pull the latest changes
git pull
```

---

### Problem 4: Merge Conflict After `git pull`

**What it means:** You and someone else changed the same file

**What you'll see:**
```
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> main
```

**Solution:**
1. Open the conflicted file
2. Decide which changes to keep (or combine both)
3. Remove the `<<<<<<<`, `=======`, `>>>>>>>` markers
4. Save the file
5. Continue:

```bash
git add .
git commit -m "Resolved merge conflict"
git push
```

---

### Problem 5: Accidentally Committed Sensitive Info

**What to do:** Remove the file from Git history

```bash
# Remove file from Git but keep on disk
git rm --cached .env

# Add .env to .gitignore
echo ".env" >> .gitignore

# Commit the removal
git add .gitignore
git commit -m "Remove .env from version control"
git push

# IMPORTANT: Change any exposed secrets (API keys, passwords)
```

**⚠️ Note:** If the file was already pushed to GitHub, it's in the history. For truly sensitive data, you need to rewrite history (contact an expert).

---

### Problem 6: "Permission denied (publickey)"

**What it means:** Git can't authenticate with GitHub

**Solution Option 1 - HTTPS (Easier):**
```bash
# Switch to HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/CrazySnakeLite.git

# Git will prompt for username/password on next push
git push
```

**Solution Option 2 - SSH Key (More Secure):**
Follow GitHub's SSH key setup guide: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## Best Practices

### 1. Commit Often, Push Daily

**Good:**
```bash
# Multiple small commits
git commit -m "Add score display DOM element"
git commit -m "Style score display with retro theme"
git commit -m "Wire up score updates on food consumption"
git push  # At end of day
```

**Bad:**
```bash
# One giant commit after 3 days
git commit -m "finished everything"
```

**Why:** Small commits are easier to understand and undo if needed.

---

### 2. Write Meaningful Commit Messages

**Good:** "Fix NaN validation in score display (Story 4.1 code review)"
**Bad:** "fix bug"

**Why:** You (and others) need to understand what changed later.

---

### 3. Pull Before You Push

```bash
# Always pull first
git pull

# Make your changes
# ...

# Then push
git push
```

**Why:** Prevents conflicts and ensures you have latest code.

---

### 4. Check `git status` Before Committing

```bash
# See what you're about to commit
git status

# Review the changes
git diff

# Then commit
git add .
git commit -m "Your message"
```

**Why:** Prevents accidentally committing wrong files.

---

### 5. Don't Commit These Files

Create a `.gitignore` file with:

```
# Dependencies
node_modules/

# Environment variables
.env
.env.local

# IDE settings
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Build artifacts
dist/
build/

# Logs
*.log
```

**Why:** Keep repository clean and avoid exposing secrets.

---

### 6. Use Branches for Experiments

```bash
# Create and switch to new branch
git checkout -b experiment-new-feature

# Make experimental changes
# ...

# If it works, merge to main:
git checkout main
git merge experiment-new-feature

# If it doesn't work, just delete the branch:
git branch -D experiment-new-feature
```

**Why:** Safe experimentation without breaking working code.

---

## Working from Multiple Computers

### Scenario: You Have a Work Laptop and Home Computer

**On Work Laptop (First Time):**
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/CrazySnakeLite.git
cd CrazySnakeLite
```

**Before Leaving Work:**
```bash
# Save and push your changes
git add .
git commit -m "Describe what you did today"
git push
```

**At Home Computer:**
```bash
# Get the latest code
cd /path/to/CrazySnakeLite
git pull

# Continue working
# ...

# Push when done
git add .
git commit -m "Continued work from home"
git push
```

**Back to Work Laptop:**
```bash
# Get changes from home
git pull

# Continue working
```

**Key Rule:** Always `git pull` before starting work on a different machine!

---

## Collaboration with Others

### If Someone Else Works on Your Project

**Your workflow:**
```bash
# 1. Always pull before starting
git pull

# 2. Make your changes
# ...

# 3. Before pushing, pull again (in case they pushed while you worked)
git pull

# 4. Resolve any conflicts if needed
# ...

# 5. Push your changes
git push
```

**Avoid conflicts by:**
- Working on different files when possible
- Communicating about who's working on what
- Pushing and pulling frequently

---

## GitHub Web Interface

### View Files on GitHub

1. Go to `https://github.com/YOUR_USERNAME/CrazySnakeLite`
2. Browse files by clicking folders
3. Click any file to view its contents
4. Click **History** to see all changes to that file

### View Commits on GitHub

1. Go to your repo
2. Click **X commits** (top right)
3. Click any commit to see what changed

### Compare Versions

```
https://github.com/YOUR_USERNAME/CrazySnakeLite/compare/COMMIT1...COMMIT2
```

---

## Emergency Commands

### "I Want to Undo Everything and Start Fresh"

```bash
# ⚠️ NUCLEAR OPTION - Deletes ALL local changes
git fetch origin
git reset --hard origin/main

# Re-download everything from GitHub
git pull
```

**⚠️ WARNING:** This PERMANENTLY deletes all uncommitted changes. Use only as last resort.

---

### "I Deleted Important Files by Mistake"

**If you haven't committed yet:**
```bash
# Restore deleted file
git checkout -- path/to/deleted/file.js

# Or restore everything
git reset --hard HEAD
```

**If you already committed and pushed:**
```bash
# Find the commit where file still existed
git log --oneline --all -- path/to/file.js

# Restore file from that commit
git checkout COMMIT_HASH -- path/to/file.js

# Commit the restoration
git add path/to/file.js
git commit -m "Restore accidentally deleted file"
git push
```

---

## Advanced: Viewing Rich History

### See a Visual Commit Graph

```bash
# Pretty commit tree
git log --graph --oneline --all --decorate
```

### See Who Changed Each Line

```bash
# Blame (shows who wrote each line)
git blame js/audio.js
```

### Search Commit Messages

```bash
# Find commits mentioning "audio"
git log --grep="audio"

# Find commits that changed specific text
git log -S "playMoveSound"
```

---

## Cheat Sheet for Printing

```bash
# Status & Info
git status                    # See changed files
git log --oneline -10        # Last 10 commits
git diff                     # See uncommitted changes

# Basic Workflow
git add .                    # Stage all changes
git commit -m "Message"      # Commit with message
git push                     # Upload to GitHub
git pull                     # Download from GitHub

# Undo
git checkout -- file.js      # Discard file changes
git reset --soft HEAD~1      # Undo last commit (keep changes)
git reset --hard HEAD        # Discard ALL changes (DANGER!)

# Branches
git branch                   # List branches
git checkout -b new-branch   # Create and switch to branch
git merge branch-name        # Merge branch into current

# Remote
git remote -v                # Show GitHub URL
git fetch origin             # Download latest from GitHub (don't merge)
```

---

## Getting Help

### Command Documentation

```bash
# Get help on any command
git help commit
git help push
git help log
```

### Useful Resources

- **Official Git Docs:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com/
- **Visual Git Guide:** https://marklodato.github.io/visual-git-guide/index-en.html
- **Oh Shit, Git!:** https://ohshitgit.com/ (Common mistakes and fixes)

---

## Your Project: CrazySnakeLite

### Project-Specific Notes

**GitHub Repository:** `https://github.com/YOUR_USERNAME/CrazySnakeLite`
**Live Game:** `https://YOUR_USERNAME.github.io/CrazySnakeLite`
**Main Branch:** `main`

**Typical commit for your project:**
```bash
git add .
git commit -m "Fix Story 4.5 audio sync issue

- Replaced HTML5 Audio with Web Audio API
- Decoupled playMoveSound from game loop
- Maintains 60 FPS with no audio lag

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push
```

**After pushing:**
- Wait 1-2 minutes
- Visit `https://YOUR_USERNAME.github.io/CrazySnakeLite`
- Game automatically updates ✅

---

## Quick Start Reminder

**Daily workflow (most common):**

```bash
# 1. Navigate to project
cd /Users/anthonysalvi/code/CrazySnakeLite

# 2. Get latest code
git pull

# 3. Make your changes
# ... edit files ...

# 4. Check what changed
git status

# 5. Save changes
git add .
git commit -m "What you did"
git push
```

**That's 90% of what you need!**

---

**Last Updated:** 2026-01-29
**Author:** Charlie (Senior Dev)
**For:** Tomoco (Project Lead)
**Project:** CrazySnakeLite MVP

---

**Questions?** Ask in the team chat or consult GitHub's official documentation at https://docs.github.com/
