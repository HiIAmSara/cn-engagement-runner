# CN Engagement Runner

This repository runs the data collection workflow from [cn-engagement-snapshots](https://github.com/is28/cn-engagement-snapshots) on a schedule via GitHub Actions.

## Purpose

This runner repository allows collaborators to run the CN engagement data collection process from their own GitHub account without needing to fork the main repository. The workflow clones the `cn-engagement-snapshots` repository and executes the data collection process.

## Setup Instructions

### 1. Fork or Clone This Repository

Fork this repository to your own GitHub account, or use it directly if you have access.

### 2. Configure Repository Secrets

Go to your repository's **Settings → Secrets and variables → Actions** and add the following secrets:

#### `CREDENTIALS_JSON`
Twitter API credentials in JSON format. Should look like:
```json
{
  "bearer_token": "your_twitter_bearer_token_here"
}
```

#### `CONFIG_JSON`
Configuration file including the Google Drive folder ID. Should look like:
```json
{
  "drive_folder_id": "your_google_drive_folder_id_here"
}
```

#### `RCLONE_CONF`
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

### 3. Adjust the Schedule (Optional)

By default, the workflow runs every 5 minutes. To change this:

1. Edit [.github/workflows/run-data-collection.yml](.github/workflows/run-data-collection.yml)
2. Modify the `cron` expression under `schedule`:
   ```yaml
   schedule:
     - cron: '*/5 * * * *'  # Change this line
   ```

   Common examples:
   - Every 5 minutes: `'*/5 * * * *'`
   - Every hour: `'0 * * * *'`
   - Every 6 hours: `'0 */6 * * *'`
   - Daily at midnight: `'0 0 * * *'`

### 4. Update Repository Reference (If Needed)

If you're using a fork of `cn-engagement-snapshots`, update the repository reference:

1. Edit [.github/workflows/run-data-collection.yml](.github/workflows/run-data-collection.yml)
2. Change line 12:
   ```yaml
   repository: 'your-username/cn-engagement-snapshots'
   ```

## Running the Workflow

### Manual Trigger

1. Go to the **Actions** tab in your repository
2. Select **Run Data Collection** from the workflows list
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

### Automatic Runs

Once configured, the workflow will run automatically according to the schedule.

## Monitoring

- Check the **Actions** tab to see workflow runs
- Click on any run to see detailed logs
- Data will be uploaded to the Google Drive folder specified in your `CONFIG_JSON`

## What This Workflow Does

1. Clones the `cn-engagement-snapshots` repository
2. Sets up Python 3.10 and installs dependencies with uv
3. Installs and configures rclone for Google Drive uploads
4. Creates the necessary secrets files from GitHub secrets
5. Runs the data collection script (`main.py`)
6. Uploads collected data to Google Drive

## Troubleshooting

- **Workflow fails immediately**: Check that all three secrets are properly configured
- **rclone errors**: Verify your `RCLONE_CONF` is correctly formatted and the token hasn't expired
- **Twitter API errors**: Ensure your `CREDENTIALS_JSON` has a valid bearer token
- **Upload fails**: Verify the `drive_folder_id` in `CONFIG_JSON` is correct and accessible

## Notes

- The workflow excludes the SQLite database (`cn_engagement_snapshots.db`) from uploads to save bandwidth
- rclone binary is cached to speed up subsequent runs
- The workflow uses the `--error-on-no-transfer` flag, so it will fail if no new data was collected
