# قواعد دامین، عملیات کارخانه و سخت‌افزار (StoreMesh Domain Rules)

تمام قوانین زیر مستقیماً در هسته `apps/site-server/src/domain.js` و ماژول‌های کلاینت پیاده‌سازی شده‌اند و **هیچ رابط کاربری نباید آن‌ها را دور بزند**.

---

## ۱. گیت‌های فیزیکی کانتینرها و سبدها (`CONTAINER_GATES`)

هر عملیات خط تولید فقط با اسکن فیزیکی کانتینر مجاز در زون و وضعیت درست پذیرفته می‌شود:

| عملیات | نوع کانتینر مجاز | زون مجاز | وضعیت کانتینر | وضعیت Batch |
|---|---|---|---|---|
| `RECEIVE` | `BASKET`, `CRATE`, `SINGLE_USE` | `RECEIVING` | `AVAILABLE` (و خالی) | — |
| `SORT` | `BASKET`, `CRATE`, `SINGLE_USE` | `COLD_ROOM_CLEAN`, `COLD_ROOM_DIRTY` | `IN_USE` | `RECEIVED` |
| `WASH` | `BASKET`, `CRATE` | `WASHING` | `READY_FOR_WASHING` | `SORTED` |
| `SLICE` | `BASKET`, `CRATE` | `SLICING` | `WASHED` | `WASHED` |
| `FREEZE` | `TRAY` (فقط اسکن سینی) | `FREEZING` | `SLICED` | `SLICED` |
| `FREEZE_DRY` | `TRAY` | `FREEZE_DRYING` | `FROZEN` | `FROZEN` |
| `DRY` | `BASKET`, `CRATE`, `TRAY` | `DRYING` | `READY_FOR_DRYING` | `SORTED`, `SLICED` |
| `FRESH_EXPORT` | `BASKET`, `CRATE` | `FRESH_EXPORT` | `SORTED`, `IN_USE` | `SORTED` |

### قوانین بهداشتی و سردخانه
- به محض ورود کانتینر به `WASHING`، پرچم `hasWashedHistory = true` فعال می‌شود.
- بازگرداندن کانتینر شسته‌شده به سردخانه (`COLD_ROOM_CLEAN`, `COLD_ROOM_DIRTY`, `COLD_ROOM`) خطای حسابرسی `WASHED_CONTAINER_COLD_ROOM_DEVIATION` و استثنای `HIGH` ثبت می‌کند.
- تطبیق نداشتن زون مقصد با `designatedZones` کانتینر، استثنای `CONTAINER_ZONE_MISMATCH` می‌سازد.

---

## ۲. قوانین کنترل کیفیت (QC) و قرنطینه

- **گیت اجباری چک‌لیست:** اگر برای `(product, stage)` یک `qcChecklist` فعال تعریف شده باشد، بچ بدون ثبت نتیجه `APPROVED` قابل استفاده در مراحل بعدی یا ارسال نیست (`assertBatchUsable`).
- **شواهد و امضای بازرس (`assertQcAttestation`):** ثبت نتیجه QC نیازمند تطابق نقش کاربر، پاسخ به همه آیتم‌های الزامی چک‌لیست و ثبت امضای صریح است.
- **قرنطینه (`QUARANTINED`):** وضعیت و زون قبلی در `preQuarantineStatus` و `preQuarantineZone` ذخیره می‌شود، بچ و کانتینر به زون `QUARANTINE` منتقل می‌شوند و استثنای `HIGH` با نوع `QUALITY_QUARANTINE` باز می‌شود.
- **آزادسازی قرنطینه (`releaseQuarantine`):** فقط با نقش مجاز کیفیت/مدیر، ثبت علت، و بررسی مسیر مجاز زون بعدی (`forwardZones`) انجام می‌شود.

---

## ۳. قوانین بسته‌بندی، اقلام مصرفی و صادرات تازه

- **بسته‌بندی دو سطحی:** ابتدا `UNIT` (با ترازوی الزامی و تلورانس وزن پیکربندی‌شده در سایت) و سپس مونتاژ داخل `CARTON` فقط با اسکن فیزیکی `UNIT`ها.
- **کسر خودکار اقلام مصرفی (`Consumables`):**
  - ساخت `CARTON` به‌طور خودکار موجودی `CARTON` را کسر می‌کند.
  - تأیید `Fresh Shipping Box` موجودی `EPS_BOX` و `GEL_PACK` را کسر می‌کند.
  - در صورت کمبود موجودی، عملیات با خطای `409 CONSUMABLE_SHORTAGE` متوقف و استثنای `HIGH` ثبت می‌شود.
  - **بازگشت موجودی (`REVERSAL`):** فقط در حالت لغو (`CANCEL`) موجودی به انبار برمی‌گردد؛ در حالت آسیب (`DAMAGE`) موجودی مصرف‌شده برگشت نمی‌خورد.

---

## ۴. ردیابی شجره (Genealogy) و فراخوان (Recall)

- **ردیابی به عقب (`trace`):** پیمایش گراف `parentIds` با تشخیص حلقه (`GENEALOGY_CYCLE_DETECTED`) و والد مفقود (`GENEALOGY_PARENT_MISSING`).
- **ردیابی به جلو (`traceForward` و `recallAnalysis`):** تفکیک کامل اقلام باقیمانده در انبار از اقلام ارسال‌شده به مشتریان نهایی، همراه با توقف صریح در مرز انتقال بین‌سایتی (`crossesTransferBoundary: true`).

---

## ۵. قواعد سخت‌افزاری کلاینت‌ها (Terminal & PDA)

1. **اسکنر فیزیکی (`scanner-capture.js`):**
   - فیلدهای `[data-scanner-input]` دارای `readOnly = true` و `inputMode = 'none'` هستند (جلوگیری از کیبورد مجازی و تایپ دستی).
   - فقط رویدادهای معتبر (`event.isTrusted === true`) با فاصله زمانی کاراکترهای کمتر از `maxGapMs` (پیش‌فرض `80ms`) و پایان `Enter` پذیرفته می‌شوند.
2. **ثبت دستگاه (`deviceId`):**
   - هر نشست عملیاتی (`POST /api/sessions`) نیازمند `deviceId` ثبت‌شده و `ACTIVE` در جدول `devices` سایت است (در غیر این صورت `403 DEVICE_NOT_ACTIVE`).
3. **پیمان آفلاین PDA (`OfflineQueue`):**
   - هر عملیات آفلاین با یک `Idempotency-Key` یکتا (`UUID`) در `localStorage` صف می‌شود و **کلاینت تا پیش از تأیید قطعی سرور، موفقیت نهایی را اعلام نمی‌کند**.
4. **چاپ و باسکول:**
   - تمام چاپ‌های ناموفق با کدهای ساختاریافته (`PRINT_REASON_CODES`) ثبت شده و Retry نیازمند اسکن مجدد لیبل یا کد خطاست.
