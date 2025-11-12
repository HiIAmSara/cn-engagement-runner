/**
 * Cloudflare Worker to trigger GitHub Actions workflow every 10 minutes
 *
 * This worker runs on a cron schedule and triggers the data-collection.yml
 * workflow via GitHub's workflow_dispatch API.
 */

async function triggerWorkflow(env) {
  const owner = 'marcuschen92';
  const repo = 'cn-engagement-runner';
  const workflow = 'run-data-collection.yml';

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
      const message = `✓ Workflow triggered successfully at ${new Date().toISOString()}`;
      console.log(message);
      return { success: true, message };
    } else {
      const errorText = await response.text();
      const message = `✗ Failed to trigger workflow: ${response.status} - ${errorText}`;
      console.error(message);
      return { success: false, message };
    }
  } catch (error) {
    const message = `✗ Error triggering workflow: ${error.message}`;
    console.error(message);
    return { success: false, message };
  }
}

export default {
  // Cron trigger handler
  async scheduled(event, env, ctx) {
    await triggerWorkflow(env);
  },

  // HTTP fetch handler for manual testing
  async fetch(request, env, ctx) {
    const result = await triggerWorkflow(env);
    return new Response(JSON.stringify(result, null, 2), {
      status: result.success ? 200 : 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
