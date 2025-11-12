/**
 * Cloudflare Worker to trigger GitHub Actions workflow every 10 minutes
 *
 * This worker runs on a cron schedule and triggers the data-collection.yml
 * workflow via GitHub's workflow_dispatch API.
 */

export default {
  async scheduled(event, env, ctx) {
    const owner = 'marcuschen92';
    const repo = 'cn-engagement-runner';
    const workflow = 'data-collection.yml';

    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'Cloudflare-Worker-Cron',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ref: 'main'
        })
      });

      if (response.ok) {
        console.log(`✓ Workflow triggered successfully at ${new Date().toISOString()}`);
      } else {
        const errorText = await response.text();
        console.error(`✗ Failed to trigger workflow: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error(`✗ Error triggering workflow: ${error.message}`);
    }
  }
};
