# CN Engagement Runner

This repository allows one to run the data collection workflow from [cn-engagement-snapshots](https://github.com/isaacOnline/cn-engagement-snapshots) via GitHub Actions.

## Setup Instructions

Go to your repository's **Settings → Secrets and variables → Actions** and add the following:

### Secret: `CREDENTIALS_JSON`

Twitter API credentials in JSON format. Should look like:

```json
{
  "bearer_token": "your_twitter_bearer_token_here"
}
```

###  Secret: `RCLONE_CONF`

Rclone configuration for Google Drive access. Should look like:

```
[gdrive]
type = drive
scope = drive
token = {"access_token":"...","token_type":"Bearer","refresh_token":"...","expiry":"..."}
team_drive =
```

To generate your rclone config:

1. Install rclone: `brew install rclone` (macOS) or see [rclone.org](https://rclone.org/install/)
2. Run: `rclone config`
3. Create a new remote named `gdrive` with type `drive`
4. Follow the authentication prompts
5. Copy the contents of `~/.config/rclone/rclone.conf`

###  Secret: `GH_PAT`

GitHub Personal Access Token to access the private `cn-engagement-snapshots` repository.


### Variable: `CONFIG_JSON`

Configuration file including the Google Drive folder ID. Should look like:

```json
{
  "drive_folder_id": "your_google_drive_folder_id_here"
}
```

## Cloudflare Trigger Setup

To trigger the workflow via Cloudflare Workers (using CLI):

1. Install Wrangler: `npm install -g wrangler`
2. Login: `wrangler login`
3. Deploy the worker: `cd cloudflare-trigger && wrangler deploy`
4. Set secrets:

   ```bash
   wrangler secret put GITHUB_TOKEN
   ```

5. Configure cron trigger in `wrangler.toml` if needed
