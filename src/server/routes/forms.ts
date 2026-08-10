import { Hono } from 'hono';
import type { UiResponse } from '@devvit/web/shared';
import { context, reddit } from '@devvit/web/server';
import { getDailyQuestion } from '../core/post';

type DailyAnswerFormValues = {
  title?: string;
  answer?: string;
};

export const forms = new Hono();

forms.post('/daily-answer-submit', async (c) => {
  try {
    const { title, answer } = await c.req.json<DailyAnswerFormValues>();

    const trimmedTitle = typeof title === 'string' ? title.trim() : '';
    const trimmedAnswer = typeof answer === 'string' ? answer.trim() : '';

    if (!trimmedTitle || !trimmedAnswer) {
      return c.json<UiResponse>(
        {
          showToast: 'Please enter both a title and your answer.',
        },
        400
      );
    }

    const subredditName = context.subredditName;

    if (!subredditName) {
      throw new Error('No subreddit name found in Devvit context.');
    }

    const question = getDailyQuestion();

    const postText = `> **${question}**

${trimmedAnswer}`;

    const post = await reddit.submitPost({
      subredditName,
      title: trimmedTitle,
      text: postText,
      runAs: 'USER',
    });

    try {
      await post.approve();
      console.log(`Approved Question of the Day answer post: ${post.id}`);
    } catch (error) {
      console.error(`Could not approve answer post: ${error}`);
    }

    return c.json<UiResponse>(
      {
        navigateTo: `https://reddit.com/r/${subredditName}/comments/${post.id}`,
      },
      200
    );
  } catch (error) {
    console.error(`Could not create Question of the Day answer post: ${error}`);

    return c.json<UiResponse>(
      {
        showToast: 'Could not create your post. Please try again.',
      },
      400
    );
  }
});
