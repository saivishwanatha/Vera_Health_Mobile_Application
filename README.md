# Vera Health Assignment Demo

Expo SDK 54 app that streams SSE from the assignment endpoint  
Parses tagged sections into collapsible blocks and renders markdown live  
Shows SEARCH_STEPS progress during streaming


## Screenshots




## Demo video



If GitHub does not render the video due to size, upload the clip in a GitHub issue and paste the generated user images URL here

## What this app does

- Connects to  
  `https://vera-assignment-api.vercel.app/api/stream?prompt=<encoded>`
- Handles both top level STREAM events and NodeChunk STREAM nodes
- Parses `<guideline>` and `<drug>` tags into collapsible sections
- Renders markdown incrementally as chunks arrive
- Shows SEARCH_STEPS with active and completed states

## Run locally

```bash
npm i
npx expo start -c
# press i for iOS or a for Android
