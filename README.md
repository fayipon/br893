# BR893 首頁設計

以 Vue 3 + Vite 製作的靜態 SPA，參考 https://s558.com/ 首頁。桌面中央維持最大 520px 的手機版型，真實手機上填滿可用寬度。

## 開發與打包

```sh
npm install
npm run dev
npm run build
npm run preview
```

`dist/` 為可部署的靜態檔案，不需要後端。Vite 使用相對 base，可放在網域根目錄或子路徑。

## GitHub Pages

- 公開首頁：https://fayipon.github.io/br893/
- 設計預覽：https://fayipon.github.io/br893/?preview=1
- 推送至 `main` 後，`.github/workflows/deploy-pages.yml` 使用 Node.js 24 自動安裝、建置並部署 `dist/`。
- Pages 建置指定 `--base=/br893/`；本機開發維持原本路徑設定。
- Repository 的 Settings → Pages → Source 使用 GitHub Actions。

首頁網址加上 `?preview=1` 可進入設計預覽工具，切換 Web、390px、430px、320px 的獨立 iframe 視窗，以及原版／漸層背景。只有首頁內容，沒有其他業務頁面。

## 背景設定

修改 `src/styles/backgrounds.css`：

- `--web-background`：手機版型外的墨紫色 Web 底色，目前為 `#19131f`。
- `--mobile-gradient-top`：Mobile 柔和紫色漸層上方，目前為 `#432f56`。
- `--mobile-gradient-middle`：中段紫色，目前為 `#3a294b`。
- `--mobile-gradient-bottom`：下方深紫，目前為 `#32233f`。
- `--accent`：淡紫重點色，目前為 `#cfb5ee`，用於選中狀態、浮窗與少量邊框。
- `--pink-action-gradient`：Install 與 Register 使用低飽和莓果玫瑰色；一般主要按鈕使用淡紫色。底部導覽保留原本粉紫底色，選中項目以淡紫圖示、亮色粗體文字、底色與底線強調。
- `--mobile-background-image`：完整背景圖層，可替換為漸層或圖片。
- `--mobile-max-width`：手機版型最大寬度，目前為 `520px`。

首頁不顯示設計工具面板。可使用獨立的 `?preview=1` 預覽工具比較背景，或用 `?background=original` 查看原版背景；預設為新的紫色漸層。Mobile 與 Web 的背景分別由 `.mobile-shell` 和 `.web-canvas` 管理。

Web 背景由 `src/components/SakuraBackground.vue` 以 Canvas 繪製：銀灰圓點構成斜向伸展的左側樹幹與花冠，右側留白。近景圓點較大、遠景較細，隨風橫移、旋流並緩慢落下，花冠圓點也有輕微起伏。動畫僅出現在中央 Mobile 版型外側，不攔截點擊；手機寬度及背景分頁停止運算，減少動態效果模式保留靜態畫面。

## 模擬互動

- 主 Banner：暫用三張相同的 50% Cashback 圖片，保留金色邊框；每 6 秒水平滑動輪播，可使用左右箭頭與三個圓點切換，滑鼠停留或鍵盤聚焦時暫停。
- 公告列：每 3.5 秒由下往上切換一則訊息，重點文字使用亮香檳色與 800 字重；滑鼠停留或鍵盤聚焦時暫停，減少動態效果模式下保留靜態公告。
- 供應商分類與遊戲名稱搜尋：由本機靜態資料篩選。Quente 固定在左側，其餘廠商可觸控橫向滑動或以滑鼠拖曳；選中項目使用明亮紫色底、淡紫邊框與白色粗體文字。
- 側邊選單、App 橫幅關閉；活動浮窗使用與底部快捷同風格的無字透明圖示、亮香檳色粗體標籤與較深的紫色面板。轉盤輕擺、寶箱浮動、禮物小幅彈跳，滑鼠停留、鍵盤聚焦、拖曳或收合時暫停；減少動態效果模式下為靜態圖示。圖示依視窗高度縮放；箭頭切換單欄／雙欄，活動入口開啟各自的示意彈窗。
- 頁面滾動時整組活動浮窗向右移出自身寬度的 75%，保留可見圖示；停止 0.8 秒後滑回，位移動畫為 0.5 秒。浮窗可上下拖曳調整位置。
- 登入、註冊、遊戲、活動、客服與底部其他入口：開啟示意彈窗。
- 沒有帳號服務、資料提交、金流或真實遊戲；不使用後端 API。

## 素材

圖片與字型已存放在 `public/assets/` 及 `src/assets/`，執行時不依賴原站。`src/data/home.json` 是首頁靜態資料，保留 17 個供應商分區。

三個活動 ICON 使用內建 image_gen 重製，透明 PNG 位於 `public/assets/activity-*-v2.png`；完整提示詞與風格參考記錄在 `design/activity-icon-generation.json`。

`design/reference-assets.json` 記錄於 2026-10-27 從公開首頁讀取的素材來源；`design/asset-sources.json` 對照來源與本機路徑。需要重新取得參考素材時執行 `npm run assets:sync`。這些素材用於此專案的首頁設計參考。
