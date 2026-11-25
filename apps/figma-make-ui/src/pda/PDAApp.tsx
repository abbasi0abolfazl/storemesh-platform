import { useState } from "react";

type PDAScreen = "login" | "role" | "scan" | "inventory" | "tasks" | "shipping" | "consumables" | "queue" | "transfer";

const tabs: { screen: PDAScreen; label: string; icon: string }[] = [
  { screen: "scan", label: "اسکن", icon: "⌗" },
  { screen: "tasks", label: "کارها", icon: "☑" },
  { screen: "inventory", label: "موجودی", icon: "⊟" },
  { screen: "consumables", label: "مصرفی", icon: "◧" },
  { screen: "transfer", label: "انتقال", icon: "⇄" },
];

function PDACard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#d8e4df] shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function PDAGreenBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#176b50] text-white rounded-xl px-4 py-3 text-[15px] font-['Vazirmatn:Bold',sans-serif] font-bold hover:bg-[#14573f] transition-colors"
      dir="rtl"
    >
      {children}
    </button>
  );
}

function PDAInputField({ label, placeholder, type = "text" }: { label: string; placeholder?: string; type?: string }) {
  return (
    <div className="flex flex-col gap-1.5" dir="rtl">
      <label className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">{label}</label>
      <input
        type={type}
        className="bg-[#fbfdfc] border border-[#cbd8d2] rounded-xl px-4 py-3 text-[14px] font-['Vazirmatn:Regular',sans-serif] text-[#18302a] focus:outline-none focus:border-[#176b50] w-full"
        placeholder={placeholder || label}
        dir="rtl"
      />
    </div>
  );
}

function PDABadge({ text, color, bg }: { text: string; color: string; bg: string }) {
  return (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-['Vazirmatn:ExtraBold',sans-serif] font-extrabold" style={{ color, background: bg }}>
      {text}
    </span>
  );
}

/* ─── LOGIN SCREEN ─── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#133a31] p-6 justify-center items-center gap-6">
      <div className="bg-[#c6a45c] rounded-2xl flex items-center justify-center mb-2" style={{ width: 64, height: 64 }}>
        <span className="font-['Vazirmatn:ExtraBold',sans-serif] font-extrabold text-white text-[18px]">SM</span>
      </div>
      <div className="text-center">
        <p className="font-['Vazirmatn:Regular',sans-serif] text-[#adc8bf] text-[12px] tracking-widest mb-1">STOREMESH PDA</p>
        <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-white text-[22px]" dir="rtl">ورود اپراتور</h2>
      </div>
      <PDACard className="w-full p-5">
        <div className="space-y-4" dir="rtl">
          <PDAInputField label="شناسه کاربری" placeholder="کد پرسنلی یا ایمیل" />
          <PDAInputField label="رمز عبور" type="password" placeholder="رمز عبور" />
          <PDAGreenBtn onClick={onLogin}>ورود به سیستم</PDAGreenBtn>
        </div>
      </PDACard>
      <p className="font-['Vazirmatn:Regular',sans-serif] text-[#5c8d7d] text-[11px]" dir="rtl">StoreMesh · نسخه ۳.۲.۱</p>
    </div>
  );
}

/* ─── ROLE SCREEN ─── */
function RoleScreen({ onSelect }: { onSelect: () => void }) {
  const roles = [
    { label: "اپراتور دریافت", desc: "ثبت ورود و توزین", color: "#dff3e9", tc: "#176b50" },
    { label: "مسئول QC", desc: "بررسی کیفیت نمونه‌ها", color: "#e1f2eb", tc: "#16825b" },
    { label: "اپراتور بسته‌بندی", desc: "خطوط بسته‌بندی", color: "#fff0dc", tc: "#c67518" },
    { label: "سرپرست ارسال", desc: "مدیریت محموله‌های خروجی", color: "#e8efec", tc: "#4a7a6a" },
  ];
  return (
    <div className="flex flex-col h-full bg-[#f4f7f5]">
      <div className="bg-[#0f382f] px-5 py-4">
        <p className="font-['Vazirmatn:Regular',sans-serif] text-[#adc8bf] text-[11px]">STOREMESH PDA</p>
        <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-white text-[18px]" dir="rtl">انتخاب نقش</h2>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-auto" dir="rtl">
        <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">نقش خود را برای این شیفت انتخاب کنید:</p>
        {roles.map((role) => (
          <button
            key={role.label}
            onClick={onSelect}
            className="w-full text-right"
          >
            <PDACard className="p-4 hover:border-[#35a17b] transition-colors cursor-pointer">
              <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[15px] mb-1">{role.label}</h4>
              <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[12px]">{role.desc}</p>
            </PDACard>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── SCAN SCREEN ─── */
function ScanScreen() {
  return (
    <div className="flex flex-col h-full bg-[#f4f7f5]">
      <div className="bg-[#0f382f] px-5 py-4">
        <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-white text-[18px]" dir="rtl">اسکن QR</h2>
        <p className="font-['Vazirmatn:Regular',sans-serif] text-[#adc8bf] text-[12px]" dir="rtl">اسکن سریع ظرف یا محموله</p>
      </div>
      <div className="flex-1 p-4 overflow-auto" dir="rtl">
        {/* Scanner area */}
        <PDACard className="p-6 mb-4 flex flex-col items-center gap-4">
          <div className="w-40 h-40 border-4 border-[#176b50] rounded-2xl flex items-center justify-center bg-[#f4f7f5] relative">
            <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#176b50] rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#176b50] rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-[#176b50] rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#176b50] rounded-br-lg" />
            <span className="text-[#adc8bf] text-[13px] font-['Vazirmatn:Regular',sans-serif]">دوربین فعال</span>
          </div>
          <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px] text-center">کد QR را جلوی دوربین قرار دهید</p>
        </PDACard>

        {/* Manual entry */}
        <PDACard className="p-4 mb-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[14px] mb-3">ورود دستی</h4>
          <PDAInputField label="شناسه ظرف یا محموله" placeholder="مثال: CTR-012" />
          <div className="mt-3">
            <PDAGreenBtn>تأیید</PDAGreenBtn>
          </div>
        </PDACard>

        {/* Recent scans */}
        <PDACard className="p-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px] mb-3">اسکن‌های اخیر</h4>
          <div className="space-y-2">
            {[
              { id: "CTR-012", type: "ظرف", time: "۵ دقیقه پیش", sc: "#16825b", sb: "#dff3e9" },
              { id: "REC-047", type: "دریافت", time: "۱۲ دقیقه پیش", sc: "#c67518", sb: "#fff0dc" },
              { id: "CTR-011", type: "ظرف", time: "۲۰ دقیقه پیش", sc: "#16825b", sb: "#dff3e9" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-[#edf2ef]">
                <div>
                  <span className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px]">{item.id}</span>
                  <span className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[11px] mr-2">{item.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[11px]">{item.time}</span>
                  <PDABadge text="OK" color={item.sc} bg={item.sb} />
                </div>
              </div>
            ))}
          </div>
        </PDACard>
      </div>
    </div>
  );
}

/* ─── INVENTORY (MOBILE) SCREEN ─── */
function InventoryMobileScreen() {
  return (
    <div className="flex flex-col h-full bg-[#f4f7f5]">
      <div className="bg-[#0f382f] px-5 py-4">
        <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-white text-[18px]" dir="rtl">موجودی سیار</h2>
        <p className="font-['Vazirmatn:Regular',sans-serif] text-[#adc8bf] text-[12px]" dir="rtl">بررسی موجودی در محل</p>
      </div>
      <div className="flex-1 p-4 overflow-auto" dir="rtl">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "کل موجودی", value: "۱۸۶t", sc: "#16825b" },
            { label: "هشدار کمبود", value: "۳", sc: "#c64545" },
          ].map((s) => (
            <PDACard key={s.label} className="p-3 text-right">
              <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[11px] mb-1">{s.label}</p>
              <p className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[24px]" style={{ color: s.sc }}>{s.value}</p>
            </PDACard>
          ))}
        </div>

        <PDACard className="p-4 mb-3">
          <PDAInputField label="⌗ اسکن یا جستجو" placeholder="نام محصول یا شناسه" />
        </PDACard>

        <div className="space-y-2">
          {[
            { name: "تماتو A", qty: "۴۵,۰۰۰ kg", loc: "انبار ۱ - قفسه A3", sc: "#16825b", sb: "#dff3e9" },
            { name: "خیار B", qty: "۲۸,۵۰۰ kg", loc: "انبار ۱ - قفسه B1", sc: "#16825b", sb: "#dff3e9" },
            { name: "فلفل دلمه", qty: "۱۲,۸۰۰ kg", loc: "انبار ۲ - قفسه C2", sc: "#c67518", sb: "#fff0dc" },
            { name: "بادمجان A", qty: "۸,۴۰۰ kg", loc: "انبار ۱ - قفسه D4", sc: "#16825b", sb: "#dff3e9" },
          ].map((item, i) => (
            <PDACard key={i} className="p-3">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[14px]">{item.name}</h4>
                <PDABadge text={item.qty} color={item.sc} bg={item.sb} />
              </div>
              <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[12px]">{item.loc}</p>
            </PDACard>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── TASKS (PDA) SCREEN ─── */
function TasksMobileScreen() {
  return (
    <div className="flex flex-col h-full bg-[#f4f7f5]">
      <div className="bg-[#0f382f] px-5 py-4">
        <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-white text-[18px]" dir="rtl">کارهای من</h2>
        <p className="font-['Vazirmatn:Regular',sans-serif] text-[#adc8bf] text-[12px]" dir="rtl">علی رضایی · اپراتور دریافت</p>
      </div>
      <div className="flex-1 p-4 overflow-auto" dir="rtl">
        <div className="flex gap-2 mb-4">
          {["همه", "باز", "در حال انجام", "تکمیل"].map((f, i) => (
            <button key={f} className={`px-3 py-1.5 rounded-full text-[11px] font-['Vazirmatn:Regular',sans-serif] ${i === 0 ? "bg-[#176b50] text-white" : "bg-[#e8efec] text-[#718079]"}`}>{f}</button>
          ))}
        </div>

        <div className="space-y-3">
          {[
            { id: "TSK-018", type: "توزین دریافت", desc: "سبد CTR-012 آماده توزین", priority: "P4", sc: "#c64545", sb: "#fbe6e6", status: "باز" },
            { id: "TSK-015", type: "انتقال به انبار", desc: "محموله REC-046 به انبار ۱", priority: "P2", sc: "#176b50", sb: "#e1f2eb", status: "در حال انجام" },
            { id: "TSK-013", type: "تأیید دریافت", desc: "مستندات تأمین‌کننده الف", priority: "P3", sc: "#c67518", sb: "#fff0dc", status: "باز" },
            { id: "TSK-011", type: "چاپ لیبل", desc: "۱۵ لیبل برای CTR-010", priority: "P1", sc: "#35a17b", sb: "#dff3e9", status: "تکمیل" },
          ].map((task, i) => (
            <PDACard key={i} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[11px]">{task.id}</span>
                <PDABadge text={task.priority} color={task.sc} bg={task.sb} />
              </div>
              <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[14px] mb-1">{task.type}</h4>
              <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[12px] mb-3">{task.desc}</p>
              {task.status !== "تکمیل" && (
                <button className="w-full bg-[#176b50] text-white rounded-xl py-2 text-[13px] font-['Vazirmatn:Bold',sans-serif] hover:bg-[#14573f]">
                  {task.status === "باز" ? "شروع کار" : "تکمیل کار"}
                </button>
              )}
            </PDACard>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SHIPPING (PDA) SCREEN ─── */
function ShippingMobileScreen() {
  return (
    <div className="flex flex-col h-full bg-[#f4f7f5]">
      <div className="bg-[#0f382f] px-5 py-4">
        <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-white text-[18px]" dir="rtl">ارسال</h2>
        <p className="font-['Vazirmatn:Regular',sans-serif] text-[#adc8bf] text-[12px]" dir="rtl">بارگیری و تأیید ارسال</p>
      </div>
      <div className="flex-1 p-4 overflow-auto" dir="rtl">
        <PDACard className="p-4 mb-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[14px] mb-3">اسکن برای بارگیری</h4>
          <PDAInputField label="⌗ اسکن QR محموله" placeholder="شناسه محموله" />
          <div className="mt-3">
            <PDAGreenBtn>تأیید بارگیری</PDAGreenBtn>
          </div>
        </PDACard>

        <PDACard>
          <div className="p-3 border-b border-[#edf2ef]">
            <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px]">محموله‌های آماده ارسال</h4>
          </div>
          <div className="divide-y divide-[#edf2ef]">
            {[
              { id: "SHP-0081", product: "تماتو A · ۵t", dest: "تهران", status: "آماده", sc: "#35a17b", sb: "#dff3e9" },
              { id: "SHP-0080", product: "خیار · ۳.۲t", dest: "اصفهان", status: "در حال بارگیری", sc: "#c67518", sb: "#fff0dc" },
              { id: "SHP-0079", product: "فلفل · ۱.۸t", dest: "شیراز", status: "آماده", sc: "#35a17b", sb: "#dff3e9" },
            ].map((item, i) => (
              <div key={i} className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px]">{item.id}</span>
                    <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[12px]">{item.product} · {item.dest}</p>
                  </div>
                  <PDABadge text={item.status} color={item.sc} bg={item.sb} />
                </div>
              </div>
            ))}
          </div>
        </PDACard>
      </div>
    </div>
  );
}

/* ─── CONSUMABLES (PDA) SCREEN ─── */
function ConsumablesMobileScreen() {
  return (
    <div className="flex flex-col h-full bg-[#f4f7f5]">
      <div className="bg-[#0f382f] px-5 py-4">
        <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-white text-[18px]" dir="rtl">اقلام مصرفی</h2>
        <p className="font-['Vazirmatn:Regular',sans-serif] text-[#adc8bf] text-[12px]" dir="rtl">درخواست و تحویل مواد مصرفی</p>
      </div>
      <div className="flex-1 p-4 overflow-auto" dir="rtl">
        <PDACard className="p-4 mb-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[14px] mb-3">درخواست قلم مصرفی</h4>
          <div className="space-y-3">
            <PDAInputField label="نام قلم" placeholder="انتخاب از لیست..." />
            <PDAInputField label="مقدار درخواستی" type="number" />
            <PDAGreenBtn>ثبت درخواست</PDAGreenBtn>
          </div>
        </PDACard>

        <div className="space-y-2">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px] mb-2">موجودی اقلام مصرفی</h4>
          {[
            { name: "سلفون بسته‌بندی", qty: "۴۵ رول", status: "کافی", sc: "#16825b", sb: "#dff3e9" },
            { name: "کارتن ۵kg", qty: "۱۲۰ عدد", status: "کم", sc: "#c67518", sb: "#fff0dc" },
            { name: "تسمه پلاستیک", qty: "۸ رول", status: "بحرانی", sc: "#c64545", sb: "#fbe6e6" },
            { name: "برچسب قیمت", qty: "۵۰۰ برگ", status: "کافی", sc: "#16825b", sb: "#dff3e9" },
          ].map((item, i) => (
            <PDACard key={i} className="p-3 flex justify-between items-center">
              <div>
                <h5 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px]">{item.name}</h5>
                <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[12px]">{item.qty}</p>
              </div>
              <PDABadge text={item.status} color={item.sc} bg={item.sb} />
            </PDACard>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── QUEUE (PDA) SCREEN ─── */
function QueueScreen() {
  return (
    <div className="flex flex-col h-full bg-[#f4f7f5]">
      <div className="bg-[#0f382f] px-5 py-4">
        <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-white text-[18px]" dir="rtl">صف آفلاین</h2>
        <p className="font-['Vazirmatn:Regular',sans-serif] text-[#adc8bf] text-[12px]" dir="rtl">داده‌های در انتظار ارسال به سرور</p>
      </div>
      <div className="flex-1 p-4 overflow-auto" dir="rtl">
        <PDACard className="p-3 mb-4 flex justify-between items-center">
          <div>
            <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[12px]">وضعیت اتصال</p>
            <p className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#c64545] text-[14px]">آفلاین</p>
          </div>
          <div className="text-center">
            <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[11px]">رکوردهای در انتظار</p>
            <p className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[20px]">۷</p>
          </div>
          <button className="bg-[#176b50] text-white rounded-xl px-3 py-2 text-[12px] font-['Vazirmatn:Bold',sans-serif]">همگام‌سازی</button>
        </PDACard>

        <div className="space-y-2">
          {[
            { type: "توزین سبد", id: "CTR-013", time: "۱۴:۳۵", status: "در انتظار" },
            { type: "تأیید QC", id: "QC-009", time: "۱۴:۳۲", status: "در انتظار" },
            { type: "ثبت دریافت", id: "REC-048", time: "۱۴:۲۸", status: "در انتظار" },
            { type: "چاپ لیبل", id: "LBL-022", time: "۱۴:۱۵", status: "در انتظار" },
            { type: "درخواست مصرفی", id: "CON-007", time: "۱۳:۵۰", status: "در انتظار" },
          ].map((item, i) => (
            <PDACard key={i} className="p-3 flex justify-between items-center">
              <div>
                <h5 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px]">{item.type}</h5>
                <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[12px]">{item.id} · {item.time}</p>
              </div>
              <PDABadge text={item.status} color="#c67518" bg="#fff0dc" />
            </PDACard>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── TRANSFER (PDA) SCREEN ─── */
function TransferMobileScreen() {
  return (
    <div className="flex flex-col h-full bg-[#f4f7f5]">
      <div className="bg-[#0f382f] px-5 py-4">
        <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-white text-[18px]" dir="rtl">انتقال داخلی</h2>
        <p className="font-['Vazirmatn:Regular',sans-serif] text-[#adc8bf] text-[12px]" dir="rtl">جابجایی موجودی بین مکان‌ها</p>
      </div>
      <div className="flex-1 p-4 overflow-auto" dir="rtl">
        <PDACard className="p-4 mb-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[14px] mb-3">ثبت انتقال</h4>
          <div className="space-y-3">
            <PDAInputField label="⌗ اسکن QR ظرف" placeholder="شناسه ظرف" />
            <PDAInputField label="مکان مبدأ" placeholder="انتخاب مکان..." />
            <PDAInputField label="مکان مقصد" placeholder="انتخاب مکان..." />
            <PDAInputField label="مقدار (kg)" type="number" />
            <PDAGreenBtn>ثبت انتقال</PDAGreenBtn>
          </div>
        </PDACard>

        <PDACard>
          <div className="p-3 border-b border-[#edf2ef]">
            <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px]">انتقال‌های اخیر</h4>
          </div>
          <div className="divide-y divide-[#edf2ef]">
            {[
              { id: "INT-001", from: "انبار ۱ / A3", to: "خط بسته‌بندی ۱", qty: "۵۰۰ kg", status: "تکمیل" },
              { id: "INT-002", from: "دریافت", to: "انبار ۱ / B2", qty: "۸۰۰ kg", status: "در حال انجام" },
            ].map((item, i) => (
              <div key={i} className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px]">{item.id}</span>
                    <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[11px]">{item.from} ← {item.to}</p>
                    <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[11px]">{item.qty}</p>
                  </div>
                  <PDABadge text={item.status} color={item.status === "تکمیل" ? "#16825b" : "#c67518"} bg={item.status === "تکمیل" ? "#dff3e9" : "#fff0dc"} />
                </div>
              </div>
            ))}
          </div>
        </PDACard>
      </div>
    </div>
  );
}

/* ─── BOTTOM TAB BAR ─── */
function BottomTabs({
  active,
  onSelect,
  onQueue,
}: {
  active: PDAScreen;
  onSelect: (s: PDAScreen) => void;
  onQueue: () => void;
}) {
  return (
    <div className="bg-white border-t border-[#d8e4df] flex shrink-0">
      {tabs.map((tab) => (
        <button
          key={tab.screen}
          onClick={() => onSelect(tab.screen)}
          className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${
            active === tab.screen ? "text-[#176b50]" : "text-[#718079]"
          }`}
        >
          <span className="text-[18px]">{tab.icon}</span>
          <span className="font-['Vazirmatn:Regular',sans-serif] text-[10px]">{tab.label}</span>
          {active === tab.screen && (
            <div className="w-1 h-1 rounded-full bg-[#176b50] mt-0.5" />
          )}
        </button>
      ))}
      <button
        onClick={onQueue}
        className={`flex-1 flex flex-col items-center py-3 gap-0.5 relative transition-colors ${
          active === "queue" ? "text-[#176b50]" : "text-[#718079]"
        }`}
      >
        <span className="text-[18px]">⋯</span>
        <span className="font-['Vazirmatn:Regular',sans-serif] text-[10px]">صف</span>
        <div className="absolute top-1.5 right-3 w-4 h-4 bg-[#c64545] rounded-full flex items-center justify-center">
          <span className="font-['Vazirmatn:ExtraBold',sans-serif] text-white text-[8px]">۷</span>
        </div>
      </button>
    </div>
  );
}

export default function PDAApp({ onExit }: { onExit: () => void }) {
  const [pdaScreen, setPDAScreen] = useState<PDAScreen>("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [roleSelected, setRoleSelected] = useState(false);

  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0d2b24]">
        <div className="w-full max-w-sm h-[750px] relative flex flex-col shadow-2xl rounded-3xl overflow-hidden">
          <LoginScreen onLogin={() => { setLoggedIn(true); setPDAScreen("role"); }} />
        </div>
        <button onClick={onExit} className="fixed bottom-4 left-4 bg-[rgba(19,58,49,0.9)] text-[#adc8bf] rounded-full px-4 py-2 text-[12px] font-['Vazirmatn:Regular',sans-serif] hover:text-white">← Hub</button>
      </div>
    );
  }

  if (!roleSelected) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0d2b24]">
        <div className="w-full max-w-sm h-[750px] relative flex flex-col shadow-2xl rounded-3xl overflow-hidden">
          <RoleScreen onSelect={() => { setRoleSelected(true); setPDAScreen("scan"); }} />
        </div>
        <button onClick={onExit} className="fixed bottom-4 left-4 bg-[rgba(19,58,49,0.9)] text-[#adc8bf] rounded-full px-4 py-2 text-[12px] font-['Vazirmatn:Regular',sans-serif] hover:text-white">← Hub</button>
      </div>
    );
  }

  function renderPDAScreen() {
    switch (pdaScreen) {
      case "scan": return <ScanScreen />;
      case "inventory": return <InventoryMobileScreen />;
      case "tasks": return <TasksMobileScreen />;
      case "shipping": return <ShippingMobileScreen />;
      case "consumables": return <ConsumablesMobileScreen />;
      case "queue": return <QueueScreen />;
      case "transfer": return <TransferMobileScreen />;
      default: return <ScanScreen />;
    }
  }

  return (
    <div className="flex items-center justify-center h-full bg-[#0d2b24]">
      <div className="w-full max-w-sm h-[750px] relative flex flex-col shadow-2xl rounded-3xl overflow-hidden border border-[#1d4f40]">
        <div className="flex-1 overflow-hidden flex flex-col">
          {renderPDAScreen()}
        </div>
        <BottomTabs
          active={pdaScreen}
          onSelect={setPDAScreen}
          onQueue={() => setPDAScreen("queue")}
        />
      </div>
      <button onClick={onExit} className="fixed bottom-4 left-4 bg-[rgba(19,58,49,0.9)] text-[#adc8bf] rounded-full px-4 py-2 text-[12px] font-['Vazirmatn:Regular',sans-serif] hover:text-white transition-colors">← Hub</button>
    </div>
  );
}
