# Google Drive Folder Copier App

The Google Drive Folder Copier App is a web application based on Google Apps Script designed to bypass the traditional 6-minute execution limits when copying large directory structures.

## What Was Achieved

- **Server Framework**: Set up `Code.gs` utilizing the built-in Apps Script methods (`DriveApp`, `SpreadsheetApp`) for reading folder contents, generating folders, appending row stats to Google Sheets, and copying files.
- **Client Optimization**: Instead of running a single copy execution that is prone to 6-minute timeouts, the robust `index.html` implements queue-based concurrency mapping.
  - The client UI initiates the logging call.
  - The tree mapper performs BFS (Breadth First Search) to uncover the full structure and duplicate it to the selected destination folder in real time without choking.
  - The file transfer system accumulates all `File IDs` to copy and pushes them back to Google in segmented batches (maximum 100 per cycle) displaying vivid progress feedback.
- **Premium Aesthetics**: Engineered the frontend interface inside `index.html` utilizing a dark theme layout, TailwindCSS for utility styling, and Glassmorphism techniques with smooth dynamic gradients ensuring a very modern feel.

> [!TIP]
> **Deployment Steps**
>
> 1. Go to [script.google.com](https://script.google.com/) and create a "New project".
> 2. Copy the content inside `Code.gs` and paste it into the editor's `Code.gs` tab.
> 3. Click `+` next to Files, select HTML, name it `index.html`, and copy-paste the contents of the local `index.html` file into it.
> 4. Go to **Deploy -> New Deployment**. Select **Web app** as the type.
> 5. Set **Execute as** to `User accessing the web app` and **Who has access** to `Anyone with Google Account` (or limiting to your domain).
> 6. Authorize the permissions upon prompts.
