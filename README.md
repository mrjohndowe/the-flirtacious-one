# The Flirtacious One

The Flirtacious One is a Reddit Devvit app built for r/Flirty_Connections.

## Features

- Creates a Daily Connections Thread
- Posts a rotating daily conversation question
- Prevents duplicate daily threads using Redis
- Pins the current Daily Connections Thread
- Tracks the current daily thread
- Automatically archives the previous daily thread
- Runs automatically at 8:00 AM Colorado time
- Handles both Mountain Standard Time and Mountain Daylight Time
- Provides moderators with a manual "Post Daily Thread Now" action

## Daily Thread

The Daily Connections Thread gives community members a place to:

- Introduce themselves
- Meet new people
- Start conversations
- Answer a daily conversation question
- Socialize with other members of the community

## Moderation

The app is intended for use by moderators of r/Flirty_Connections.

The manual daily-thread command is restricted to moderators.

## Data

The app uses Devvit Redis to store identifiers for daily threads so that duplicate posts are not created.

The app does not send community data to external services.

## Scheduling

The app checks the appropriate UTC scheduler times so that the Daily Connections Thread is created at approximately 8:00 AM in the America/Denver time zone throughout the year.

## Community

Built specifically for r/Flirty_Connections.