import { Hono } from 'hono';
import type { UiResponse } from '@devvit/web/shared';
import { context } from '@devvit/web/server';
import { createPost, getDailyQuestion } from '../core/post';

export const menu = new Hono();

menu.post('/post-create', async (c) => {
  try {
    const post = await createPost();

    return c.json<UiResponse>(
      {
        navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
      },
      200
    );
  } catch (error) {
    console.error(`Error creating post: ${error}`);

    return c.json<UiResponse>(
      {
        showToast: 'Failed to create post',
      },
      400
    );
  }
});

menu.post('/answer-daily-question', async (c) => {
  const question = getDailyQuestion();

  return c.json<UiResponse>({
    showForm: {
      name: 'dailyAnswerForm',
      form: {
        title: "Answer Today's Question",
        description: question,
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Post title',
            placeholder: 'Give your post a title',
            required: true,
          },
          {
            type: 'paragraph',
            name: 'answer',
            label: 'Your answer',
            helpText:
              "Today's question will automatically be quoted above your answer.",
            placeholder: 'Write your answer here...',
            required: true,
            lineHeight: 8,
          },
        ],
        acceptLabel: 'Post from My Account',
        cancelLabel: 'Cancel',
      },
    },
  });
});
