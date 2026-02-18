# Vera Health Assignment Demo

Expo React Native app that streams SSE from the assignment API, renders markdown as it arrives, and turns tagged blocks like `<guideline>` and `<drug>` into collapsible sections. It also shows live SEARCH_STEPS.



## Screenshots

## Screenshots

<table>
  <tr>
    <td align="center"><img src="docs/I1.jpeg" alt="Streaming view" width="320"></td>
    <td align="center"><img src="docs/Image1.jpeg" alt="Section expanded" width="320"></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/Image2.jpeg" alt="Search steps" width="320"></td>
    <td align="center"><img src="docs/Image3.jpeg" alt="Final markdown" width="320"></td>
  </tr>
</table>


If the player above does not appear in your browser, use this link instead  
[▶️ Download(donwload the raw file) the demo video](docs/Demo_video.mp4)



## What this app does

- Connects to  
  `https://vera-assignment-api.vercel.app/api/stream?prompt=<encoded-prompt>`
- Handles both top level `{"type":"STREAM"}` chunks and `{"type":"NodeChunk","content":{"nodeName":"STREAM"}}`
- Parses `<guideline>` and `<drug>` into collapsible cards
- Renders text outside tags as normal markdown
- Displays SEARCH_STEPS with active and done states
- Batches UI updates with requestAnimationFrame for smooth rendering

## Quick start

Requirements

- Node 18 or 20
- Xcode for iOS simulator or Android Studio for emulator

Run

```bash
npm i
npx expo start -c
# press i for iOS or a for Android
