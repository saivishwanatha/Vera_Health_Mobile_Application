# Vera Health Assignment Demo

Expo SDK 54 app that streams SSE from the assignment endpoint  
Parses tagged sections into collapsible blocks and renders markdown live  
Shows SEARCH_STEPS progress during streaming


## Screenshots
![WhatsApp Image 2025-11-08 at 23 29 29 (1)](https://github.com/user-attachments/assets/5df15e36-77f8-44f5-8444-633d060e0bc7)
![Image2](https://github.com/user-attachments/assets/1ad0d4c0-1a4d-4b6c-be0d-fe9d6bdb5876)
![Image3](https://github.com/user-attachments/assets/fdf2fd5e-f8b5-449a-8b28-aa6d7c8f4f1a)
![Image4](https://github.com/user-attachments/assets/fa4e7323-5f82-4007-8867-3de81aaab0d6)



## Demo video

<video src="docs/demo.mp4" controls width="720">
  Your browser does not support embedded video
</video>

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
