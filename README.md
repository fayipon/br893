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
- Design 展示頁：https://fayipon.github.io/br893/?page=design
- 推送至 `main` 後，`.github/workflows/deploy-pages.yml` 使用 Node.js 24 自動安裝、建置並部署 `dist/`。
- Pages 建置指定 `--base=/br893/`；本機開發維持原本路徑設定。
- Repository 的 Settings → Pages → Source 使用 GitHub Actions。

首頁網址加上 `?preview=1` 可進入設計預覽工具，切換 Web、390px、430px、320px 的獨立 iframe 視窗，以及原版／漸層背景。`?page=design` 為獨立 Design 展示頁，整理本站配色、Baloo 2 字體、按鈕樣式與現有 Banner；可切換字重、查看按鈕用途及放大 Banner。入口位於首頁桌面右上留白區，僅在視窗寬度至少 1024px 時顯示，手機不顯示。兩種網址皆相容 GitHub Pages 子路徑，沒有其他業務頁面。

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

- 滑鼠移入不觸發變亮、邊框／底色變化或遊戲卡片遮罩；鍵盤聚焦提示與動畫暫停操作保留。
- 登入、註冊按鈕保留紫色與玫瑰色底，使用柔和漫射高光、細緻亮邊與輕微陰影，呈現自然的表面光澤。左上選單採相同光感的圓角紫色底及奶油白 SVG 三線圖示；高光不隨滑鼠移入變化。

- 下方三張小 Banner 均僅保留兩行文字並調整至視覺置中，移除第三行及分隔線。第一張為黑銅象神「MINA MISTERIOSA／ATÉ R$ 8.888」，R$ 與 ATÉ 使用相同暖米色及質感；第二張為孔雀藍老鼠「CONVIDE 1 AMIGO／R$ 80」，標題在人物後方、數字在外套前方；第三張為煙灰與朱紅金龍輪盤「AJUDA DE AMIGOS／R$ 100」。R$ 跟隨各張輔助文字的中性色系，僅獎金數字以金色強調，不以純白為硬性規則。三張均無品牌網址，使用獨立標題、替代文字及示意彈窗圖片。

- 主 Banner：共四張，依序為 5% 推薦佣金、Bônus VIP、新會員獎勵 R$ 8.888、50% Cashback。推薦佣金使用翡翠綠與香檳金、雷神角色和適度的電影感環境細節；主標為「INDIQUE. GANHE.」，以斜體無襯線字搭配前景放大的金色「5%」，與主標及「DE COMISSÃO」局部交疊。下方以「ATÉ R$ 1 MILHÃO / MÊS」簡潔呈現每月最高可達一百萬巴西雷亞爾，不使用厚重金額框。VIP 使用酒紅背景、柔焦拱門、少量絲絨垂簾與玫瑰金側光，搭配皇冠及王座，文案為「Diário + Semanal + Mensal」。新會員 Banner 採用午夜藍灰背景、紫色絲絨禮盒與金色立體金額，並標示第 2、3、7、15、30 天。新增 Banner 均不含網址；50% Cashback 僅保留一張。每 6 秒水平滑動輪播，可使用下方左右箭頭與四個圓點切換，滑鼠停留或鍵盤聚焦時暫停。各張圖片使用獨立的標題、替代文字與示意彈窗圖片。
- 公告列：每 3.5 秒由下往上切換一則訊息，重點文字使用亮香檳色與 800 字重；滑鼠停留或鍵盤聚焦時暫停，減少動態效果模式下保留靜態公告。
- 供應商分類與遊戲名稱搜尋：由本機靜態資料篩選。Quente 固定在左側，其餘廠商可觸控橫向滑動或以滑鼠拖曳；選中項目使用與 Registro 一致的玫瑰色漸層、淡玫瑰邊框與白色粗體文字，保留柔和高光。Quente 總覽隱藏各遊戲區的「Carregar Mais」，切換至單一供應商時顯示。遊戲區塊之間保留 24px 間距，「Ver tudo」採較柔和的玫瑰色底與淺色文字。
- 廠商標誌使用白色字樣，帶底圖的標誌保留單色明暗細節；各遊戲區補齊對應圖示，旁邊以 14px 次級文字顯示「數量 games」（單數為 game），數量由目前篩選後的遊戲清單計算。
- 側邊選單、App 橫幅關閉；活動浮窗使用與底部快捷同風格的無字透明圖示、亮香檳色粗體標籤與較深的紫色面板。轉盤僅盤面持續旋轉，指針及底座固定；寶箱以箱蓋開合並顯露金幣，箱身固定；禮物維持小幅彈跳。`ActivityIcon.vue` 以 SVG 裁切原始透明圖示並分層動畫，保留玫瑰色配色。滑鼠停留、鍵盤聚焦、拖曳或收合時暫停；減少動態效果模式下為靜態圖示。圖示依視窗高度縮放；箭頭切換單欄／雙欄，活動入口開啟各自的示意彈窗。
- 頁面滾動時整組活動浮窗向右移出自身寬度的 75%，保留可見圖示；停止 0.8 秒後滑回，位移動畫為 0.5 秒。浮窗可上下拖曳調整位置。
- 登入、註冊、遊戲、活動、客服與底部其他入口：開啟示意彈窗。
- 沒有帳號服務、資料提交、金流或真實遊戲；不使用後端 API。

## 素材

第一張小 Banner 使用內建 image_gen 製作，目前使用置中黑銅版 `public/assets/promo-mystery-mine-bronze-v4.png`，R$ 與 ATÉ 同色同質感；精簡文案與完整提示詞記錄在 `design/mystery-mine-banner-generation.json`。

第二張小 Banner 使用內建 image_gen 製作，目前使用置中前後交錯版 `public/assets/promo-invite-friend-peacock-v5.png`；精簡文案與完整提示詞記錄在 `design/invite-friend-banner-generation.json`。

第三張小 Banner 使用內建 image_gen 製作，目前使用煙灰朱紅金龍版 `public/assets/promo-friend-assist-slate-v1.png`；精簡文案與完整提示詞記錄在 `design/friend-assist-banner-generation.json`。

推薦佣金 Banner 使用內建 image_gen 製作，目前使用描邊疊字版 `public/assets/hero-referral-emerald-v4.png`，5% 加上深翡翠色描邊與細金色外緣；文案、配色與完整提示詞記錄在 `design/referral-banner-generation.json`。

VIP Banner 使用內建 image_gen 製作，目前使用 `public/assets/hero-vip-burgundy-v3.png`；文案、配色與背景調整的完整提示詞記錄在 `design/vip-banner-generation.json`。

新會員 Banner 使用內建 image_gen 製作，目前使用 `public/assets/hero-new-members-midnight-v2.png`，初版紫色背景保留於 `public/assets/hero-new-members-purple-v1.png`；文案、配色與完整提示詞記錄在 `design/new-member-banner-generation.json`。

圖片與字型已存放在 `public/assets/` 及 `src/assets/`，執行時不依賴原站。`src/data/home.json` 是首頁靜態資料，保留 17 個供應商分區。

三個活動 ICON 使用內建 image_gen 重製，透明 PNG 位於 `public/assets/activity-*-v3.png`；較深的粉紅色部位改用 Registro 按鈕的玫瑰色調（`#b05a85 → #a7507b`），保留原本明暗、象牙白、淡紫與金幣。完整提示詞與風格參考記錄在 `design/activity-icon-generation.json`。

`design/reference-assets.json` 記錄於 2026-10-27 從公開首頁讀取的素材來源；`design/asset-sources.json` 對照來源與本機路徑。需要重新取得參考素材時執行 `npm run assets:sync`。這些素材用於此專案的首頁設計參考。
