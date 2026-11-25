# راهنمای راه‌اندازی، استقرار و داده‌های تستی (StoreMesh)

## ۱. اجرای محلی و شبکه داخلی (بدون نیاز به Docker/PostgreSQL)

در ریشه پروژه، یک لانچر بومی Node.js آماده شده که از `JsonRepository` استفاده می‌کند و تمام ۶ سرویس را همزمان روی `0.0.0.0` بالا می‌آورد:

- **اجرای یکپارچه کل سامانه:**
  ```bash
  ./scripts/start-all.sh
  ```
- **بررسی سلامت (Health Check) تمام پورت‌ها:**
  ```bash
  ./scripts/verify-stack.sh
  ```
- **تزریق داده‌های آزمایشی کامل (محصولات، تأمین‌کنندگان، سبدها، محموله‌ها، بچ‌ها، اقلام مصرفی، تسک‌ها، QC، استثناها، سفارش‌ها و رویدادهای Cloud):**
  ```bash
  ./scripts/seed-data.sh
  ```

---

## ۲. آدرس‌های دسترسی سرویس‌ها

| سرویس | آدرس عمومی نمونه (`ppo` با HTTPS) | آدرس محلی / LAN |
|---|---|---|
| **Figma Make Interactive UI (۱۳ ایستگاه)** | `https://ppo.recipex.ai:8443/` | `http://localhost:8443` |
| **پنل وب مدیریت (Web Console)** | `https://ppo.recipex.ai:8443/web/` | `http://localhost:8080` |
| **ترمینال ایستگاهی کارخانه (Terminal)** | `https://ppo.recipex.ai:8443/terminal/` | `http://localhost:8081` |
| **هندهلد سیار (PDA PWA)** | `https://ppo.recipex.ai:8443/pda/` | `http://localhost:8082` |
| **Site Server API (سایت ایران)** | `https://ppo.recipex.ai:8443/health` | `http://localhost:3000/health` |
| **Cloud Aggregator API** | `https://ppo.recipex.ai:8443/cloud/health` | `http://localhost:4000/health` |

### اطلاعات ورود دمو / توسعه
- **اپراتور خط و PDA:** نام کاربری `operator` / رمز `operator-demo` *(شناسه دستگاه نمونه: `PDA-PACK-01`)*
- **مدیر سیستم (Web Console):** نام کاربری `admin` / رمز `storemesh-demo`

---

## ۳. راهنمای اتصال PDA واقعی در کارخانه
1. گوشی یا هندهلد صنعتی اندرویدی (Zebra/Honeywell) را به وای‌فای داخلی متصل کنید و آدرس HTTPS کلاینت PDA (`/pda/`) را در کروم باز کنید.
2. اسکنر دستگاه را روی حالت **Keyboard-Wedge** با پسوند **Enter** تنظیم کنید.
3. شناسه دستگاه (`localStorage.deviceId`) را در پنل وب (`/web/`) به عنوان دستگاه `ACTIVE` ثبت کنید (یا برای تست سریع از `PDA-PACK-01` استفاده کنید).

---

## ۴. استقرار با Docker Compose و PostgreSQL 17 (محیط Staging / کارخانه)
پس از اطمینان از هم‌ترازی مسیرهای `../apps/*` در `infrastructure/docker-compose.yml`:
```bash
cd infrastructure
cp .env.example .env
# جایگزینی تمام مقادیر replace- با کلیدهای تصادفی قوی
docker compose --env-file .env up -d --build
docker compose ps
```
