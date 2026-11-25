# Engineering & Agent Rules (StoreMesh Monorepo)

## ۱. قوانین طلایی قرارداد و تغییرناپذیری

1. **تطابق قراردادها (`packages/contracts`):**
   - پیش از تغییر یا افزودن هر Endpoint در `apps/site-server` یا `apps/cloud`، ابتدا `packages/contracts/openapi/storemesh.yaml` (یا `storemesh-cloud.yaml`) را به‌روزرسانی کنید و مطمئن شوید دستور زیر پاس می‌شود:
     ```bash
     cd packages/contracts && pnpm test
     ```
2. **تغییرناپذیری رویدادها (`Audit & Outbox`):**
   - هیچ `UPDATE` یا `DELETE` مستقیم روی `audit_events` و `event_history_archive` مجاز نیست (تریگر `enforce_append_only_history` مانع آن می‌شود).
   - هر عملیات تغییردهنده وضعیت باید با `Idempotency-Key` (حداکثر ۱۲۸ کاراکتر) از طریق `StoreMesh.run()` اجرا شود.
3. **جلوگیری از انتقال Mock به Production:**
   - منطق شبیه‌ساز `localStorage` در `apps/figma-make-ui/` هرگز نباید به کلاینت‌های رسمی (`apps/web`, `apps/terminal`, `apps/pda`) یا سرور کپی شود. تمام وزن‌ها، اسکن‌ها و اعتبارسنجی‌ها باید از سمت سرور و کنترلرهای سخت‌افزاری تأیید شوند.
4. **هم‌ترازی `PostgresRepository` با `JsonRepository`:**
   - هر فیلد جدیدی که به `this.state` در `apps/site-server/src/domain.js` اضافه می‌شود، باید هم در Migration جدید PostgreSQL و هم در متدهای `load()`/`save()` فایل `postgres-repository.js` نگاشت شود.

---

## ۲. قوانین امنیتی و پایگاه داده

1. **محیط Production (`NODE_ENV=production`):**
   - `AUTH_REQUIRED=true` اجباری است.
   - استفاده از مقادیر پیش‌فرض برای `AUTH_SECRET`، `BOOTSTRAP_ADMIN_PASSWORD`، `SITE_SYNC_KEY`، `TRANSFER_MANIFEST_KEY` (حداقل ۳۲ کاراکتر) و `CLOUD_REPORT_KEY` ممنوع است.
2. **محرمانگی `.env` و داده‌ها:**
   - فایل‌های `.env`، دیتابیس‌های `data/*.json` و کلیدهای SSH/SSL هرگز نباید در Git کامیت شوند.
3. **شماره‌گذاری Migrationها:**
   - هر Migration جدید در `apps/site-server/migrations/` باید شماره ترتیبی **یکتا** و بزرگ‌تر از `080` داشته باشد.

---

## ۳. معیار پذیرش کد و تست (Definition of Done)

- برای تغییرات Backend: پاس شدن ۱۰۰٪ تست‌های `apps/site-server` و `apps/cloud` علیه **PostgreSQL 17 واقعی** (`DATABASE_URL`) با **صفر تست Skip‌شده**.
- برای تغییرات Contracts: پاس شدن تست‌های `packages/contracts` و `route-parity.mjs`.
- برای تغییرات کلاینت (`web`, `terminal`, `pda`): اجرای `node --test` و بررسی عدم وجود خطای XSS (استفاده از `esc()`)، نبود URL هاردکدشده `127.0.0.1` و پشتیبانی از `dir="rtl"`.

---

## ۴. graphify

This project has a knowledge graph at `graphify-out/` with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts.
- Dirty `graphify-out/` files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
