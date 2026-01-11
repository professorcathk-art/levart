# GitHub Push Instructions

The code has been committed locally. To push to GitHub, you need to authenticate.

## Option 1: Using Personal Access Token (Recommended)

1. Generate a token at: https://github.com/settings/tokens
   - Select scope: `repo` (full control)
   - Copy the token

2. Push using token:
   ```bash
   git push https://YOUR_TOKEN@github.com/mickeyfinance/levart.git main
   ```

## Option 2: Using SSH

1. Set up SSH key (if not already):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Add SSH key to GitHub:
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Add at: https://github.com/settings/keys

3. Change remote URL:
   ```bash
   git remote set-url origin git@github.com:mickeyfinance/levart.git
   git push -u origin main
   ```

## Option 3: Using GitHub CLI

```bash
gh auth login
git push -u origin main
```

## Option 4: Manual Upload

If authentication is problematic:
1. Go to: https://github.com/mickeyfinance/levart
2. Click "uploading an existing file"
3. Drag and drop all files (except `.git`, `node_modules`, `.next`)

Then continue with normal git workflow.
