# Project Hub / BR893 首頁設計

根目錄為卡片式專案入口，提供 **BR893** 與 **Jito** 兩張卡片。兩張卡片皆以 **Design**、**演示站** 兩個並排按鈕分別進入各自的設計展示與首頁；Jito 卡片頁尾另保留尺寸預覽。BR893 尺寸預覽仍可透過 `?preview=1` 直接開啟。桌面並排、手機單欄，卡片內容集中在 `src/components/ProjectHub.vue` 的 `projects` 清單。兩站共用 `DesignPage.vue` 的色票、字體、按鈕、圖示與 Banner 展示架構，Jito 使用酒紅色票及英文介面，Back to site 返回所屬演示站。

Jito 是本地酒紅主題靜態頁，與 BR893 共用 `App.vue`、遊戲圖片、輪播、Banner 圖片／動畫切換及遊戲亮度控制。Jito 的獨立 Banner 與印度盧比資料集中於 `src/data/ipaData.js`。設定沿用既有瀏覽器儲存，因此兩站同步使用相同的 Banner 模式與亮度。Jito 的橫式品牌以 `IpaBrand.vue` 呈現：圖片僅包含紅金 LOGO 圖形，右側「Jito Gaming」為 HTML/CSS 文字；下載列 APP 圖示使用相同圖形。透明圖檔位於 `public/assets/ipa/brand-mark-v1.png`，原稿、來源與生成提示詞保存在 `design/ipa-logo/`。既有 `?page=ipa` 與 `site=ipa` 連結維持相容，英文介面文案位於 `src/ipaCopy.js`，主題集中在 `src/styles/ipa.css`。不載入 Jitobets 的 Banner、遊戲素材或服務，先前下載的原站縮圖已移除；原站色碼觀察保留在 `design/ipa-reference.json`。

Jito 的 Web 留白使用 `KoiBackground.vue` 繪製五條不同大小的粒子錦鯉：最大魚身由 150px 放大至最高 300px，依視窗留白縮放，其餘為 85%、68%、56%、43%。象牙白／朱紅與香檳金斑紋搭配魚身擺動、尾鰭、胸鰭、尾流與細水波，左側三條、右側兩條緩游；巡游時依魚身邊界調整位置，右側避開上方設定區。水池加入細粒子荷葉、淡線花瓣、水草、不規則石岸與緩動水面反光；池底以離屏 Canvas 快取。Canvas 僅繪製中央版型之外，背景可點擊投餌，中央頁面與設定控制維持各自的點擊行為。動畫限制為 30fps 與最高 1.5 倍像素密度，窄螢幕和背景分頁停止運算；減少動態效果時暫停環境巡游，使用者主動投餌時才完成單次追食動畫。BR893 沿用原本櫻花背景。

點擊任一側水面投下一顆餌料，落水產生三圈波紋與水花，之後隨水面漂浮。同側錦鯉以 2.6 倍速度追食、同步加快擺尾；餌料被吃掉後，魚群在 3 秒內平順回到巡游。全場一次只允許一顆餌料，連點或點擊另一側都不會追加，必須被吃掉才能再投；縮放視窗與暫停分頁也保留此限制。互動狀態位於 `src/koiFeeding.js`，以 `npm test` 驗證鎖定、落水／漂浮、加速、消耗與恢復行為。

- `/`：專案入口。
- `?page=br893`：BR893 紫色首頁。
- `?page=ipa`：Jito 酒紅色首頁。
- `?page=design`：BR893 Design 展示頁，Back to site 返回 BR893。
- `?page=design&site=ipa`：Jito Design 展示頁，Back to site 返回 Jito。
- `?preview=1`：BR893 尺寸預覽。
- `?page=ipa&preview=1`：Jito 尺寸預覽，可比較純色／漸層背景。
- `?background=original`：保留舊版直接預覽 BR893 背景的網址。

兩站僅在桌面右側留白工具區提供「專案入口」、Banner 與亮度設定。側邊選單、頁尾、Design 與尺寸預覽內容區不新增入口。Jito 的範圍與 BR893 相同：首頁、側邊選單、搜尋／廠商篩選及登入、活動、遊戲等示意彈窗，沒有帳號服務、資料提交、金流或真實遊戲。部分既有圖稿保留葡文；Jito 的活動金額與 Banner 貨幣使用印度盧比 ₹，BR893 保留 R$。示意金額數字沿用原稿，未做匯率換算。

Jito 的配色呼應紅金 LOGO：以 `#240B12` 深酒紅作頁面底、`#681C32` 酒紅作抬升表面、`#D83446` 紅色強調活動，以及 `#E8C77D` 香檳金呈現 Register、選中狀態、細邊框及重點文字；主要文字為 `#FFF5E1` 暖象牙白。Register 使用 `#F8E7BA → #E8C77D → #C99A50` 金色漸層及深酒紅文字。頁首、側邊選單、活動浮窗、底部導航、設定控制、專案卡片及 Design 色票同步。品牌程式字樣垂直加高 45% 並下移 2px，保留原有橫向寬度與手機版按鈕空間。

Jito 遊戲分類選中時使用香檳金底與深酒紅圖示，未選中圖示使用柔和暖金；帶底圖的廠商品牌保留明暗細節。右側三個活動金額標籤使用紅色漸層底、淺香檳金數字與細金邊。

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

- 專案入口：https://fayipon.github.io/br893/
- BR893 首頁：https://fayipon.github.io/br893/?page=br893
- Jito 首頁：https://fayipon.github.io/br893/?page=ipa
- Jito 設計預覽：https://fayipon.github.io/br893/?page=ipa&preview=1
- 設計預覽：https://fayipon.github.io/br893/?preview=1
- Design 展示頁：https://fayipon.github.io/br893/?page=design
- 推送至 `main` 後，`.github/workflows/deploy-pages.yml` 使用 Node.js 24 自動安裝、建置並部署 `dist/`。
- Pages 建置指定 `--base=/br893/`；本機開發維持原本路徑設定。
- Repository 的 Settings → Pages → Source 使用 GitHub Actions。

首頁網址加上 `?preview=1` 可進入設計預覽工具，切換 Web、390px、430px、320px 的獨立 iframe 視窗，以及原版／漸層背景。`?page=design` 為獨立 Design 展示頁，整理本站配色、Baloo 2 字體、按鈕樣式與現有 Banner；可切換字重、查看按鈕用途及放大 Banner。Design 入口位於專案首頁 BR893 卡片內；BR893 桌面右上留白區僅保留「專案入口」，視窗寬度至少 1024px 時顯示，手機不顯示。兩種網址皆相容 GitHub Pages 子路徑，沒有其他業務頁面。

Design 頁的 `Icons` 區列出 12 個介面 SVG 元件與 8 個導覽／快捷圖示，並提供轉盤、寶箱、禮物的即時動畫、原始透明 PNG 預覽與下載。動畫沿用首頁 `ActivityIcon.vue` 元件，可暫停／繼續，也遵循裝置的減少動態效果設定。

Jito 大 Banner 顯示「Deposit rewards」、「Daily Deposit Bonus」、「First Deposit 37% Bonus」、「IPL Cricket Cashback」與「Lucky Wheel」五張；首頁與 Design 展示同步。Lucky Wheel 以酒紅與香檳金轉盤搭配 #9B7CFF 紫色燈光，文案為 LUCKY WHEEL / SPIN & WIN，沒有 CTA 按鈕。盤面每 12 秒順時針旋轉一圈，外框燈泡、指針、中軸與底座固定；LUCKY WHEEL 延後 0.03 秒從上方落下，在 0.65 秒內回彈落定，0.8 秒後接金屬掃光，每 6.5 秒循環。標題、盤面與背景用內建 image_gen 拆層，提示詞及定位記錄保存在 `design/jito-banners/lucky-wheel-v1-motion-generation.json`。圖片模式、減少動態效果或素材載入失敗時，保留原核准靜態稿。第四張保留亮金色 50%，其他標語弱化，CASHBACK 上移到數字後層。左右兩位球員分別於 0.05／0.14 秒滑入，中間 Pant 在 0.65 秒後由 88% 放大至前景，金色 50% 在 0.72 秒後進場，1.75 秒後開始掃光。三位球員、金額及背景獨立拆層，靜態圖與內建 image_gen 提示詞記錄於 `design/jito-banners/cricket-cashback-50-v5-motion-generation.json`。第三張使用 #597CFF 電光藍賽道與酒紅跑車；37 與 % 採一致金色，整組進場後接金屬掃光。跑車從右上遠方彎道以 16% 尺寸出現，沿道路向前滑近、轉向並逐漸放大至 100%，在 1.65 秒內減速落定；縮放以輪胎接地位置為基準，搭配逐漸消退的模糊及沿彎道流動的藍色光軌。完整靜態稿、去字去車背景、透明字層與車層，以及內建 image_gen 提示詞記錄於 `design/jito-banners/first-deposit-37-v4-motion-generation.json`。第二張使用短髮現代角色與 #A8D8E8 冰霧藍撞色，沒有 CTA 按鈕；EVERY DAY、主標與副標分層進場，主標沿用第一張的大幅滑入、縮放回彈與金色掃光，人物、寶箱與光圈保持靜態。靜態稿與內建 image_gen 拆層記錄保存在 `design/jito-banners/daily-deposit-v3-motion-generation.json`。新 Banner 使用 `JitoDepositBanner.vue`：光環以 5.2 秒週期先暗、再亮、再暗，青綠色遮罩與柔邊限制明暗範圍；手中籌碼以 4.6 秒週期上下浮動、五顆獨立紅寶石以 4.9–6.3 秒不同節奏漂浮。主標用獨立透明字稿在 1.25 秒內由左側 180px 滑入，從 82% 放大至 104.5% 後落定，副標延後 0.55 秒淡入，再接上 BR893 風格的暖金屬掃光，每 7.5 秒循環。靜態原稿、去字底圖及透明文字／浮動物件各自保留，人物及五組獎勵保持穩定。首頁、彈窗與 Design 頁共用同一元件；離開可見範圍或切至背景分頁時暫停，減少動態效果設定及圖片模式顯示完整靜態原稿。素材載入失敗亦保留靜態圖。圖片與內建 image_gen 提示詞記錄於 `design/jito-banners/motion-and-inr-generation.json`，文字拆層記錄於 `design/jito-banners/entrance-generation.json`。
Jito 的三張小 Banner 依序為「Daily Check-in / 7 DAYS」、「VIP CLUB / ₹120,000」與「CRICKET / 50% CASHBACK」。簽到使用青綠金屬簽到徽章，VIP 使用紅寶石與金色 V 字會員徽記，板球保留三位球員與隊服，移除 IPL 標誌及 UP TO，重新放大排列 50% CASHBACK。三張皆為純靜態 PNG，首頁、Design 與放大預覽同步，切換大 Banner 動畫模式不影響這三張。新版圖稿路徑與內建 image_gen 完整提示詞保存在 `design/jito-banners/small-promotions-v2-generation.json`。

Jito 首頁載入時顯示直式 Lucky Wheel 彈窗，寬度限制於 mobile 容器內，並依可用高度縮放；遮罩也限於中央 mobile 區域。金框只包住圖稿，Don't show again today 放在框外下方，沒有 SPIN & WIN 按鈕。勾選後以瀏覽器當地日期儲存於 `jito.lucky-wheel.hidden-date`，同日重新載入不自動開啟，隔日恢復；右側 Lucky Wheel 快捷入口仍可手動打開並取消勾選。彈窗與 Design 的 Welcome popup 展示共用 Banner type switch：靜態直接顯示兩組金額；動態盤面順時針旋轉，標題 0.65 秒落下，與固定紅寶石指針保持間距。21 顆外圈黃燈以 1.8 秒週期依序明暗波動。轉動 2 秒後，56 枚金幣／寶石由中心爆炸向外噴散淡出，不做下落；3.55 秒 MIN ₹100、4.9 秒 UP TO ₹5,000 分別由 20% 放大至 110% 再回彈落定，保留在輪盤上下兩處，不退場、不掃光。文字沿用 Lucky Wheel 的立體金屬字型，以獨立透明 PNG 呈現。減少動態效果或載入失敗時使用靜態構圖；離開可視範圍或切換背景分頁時暫停。開啟彈窗時背景輪播與公告暫停，關閉後恢復。原稿與新版素材、完整 image_gen 提示詞分別存於 `design/jito-banners/lucky-wheel-popup-v1-generation.json`、`design/jito-banners/lucky-wheel-popup-v2-generation.json`；每日隱藏邏輯由 `src/dailyPromotion.test.js` 驗證。

## 大 Banner 分層動畫

桌面「專案入口」下方及 Design 頁的 Banners 區提供 `Banner type switch`，可切換原始整張圖片與預設的 `Artwork + motion`。選擇會儲存在此瀏覽器，首頁、展示頁及放大預覽使用同一設定；三張小 Banner 一律顯示靜態圖片。

開關下方的 `Game brightness` 滑桿可在 0–100% 間即時調整首頁遊戲圖片亮度，預設為 70%。數值會儲存在此瀏覽器並同步至其他開啟的分頁，只影響遊戲卡片圖片；桌面設定區在手機仍保持隱藏。

四張大 Banner 各自拆為去字背景、標題、金額／主視覺字樣及輔助文字。12 張透明 PNG 保留原圖字樣的金屬質感、描邊與立體效果，圖片路徑及百分比定位存於 `src/data/home.json` 的 `lettering`。`src/components/HeroBanner.vue` 統一管理標題滑入、金額縮放落定、輔助文字進場與金額掃光；各層可獨立調整。圖片載入並進入畫面後才開始動畫，切換輪播會重新播放，Design 頁可用 `Replay motion` 重播。減少動態效果模式下顯示靜態合成。

去字背景與拆字素材使用內建 image_gen 製作，素材與提示詞分別記錄在 `design/textless-banner-generation.json`、`design/lettering-banner-generation.json`；原始整圖保留供切換比較。

## 背景設定

修改 `src/styles/backgrounds.css`：

- `--web-background`：手機版型外的墨紫色 Web 底色，目前為 `#19131f`。
- `--mobile-gradient-top`：Mobile 柔和紫色漸層上方，目前為 `#3d2b50`。
- `--mobile-gradient-middle`：中段紫色，目前為 `#2e1f3d`。
- `--mobile-gradient-bottom`：下方深紫，目前為 `#24182f`。
- `--surface-inset`：公告與供應商分類列使用的深色凹槽；`--section-surface`、`--section-border`、`--section-shadow` 控制遊戲分區面板的漸層、細亮邊與柔和陰影。面板向左右留白延伸，維持原本三欄遊戲圖片大小；區塊標題下方以細線區隔。
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

VIP Banner 使用內建 image_gen 製作，目前使用 `public/assets/hero-vip-burgundy-v4.png`；新版放大銀白 BÔNUS 與金色 VIP，金色 VIP 保持水平，銀白 BÔNUS 獨立向右上傾斜 4°，由前景 VIP 蓋住標語下緣，兩者保留一致、自然的立體透視。VIP 外緣以深酒紅描邊及細香檳金線加強，動畫版用 SVG 輪廓濾鏡隨尺寸等比例呈現。原版記錄在 `design/vip-banner-generation.json`，最新整圖及透明字層提示詞記錄在 `design/banner-slogan-updates.json`。

新會員 Banner 使用內建 image_gen 製作，目前使用 `public/assets/hero-new-members-midnight-v3.png`；新版採大字 BÔNUS、小字 PARA 及斜向 NOVOS MEMBROS，標語維持銀白色，下緣與前景金額輕微交疊。動畫版使用獨立透明字層 `hero-members-lettering-headline-v2.png`。初版記錄在 `design/new-member-banner-generation.json`，最新素材與提示詞記錄在 `design/banner-slogan-updates.json`。

圖片與字型已存放在 `public/assets/` 及 `src/assets/`，執行時不依賴原站。`src/data/home.json` 是首頁靜態資料，保留 17 個供應商分區。

三個活動 ICON 使用內建 image_gen 重製，透明 PNG 位於 `public/assets/activity-*-v3.png`；較深的粉紅色部位改用 Registro 按鈕的玫瑰色調（`#b05a85 → #a7507b`），保留原本明暗、象牙白、淡紫與金幣。完整提示詞與風格參考記錄在 `design/activity-icon-generation.json`。

Jito 的五個底部快捷、客服與右側三個活動圖示使用內建 image_gen 統一為紅色／酒紅主體、香檳金、暖象牙白、深酒紅描邊與圓潤立體高光；Promotion 禮盒已移除愛心。新版透明圖檔 `*-v2.png`（Invite 獎盃使用紅色杯身 `nav-invite-v3.png`）存放在 `public/assets/ipa/`（導航與客服 256px，動畫素材 512px），高解析原稿及完整提示詞保存在 `design/ipa-icons/gold-v2/`。搜尋放大鏡沿用可編輯 SVG 結構，使用相同紅金與象牙白漸層，另存為 `search-shortcut-v2.svg`。`src/data/ipaIcons.js` 供 Jito 首頁與 Jito Design 圖示庫共用；轉盤旋轉、寶箱開合與禮盒彈跳保留，BR893 仍使用原有圖示與配色。

`design/reference-assets.json` 記錄於 2026-10-27 從公開首頁讀取的素材來源；`design/asset-sources.json` 對照來源與本機路徑。需要重新取得參考素材時執行 `npm run assets:sync`。這些素材用於此專案的首頁設計參考。
