# COSC 219 Lab 7 — Trail Tracker

The trail list uses one delegated click listener so the Close, Reopen, and Delete buttons keep working after the rows are rebuilt.

If corrupt JSON in localStorage goes unhandled, `JSON.parse()` throws during startup and the app cannot render, so `loadTrails()` falls back to an empty array.

**Live GitHub Pages URL**

- [My GitHub Pages Site](https://greymeridian.github.io/cosc219-site/)

**AI Usage Declaration**

- VSCode Copilot: to speed up manual input by accepting autocomplete suggestions where appropriate.
- ChatGPT: assisted with explaining syntax and troubleshooting.

---