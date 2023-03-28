import path from "path";
import type { BrowserWindow } from "electron";
import { app, dialog, ipcMain } from "electron";
import serve from "electron-serve";
import ffmpegPath from "ffmpeg-static-electron";
import ffmpeg from "fluent-ffmpeg";
import { createWindow } from "./helpers";

ffmpeg.setFfmpegPath(ffmpegPath.path);

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

let mainWindow: BrowserWindow;

(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

ipcMain.on("convert", (_, d) => {
  const { srcPath, format } = d;
  // ffmpeg().input(srcPath);
  const outPath = dialog.showSaveDialogSync(mainWindow, {
    defaultPath: path.dirname(srcPath),
    filters: [
      {
        name: "test",
        extensions: [format],
      },
    ],
  });
  ffmpeg().input(srcPath).output(outPath).run();
  console.log("🚀 ~ file: background.ts:38 ~ ipcMain.on ~ a:", outPath);
});

app.on("window-all-closed", () => {
  app.quit();
});
