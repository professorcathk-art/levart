# Quick Push to GitHub

## The Issue
The repository at https://github.com/mickeyfinance/levart.git is empty because the push failed due to authentication.

## Solution: Use Personal Access Token

### Step 1: Generate Token
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name: `levart-push`
4. Expiration: Choose (90 days recommended)
5. Scopes: Check **`repo`** (Full control of private repositories)
6. Click **"Generate token"**
7. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Push Using Token

Run this command (replace YOUR_TOKEN with your actual token):

```bash
cd /Users/mickeylau/levart
git push https://YOUR_TOKEN@github.com/mickeyfinance/levart.git main
```

**Example:**
```bash
git push https://ghp_xxxxxxxxxxxxxxxxxxxx@github.com/mickeyfinance/levart.git main
```

### Alternative: Set Token as Credential Helper

```bash
# This will prompt for token once, then save it
git push -u origin main
# When prompted for password, paste your token
```

### Verify Push

After pushing, check: https://github.com/mickeyfinance/levart

You should see all your files!
