# گزارش ممیزی جامع فنی و معماری پروژه StoreMesh

**تاریخ بررسی:** ۲۶ نوامبر ۲۰۲۶  
**محدوده بررسی:** مخزن یکپارچه `abbasi0abolfazl/storemesh-platform` (برنچ `main`)

---

## ۱. خلاصه اجرایی و امتیاز آمادگی تولید (Production Readiness Score)

هسته منطق کسب‌وکار (`apps/site-server/src/domain.js`) و قراردادهای مسیر (`packages/contracts`) بسیار پخته و دقیق‌اند، اما **سه باگ مسدودکننده (P0)** در زیرساخت Docker/CI مونوریپو و کد فرانت‌اند (`apps/web/app.js`) به همراه **مجموعه‌ای از شکاف‌های بحرانی سخت‌افزار/آفلاین در PDA و Terminal (P1)** مانع ورود مستقیم به محیط کارخانه پیش از رفع آن‌ها هستند.

| حوزه تخصصی | امتیاز (از ۱۰) | وضعیت کلی |
|---|---|---|
| **Domain & Supply Chain** | **۸.۵ / ۱۰** | پوشش کامل جریان کارخانه، بهداشت سردخانه، QC، قرنطینه و ردیابی شجره (Genealogy) |
| **Contracts & API Parity** | **۷.۵ / ۱۰** | ۸۰ تست قرارداد و تطابق ۱۶۲ مسیر Site + ۸ مسیر Cloud سبز؛ فاقد اعتبارسنجی Schema |
| **Security & AppSec** | **۷.۰ / ۱۰** | JWT/RBAC/Audit قوی؛ ضعف در Rate-Limit، قفل نشدن Badge+PIN، و Cloud Body/CSV |
| **Database & Distributed Systems** | **۶.۵ / ۱۰** | Outbox و Optimistic Lock عالی؛ شکاف هم‌ترازی فیلدهای Postgres با JSON و تداخل شماره Migrationها |
| **Hardware, IoT & Edge** | **۵.۵ / ۱۰** | اسکنر `80ms` ریسکی برای بلوتوث، پیش‌فرض وزن `12.5kg` در ترمینال، Head-of-line block در صف PDA |
| **DevOps, SRE & QA** | **۵.۵ / ۱۰** | مسیرهای شکسته در `docker-compose.yml` و `e2e` CI پس از ادغام Monorepo؛ نبود Healthcheck/بکاپ Cloud |
| **Frontend & Industrial UX** | **۵.۰ / ۱۰** | ۲ خطای `ReferenceError`/`TypeError` در `web/app.js`، بریدگی منوی ۶‌تایی PDA، شکاف با Figma Make |

**میانگین کل آمادگی تولید:** **۶.۵ / ۱۰**

---

## ۲. تحلیل از دیدگاه Tech Lead (لید فنی و معمار ارشد)

### الف) معماری، ماژولاریته و خوانایی کد (P1)
- **فشرده‌سازی افقی و God-Class:** فایل `apps/site-server/src/domain.js` با ۵۷۹ خط و حجم **۲۷۷ کیلوبایت** (میانگین ۴۷۹ کاراکتر و حداکثر ۳٬۵۸۶ کاراکتر در یک خط) تمام قوانین دامین را در یک کلاس `StoreMesh` جمع کرده است. همین الگو در `apps/web/app.js` (۳۵۹ خط، ۱۵۵ کیلوبایت، حداکثر ۴٬۲۵۳ کاراکتر در خط) و `apps/site-server/src/server.js` (۲۳۸ خط، ۵۲ کیلوبایت) تکرار شده است.
  - **ریسک:** تداخل شدید در Merge، دشواری Code Review و نگهداری بلندمدت.
  - **راهکار:** فرمت‌دهی استاندارد (Prettier / oxfmt) و شکستن `domain.js` و `web/app.js` به ماژول‌های دامین/صفحه.

### ب) تطابق قراردادها (`packages/contracts/`) (P2)
- اجرای `pnpm test` در `packages/contracts/` با **۸۰/۸۰ پاس** و تطابق ۱۶۲ مسیر Site Server و ۸ مسیر Cloud تأیید شد.
- **شکاف پنهان:** اسکریپت `packages/contracts/scripts/route-parity.mjs` (خطوط ۵۳–۹۸) فقط وجود `METHOD + PATH` و زیررشته `summary` در YAML را چک می‌کند و **تطابق Schema بدنه Request/Response و Status Codeها را اعتبارسنجی نمی‌کند**.

### ج) شکاف Prototype تا Production (`apps/figma-make-ui/`) (P1)
- کل `apps/figma-make-ui/src/` (`WebApp.tsx` با ۴٬۹۱۲ خط، `TerminalApp.tsx` با ۳۴۳ خط، `PDAApp.tsx` با ۵۲۸ خط) **۱۰۰٪ سمت کلاینت و بدون حتی یک فراخوانی `fetch`** است و داده‌ها را در `localStorage` ذخیره می‌کند.
- ۱۳ ایستگاه تعریف‌شده در `TERMINAL_STATIONS` (`WebApp.tsx:4803-4822`) در پروتوتایپ شبیه‌سازی شده‌اند، اما در نسخه رسمی `apps/terminal` و `apps/pda` جریان **صادرات تازه (Fresh Export)** پیاده‌سازی نشده است.

### د) وضعیت Fix Requestهای باز (`docs/fix-requests/`)
- پرونده‌های `91` تا `118` در `docs/fix-requests/open/` و تمام ۶ فایل `docs/fix-requests/needs-decision/` عملاً حل‌شده و stub هستند (به دلیل محدودیت حذف/انتقال روی فایل‌سیستم مبدأ باقی مانده‌اند).
- **۳ پرونده واقعاً باز:**
  1. **FR-119 (P3):** تابع بلااستفاده `harvestPeriodFor` در `apps/site-server/src/domain.js:121` از `Date.UTC` استفاده می‌کند (خطر بازگشت باگ منطقه زمانی در صورت فراخوانی آینده).
  2. **FR-120 (P1):** نبود جریان عملیاتی **Fresh Export** در `apps/terminal/` و `apps/pda/`.
  3. **FR-121 (P2):** نبود محافظت **CSV Formula Injection** در `apps/cloud/src/event-export.js:3-5`.

---

## ۳. یافته‌های تفکیکی ۶ دیدگاه تخصصی

### ۱) مهندس امنیت و کنترل دسترسی (Security / AppSec)
- **[P1] نبود قفل حساب (Lockout) و Rate-Limit در ورود با کارت پرسنلی:** متد `login()` در `apps/site-server/src/auth.js:58-65` پس از ۵ خطا حساب را ۱۵ دقیقه قفل می‌کند، اما `loginBadge()` (`auth.js:67`) تعداد خطای PIN را افزایش نمی‌دهد و هیچ‌یک از دو مسیر `/api/auth/login` و `/api/auth/login-badge` محدودیت نرخ IP (Rate Limit) ندارند.
  - **راهکار:** اعمال شمارنده خطای PIN در `loginBadge()` و اعمال Rate-Limiting در Nginx و سرور.
- **[P1] بافر نامحدود بدنه HTTP در Cloud:** برخلاف Site Server که سقف `REQUEST_BODY_MAX_BYTES = 2 MiB` دارد (`apps/site-server/src/server.js:16`), سرور `apps/cloud/src/server.js:17` کل بدنه را بدون سقف در حافظه جمع می‌کند (ریسک DoS).
  - **راهکار:** اعمال محدودیت حجم بدنه مشابه `site-server`.
- **[P2] آسیب‌پذیری CSV Formula Injection در Cloud:** تابع `csvCell` در `apps/cloud/src/event-export.js:3-5` مقادیر با شروع `=`، `+`، `-`، `@`، `\t` را خنثی نمی‌کند (FR-121).
  - **راهکار:** پیشوندگذاری `'` پیش از این کاراکترها.
- **[P2] کرش `500` روی JWT معیوب و CORS باز `*`:** تابع `verify()` در `apps/site-server/src/auth.js:79-81` در `JSON.parse` هدر/پیلود `try/catch` ندارد (توکن خراب به جای `401` خطای `500` می‌دهد). همچنین `apps/site-server/src/server.js:42` مقدار `Access-Control-Allow-Origin: *` را هاردکد کرده که باید در تولید قابل پیکربندی شود.

### ۲) معمار پایگاه داده و سیستم‌های توزیع‌شده (DB & Distributed Systems)
- **[P1] تداخل شماره Migrationهای PostgreSQL:** در `apps/site-server/migrations/` شماره‌های تکراری `053_`، `054_`، `055_` و `056_` برای فایل‌های متفاوت وجود دارد که ریسک ترتیب اجرا یا خطای ردیابی Migration در ابزارهای استاندارد را بالا می‌برد.
- **[P1] ناهمگونی ذخیره‌سازی `PostgresRepository` با `JsonRepository`:** `apps/site-server/src/postgres-repository.js:13-103` چندین فیلد عملیاتی را ذخیره یا بازیابی نمی‌کند (از جمله `batches.packagingMeasurementId`، `batches.trayAllocationCompletedAt`، `containers.activeCycleId`، `packages.reopenedAt/reopenReason`، `tasks.claimSessionId/completionNote`، `shipments.replacementHistory`). همچنین `save()` روی تمام ردیف‌های جداول مرجع و کانتینرها `UPDATE` بدون فیلتر `this.changed(...)` می‌زند که با رشد داده گلوگاه عملکردی می‌شود.
- **[P2] منطقه زمانی پیش‌فرض `sites.timezone`:** با اینکه `RECEIVING` از timezone پیکربندی‌شده استفاده می‌کند، `harvestPeriod` با تاریخ UTC (`receivedAt.slice(0,10)`) تطبیق داده می‌شود (`domain.js:242`) و در Postgres ستون `sites.timezone` به `'UTC'` هاردکد شده است (`postgres-repository.js:41`).

### ۳) مهندس سخت‌افزار صنعتی، لبه و PWA (Hardware, IoT & Edge)
- **[P1] وزن پیش‌فرض خطرناک `12.5 kg` در مرورگر Terminal:** در `apps/terminal/terminal-ui.js:5,27` اگر کنترلر ترازوی فیزیکی (`storemeshScaleController`) به مرورگر متصل نباشد، فرم دریافت همچنان مقدار اولیه `weight = 12.5` را به سرور ارسال می‌کند. در مقابل، `packaging-ui.js` در نبود کنترلر کاملاً خطا می‌دهد.
  - **راهکار:** مسدودسازی ثبت وزن دریافت هنگام نبود `storemeshScaleController` (به‌جز حالت صریح دمو).
- **[P1] قفل شدن صف آفلاین PDA روی اولین خطا (Head-of-Line Blocking):** در `apps/pda/queue.js:4-6`، اگر یکی از عملیات صف با خطای دائمی `4xx` (مثل `409` یا انقضای `sessionId`) مواجه شود، `flush()` متوقف (`break`) می‌شود و کل عملیات بعدی پشت آن تا ابد گیر می‌کنند؛ ضمناً `apps/pda/app.js:21` نتیجه ناموفق flush را به کاربر نشان نمی‌دهد و محدودیت حجم `localStorage` نیز مدیریت نشده است.
- **[P1] کش شدن پاسخ‌های `/api/` در Service Worker و نبود آیکون PWA:** `apps/pda/service-worker.js:9` همه درخواست‌های `GET` (حتی `/api/*` و پاسخ‌های غیر `ok`) را کش می‌کند و `apps/pda/manifest.json:1` دارای `"icons": []` خالی است که مانع نصب PWA می‌شود.
- **[P2] حساسیت بیش‌ازحد `maxGapMs = 80ms` و نبود Unbind در اسکنر:** اسکنرهای صنعتی بلوتوثی در محیط کارخانه یا هنگام افت فریم مرورگر ممکن است فاصله بین کاراکتر بیش از `80ms` داشته باشند و پیشوند بارکد بی‌صدا حذف شود (`apps/terminal/scanner-capture.js:13`). همچنین در PDA هر `render()` دوباره listener اضافه می‌کند (`apps/pda/app.js:12`).

### ۴) طراح محصول صنعتی و مهندس فرانت‌اند (Frontend & UX)
- **[P0] دو باگ Crash زمان اجرا در پنل وب (`apps/web/app.js`):**
  1. در `apps/web/app.js:137` داخل `case 'packaging':` متغیر `units.length` خوانده شده در حالی که `units` تعریف نشده (`ReferenceError: units is not defined`).
  2. در `apps/web/app.js:132` داخل `case 'quality':` به `state.user.roles` ارجاع شده در حالی که `state` فاقد کلید `user` است (`TypeError` هنگام وجود آیتم قرنطینه).
- **[P1] خرابی نوار ناوبری پایین PDA:** در `apps/pda/index.html:1` تعداد **۶ تب** وجود دارد، اما `apps/pda/style.css:1` گرید `repeat(4, 1fr)` با ارتفاع ثابت `70px` دارد که ۲ دکمه را به ردیف دوم و بیرون از کادر هول می‌دهد.
- **[P2] فونت آنلاین در محیط آفلاین و دیالوگ‌های `prompt()`:** `apps/pda/style.css` فونت `Vazirmatn` را از Google Fonts لود می‌کند (تأخیر/خطا در شبکه داخلی کارخانه) و بخش‌هایی از وب/ترمینال/PDA از `prompt()` و `confirm()` بومی مرورگر استفاده می‌کنند.
- **[P2] وابستگی شرط `port === '8443'` برای Reverse Proxy:** کلاینت‌ها فقط روی پورت `8443` به‌صورت same-origin عمل می‌کنند و روی پورت استاندارد `443` (`location.port === ''`) دوباره سراغ پورت `3000` می‌روند.

### ۵) مهندس تست، پایداری و دوآپس (QA, Reliability & DevOps/SRE)
- **[P0] شکست کامل Build داکر و CI پس از یکپارچه‌سازی Monorepo:**
  - فایل `infrastructure/docker-compose.yml` (خطوط ۲۷، ۴۳، ۵۹، ۹۳، ۱۰۵، ۱۱۰، ۱۱۵) هنوز به مسیرهای `../storemesh-*` اشاره دارد به جای `../apps/*`.
  - ورک‌فلو `e2e/.github/workflows/ci.yml` (خطوط ۱۰–۴۲) هنوز ۷ مخزن جداگانه از `mohaeri` چک‌اوت می‌کند.
- **[P1] نبود بکاپ برای `cloud-db` و نبود Healthcheck سرویس‌ها:** در `docker-compose.yml` فقط دیتابیس‌های سایت‌ها سرویس بکاپ دارند و `cloud-db` بکاپ ندارد؛ هیچ‌کدام از سرویس‌های Node/Nginx نیز `HEALTHCHECK` ندارند و Dockerfileها با کاربر `root` اجرا می‌شوند.
- **[P2] نبود متریک Prometheus در Cloud:** `infrastructure/monitoring/prometheus.yml` فقط ۳ سایت را scrape می‌کند و `apps/cloud` اندپوینت `/metrics` ندارد.
- **[P2] نبود تست UI واقعی (Playwright) و تست PostgreSQL روی این محیط:** تست‌های E2E صرفاً HTTP-level هستند و تست‌های PostgreSQL در `site-server` و `cloud` بدون `DATABASE_URL` رد (Skip) می‌شوند.

### ۶) متخصص عملیات زنجیره تأمین و کنترل کیفیت (Supply Chain & Domain)
- **[P2] ناهمگونی کنترل بهداشت بین `moveContainer` و `moveContainerDirect`:** در `apps/site-server/src/domain.js:270`، جابه‌جایی ظرف شسته‌شده به سردخانه فقط هشدار `WASHED_CONTAINER_COLD_ROOM_DEVIATION` می‌اندازد و مسدود نمی‌شود، و متد `moveContainerDirect` (`domain.js:272`) حتی این هشدار را هم بررسی نمی‌کند.
- **[P1] تکمیل چرخه Fresh Export و مصرف اقلام:** جریان Fresh Export در سرور کامل است (شامل کسر و بازگشت خودکار `EPS_BOX` و `GEL_PACK` هنگام لغو، اما نه هنگام `DAMAGE` که از نظر حسابداری انبار منطقی است)، ولی به دلیل نبود UI در Terminal/PDA (FR-120) اپراتور کف کارخانه عملاً نمی‌تواند از آن استفاده کند.
- **نقاط قوت برجسته دامین:** ردیابی شجره رو به جلو و عقب (`trace` / `traceForward` / `recallAnalysis`) با تشخیص حلقه و تفکیک موجودی انبار از کالای ارسال‌شده به مشتری و مرز انتقال بین‌سایتی، در سطح استانداردهای صنعتی پیاده‌سازی شده است.

---

## ۴. ماتریس اولویت‌بندی‌شده اقدامات (Action Plan) و چک‌لیست Go / No-Go

| اولویت | کد | اقدام مشخص | فایل هدف |
|---|---|---|---|
| **فوری (P0)** | A1 | رفع `ReferenceError: units` و `state.user.roles` | `apps/web/app.js:132,137` |
| **فوری (P0)** | A2 | اصلاح مسیرهای `../apps/*` در `docker-compose.yml` و CI مونوریپو | `infrastructure/docker-compose.yml`, `e2e/.github/workflows/ci.yml` |
| **فاز ۱ (P1)** | B1 | حذف وزن پیش‌فرض `12.5` بدون کنترلر ترازو در Terminal | `apps/terminal/terminal-ui.js:5,27` |
| **فاز ۱ (P1)** | B2 | اصلاح گرید ۶ تایی منوی PDA و حذف فونت آنلاین Google | `apps/pda/style.css`, `apps/pda/manifest.json` |
| **فاز ۱ (P1)** | B3 | اصلاح `OfflineQueue` (جداسازی خطای `4xx` / Dead-letter به جای توقف کل صف) + حذف کش `/api/` از SW | `apps/pda/queue.js`, `apps/pda/service-worker.js` |
| **فاز ۱ (P1)** | B4 | اصلاح `location.port === '8443'` به پشتیبانی از پورت استاندارد HTTPS (`443`) | کلاینت‌های `web`, `terminal`, `pda` |
| **فاز ۲ (P1)** | C1 | افزودن Lockout برای `loginBadge` و سقف Body در `cloud` | `apps/site-server/src/auth.js`, `apps/cloud/src/server.js` |
| **فاز ۲ (P1)** | C2 | تکمیل هم‌ترازی فیلدهای `PostgresRepository` و یکتاسازی شماره Migrationهای `053`–`056` | `apps/site-server/src/postgres-repository.js`, `migrations/` |
| **فاز ۲ (P1)** | C3 | پیاده‌سازی جریان **Fresh Export** در Terminal/PDA (FR-120) | `apps/terminal/`, `apps/pda/` |
| **فاز ۳ (P2)** | D1 | افزودن بکاپ `cloud-db`، `/metrics` برای Cloud، محافظ CSV (FR-121) و تست کامل با PostgreSQL 17 واقعی | `infrastructure/`, `apps/cloud/` |

### چک‌لیست Go / No-Go پیش از استقرار در کارخانه
- [ ] **No-Go** تا زمانی که باگ‌های `ReferenceError` / `TypeError` در `apps/web/app.js` برطرف نشوند.
- [ ] **No-Go** تا زمانی که `terminal-ui.js` در نبود ترازو اجازه ثبت `12.5 kg` بدهد و `OfflineQueue` در PDA با یک خطای 4xx مسدود شود.
- [ ] **Go** فقط پس از اجرای ۱۰۰٪ تست‌های `site-server`، `cloud`، `web` و `e2e` علیه **PostgreSQL 17 واقعی با صفر تست Skip‌شده** و انجام تست میدانی اسکنر/ترازو/پرینتر روی شبکه HTTPS کارخانه.
