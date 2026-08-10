import { context, reddit, redis } from '@devvit/web/server';

const CURRENT_DAILY_KEY = 'daily-thread:current';

const questions = [
    "What's one thing that instantly makes someone more attractive to you?",
    "What is your favorite way for someone to flirt with you?",
    "What's your biggest green flag in someone?",
    "What makes a first conversation memorable?",
    "What's something small someone can do that immediately gets your attention?",
    "Are you more likely to make the first move or wait for them?",
    "What is your ideal first date?",
    "What's something you wish people asked you more often?",
    "What's your favorite compliment to receive?",
    "What makes someone easy to talk to?",
    "I was going to say hi, but you're just too distracting!",
    "Meeting you feels like hitting the jackpot.",
    "Do you always brighten up rooms, or is it just me?",
    "Your smile could outshine the whole city!",
    "You've got me so nervous, I forgot how to talk.",
    "Got a favorite coffee place? Let me take you there!",
    "Even if we were the last two on Earth, I'd feel lucky.",
    "Wherever you are feels like the best spot in the world.",
    "I might've messed up my first impression, but wait for round two!",
    "You seem like the person who can teach me how to love life even more.",
    "The universe must be smiling at me right now… because I met you.",
    "My day was good, but seeing you made it amazing.",
    "How do you pull off looking this amazing without even trying?",
    "Are you always this charming, or is today special?",
    "You've got a vibe that makes everything else disappear.",
    "I was about to leave, but now I'm staying—thanks to you.",
    "If confidence had a face, it'd look just like you.",
    "What are your biggest dreams and aspirations in life?",
    "What makes you feel most loved and appreciated?",
    "What do you see as the most important aspect of a lasting relationship?",
    "What’s something you’ve always wanted to do but haven’t had the chance to?",
    "What’s your happiest memory from childhood?",
    "How do you handle stress or tough times?",
    "What’s your idea of the perfect day?",
    "How do you feel most supported by a partner?",
    "What’s a small thing that makes your day instantly better?",
    "What’s one thing you’re proud of that people might not know about?",
    "What’s your favorite way to spend quality time together?",
    "What’s one lesson life has taught you so far?",
    "How do you envision your future in terms of family and career?",
    "What’s a relationship red flag for you?",
    "What makes you feel truly understood in a relationship?",
    "What’s your favorite way to relax after a long day?",
    "If you could live anywhere in the world, where would it be and why?"
];

function getDailyQuestion(): string {
  const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24));

  return questions[dayNumber % questions.length];
}

function getDate(): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
}

function getDateKey(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}

async function archivePreviousDailyThread(newPostId: string) {
  const previousPostId = await redis.get(CURRENT_DAILY_KEY);

  if (!previousPostId) {
    console.log('No previous daily thread stored.');
    return;
  }

  if (previousPostId === newPostId) {
    return;
  }

  try {
    console.log(`Archiving previous daily thread: ${previousPostId}`);

    const previousPost = await reddit.getPostById(previousPostId);

    await previousPost.unsticky();
    console.log(`Unpinned previous thread: ${previousPostId}`);

    await previousPost.lock();
    console.log(`Locked previous thread: ${previousPostId}`);
  } catch (error) {
    console.error(`Could not archive previous daily thread: ${error}`);
  }
}


export const createPost = async () => {
  const subredditName = context.subredditName;

  if (!subredditName) {
    throw new Error('No subreddit name found in Devvit context.');
  }

  const dateKey = getDateKey();
  const redisKey = `daily-thread:${dateKey}`;

  const existingPostId = await redis.get(redisKey);

  if (existingPostId) {
  console.log(
    `Daily thread already exists for ${dateKey}: ${existingPostId}`
  );

  const existingPost = await reddit.getPostById(existingPostId);

  await redis.set(CURRENT_DAILY_KEY, existingPostId);

  console.log(`Current daily thread stored: ${existingPostId}`);

  return existingPost;
}

  const question = getDailyQuestion();
  const date = getDate();

  const post = await reddit.submitPost({
    subredditName,
    title: `💬 Daily Connections Thread — ${date}`,
    text: `
Welcome to today's Daily Connections Thread!

Use this thread to introduce yourself, meet someone new, start a conversation, or just hang out.

## ❤️ Today's Question

**${question}**

---

### Community Reminder

• Be respectful
• No harassment
• No spam
• Follow all subreddit rules
• Report anything that needs moderator attention

Have fun and enjoy meeting new people! ❤️
`,
  });

  

  console.log(`Created daily thread: ${post.id}`);
  await archivePreviousDailyThread(post.id);

  try {
    await post.sticky(1);
    console.log(`Pinned daily thread: ${post.id}`);
  } catch (error) {
    console.error(`Could not pin daily thread: ${error}`);
  }

  await redis.set(redisKey, post.id);
  await redis.set(CURRENT_DAILY_KEY, post.id);

  return post;
};