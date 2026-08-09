import { Hono } from 'hono';
import { createPost } from '../core/post';

export const scheduler = new Hono();

function isEightAMInColorado(): boolean {
  const hour = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver',
    hour: '2-digit',
    hourCycle: 'h23',
  }).format(new Date());

  return hour === '08';
}

scheduler.post('/daily-thread', async (c) => {
  try {
    if (!isEightAMInColorado()) {
      console.log(
        'Scheduler skipped: it is not 8:00 AM in Colorado.'
      );

      return c.json(
        {
          status: 'skipped',
        },
        200
      );
    }

    const post = await createPost();

    console.log(`Scheduler completed for daily thread: ${post.id}`);

    return c.json(
      {
        status: 'ok',
        postId: post.id,
      },
      200
    );
  } catch (error) {
    console.error(`Scheduler failed: ${error}`);

    return c.json(
      {
        status: 'error',
      },
      500
    );
  }
});