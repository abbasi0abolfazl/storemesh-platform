# نقشه راه، اولویت‌ها و چک‌لیست Go / No-Go پروژه StoreMesh

## فاز ۰ — رفع خطاهای مسدودکننده فوری (P0)
- [ ] **اصلاح Crash پنل وب (`apps/web/app.js`):**
  - رفع `ReferenceError: units is not defined` در `case 'packaging'` (خط ۱۳۷)
  - رفع `TypeError: state.user.roles` در `case 'quality'` هنگام وجود قرنطینه (خط ۱۳۲)
- [ ] **اصلاح مسیرهای Docker و CI پس از یکپارچه‌سازی Monorepo:**
  - تغییر `../storemesh-*` به `../apps/*` در `infrastructure/docker-compose.yml`
  - به‌روزرسانی `e2e/.github/workflows/ci.yml` برای اجرای مستقیم از روی Monorepo به جای چک‌اوت ۷ مخزن جداگانه

---

## فاز ۱ — پایدارسازی سخت‌افزار، PDA و رابط کاربری (P1)
- [ ] **حذف وزن دمو `12.5 kg` در Terminal (`apps/terminal/terminal-ui.js:5,27`):** مسدودکردن ثبت دریافت در نبود `storemeshScaleController` (مگر در حالت دمو صریح)
- [ ] **رفع Head-of-Line Blocking در صف آفلاین PDA (`apps/pda/queue.js:6`):** جداسازی خطاهای دائمی `4xx` به Dead-letter و نمایش وضعیت خطا در `apps/pda/app.js:21`
- [ ] **اصلاح PWA در PDA:** حذف کش کردن `/api/*` در `apps/pda/service-worker.js:9` و افزودن آیکون‌های استاندارد در `apps/pda/manifest.json`
- [ ] **اصلاح چیدمان منوی PDA (`apps/pda/style.css`):** تطبیق گرید ناوبری با ۶ دکمه و حذف وابستگی به Google Fonts آنلاین (`Vazirmatn`)
- [ ] **پشتیبانی از پورت استاندارد `443` HTTPS در کلاینت‌ها:** رفع شرط محدودکننده `location.port === '8443'` در `web`، `terminal` و `pda`

---

## فاز ۲ — امنیت، پایگاه داده و تکمیل فیچرهای خط تولید (P1)
- [ ] **امنیت احراز هویت و Cloud:** افزودن Lockout برای `loginBadge` (`apps/site-server/src/auth.js:67`)، Rate-Limit روی Login و محدودیت حجم Request Body در `apps/cloud/src/server.js:17`
- [ ] **هم‌ترازی کامل `PostgresRepository` و پاک‌سازی Migrationها:** ثبت فیلدهای جامانده از `domain.js`، استفاده از `this.changed()` در `save()` و یکتاسازی شماره فایل‌های تکراری `053`–`056`
- [ ] **پیاده‌سازی جریان Fresh Export در Terminal و PDA (FR-120):** تکمیل رابط کاربری و تست‌های مربوطه برای اپراتور کف کارخانه
- [ ] **مدیریت تغییرنام `deviceId` برای PDAهای واقعی:** فراهم کردن ثبت سریع یا Pre-provisioning دستگاه‌ها

---

## فاز ۳ — دوآپس، مشاهده‌پذیری و نگهداشت (P2/P3)
- [ ] افزودن سرویس بکاپ برای `cloud-db` و تنظیم `HEALTHCHECK` در `infrastructure/docker-compose.yml`
- [ ] پیاده‌سازی `/metrics` در `apps/cloud/src/server.js` و اضافه کردن به `infrastructure/monitoring/prometheus.yml`
- [ ] رفع آسیب‌پذیری CSV Formula Injection در `apps/cloud/src/event-export.js` (FR-121)
- [ ] رفع `try/catch` در `verify()` فایل `auth.js` (جلوگیری از `500` روی JWT خراب) و اصلاح CORS قابل پیکربندی در `site-server`
- [ ] فرمت‌دهی و ماژولارسازی `domain.js` (۲۷۷ KB) و `web/app.js` (۱۵۵ KB)
- [ ] اتصال تدریجی صفحات `apps/figma-make-ui/` به API واقعی بدون انتقال منطق mock

---

## چک‌لیست Go / No-Go پیش از استقرار نهایی کارخانه
- [ ] رفع کامل هر دو باگ P0 در `apps/web/app.js` و `infrastructure/docker-compose.yml`
- [ ] پاس شدن ۱۰۰٪ تست‌های `site-server`، `cloud`، `web`، `contracts` و `e2e` روی **PostgreSQL 17 واقعی با صفر تست Skip‌شده**
- [ ] تست میدانی اسکنر Keyboard-Wedge، باسکول RS232/USB و پرینتر لیبل ZPL روی شبکه HTTPS داخلی کارخانه
- [ ] جایگزینی تمام سکرت‌های `.env` و غیرفعال‌سازی یا محدودسازی حساب‌های `bootstrap`
