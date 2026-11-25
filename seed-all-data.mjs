import { StoreMesh } from './workspace/storemesh-site-server/src/domain.js';
import { JsonRepository } from './workspace/storemesh-site-server/src/persistence.js';
import { JsonEventRepository } from './workspace/storemesh-cloud/src/repository.js';
import { Aggregator } from './workspace/storemesh-cloud/src/server.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, 'data', 'storemesh-iran.json');
const cloudDataFile = path.join(__dirname, 'data', 'storemesh-cloud-events.json');

console.log('--- Seeding Comprehensive Test Data for StoreMesh ---');

const repo = new JsonRepository(dataFile);
const app = new StoreMesh({ site: 'IRAN', repository: repo, seedDemoReferences: true });

// Clear any stale idempotency records from partial runs
app.state.idempotency = new Map();
app.state.idempotencyMeta = new Map();

// 1. Master Data: Products
const products = [
  { code: 'APPLE_RED', name: 'سیب قرمز ممتاز صادراتی', status: 'ACTIVE' },
  { code: 'APPLE_GREEN', name: 'سیب سبز ترش گرنی‌اسمیت', status: 'ACTIVE' },
  { code: 'TOMATO_CHERRY', name: 'گوجه گیلاسی گلخانه‌ای', status: 'ACTIVE' },
  { code: 'STRAWBERRY', name: 'توت فرنگی هیدروپونیک گلخانه‌ای', status: 'ACTIVE' },
  { code: 'TRUFFLE_BLACK', name: 'قارچ ترافل سیاه کوهستانی', status: 'ACTIVE' }
];
for (const p of products) {
  if (!app.state.masterData.products.some(x => x.code === p.code)) {
    app.createReference('products', p, `seed-prod-${p.code}`);
  }
}

// 2. Master Data: Suppliers
const suppliers = [
  { code: 'SUP_GOLKHANE_NEMOONE', name: 'گلخانه نمونه پارس (دشت جیرفت)', region: 'کرمان', contactName: 'مهندس رضایی', contactPhone: '09121112233', status: 'ACTIVE' },
  { code: 'SUP_ARAZ_ORCHARD', name: 'باغات ارس آذربایجان', region: 'آذربایجان غربی', contactName: 'حاج احمد مرادی', contactPhone: '09142223344', status: 'ACTIVE' },
  { code: 'SUP_ZAGROS', name: 'مزرعه کوهستانی زاگرس شیراز', region: 'فارس', contactName: 'دکتر بهرامی', contactPhone: '09173334455', status: 'ACTIVE' },
  { code: 'SUP_KHAZAR_FRESH', name: 'کشت‌وصنعت خزر مازندران', region: 'مازندران', contactName: 'مهندس یزدانی', contactPhone: '09114445566', status: 'ACTIVE' }
];
for (const s of suppliers) {
  if (!app.state.masterData.suppliers.some(x => x.code === s.code)) {
    app.createReference('suppliers', s, `seed-sup-${s.code}`);
  }
}

// 3. Master Data: Grades
const grades = [
  { code: 'GRADE_A', name: 'درجه یک صادراتی (گرید A)', status: 'ACTIVE' },
  { code: 'GRADE_B', name: 'درجه دو کارخانه‌ای (گرید B)', status: 'ACTIVE' },
  { code: 'GRADE_PREMIUM', name: 'سوپر لوکس ممتاز (Super Premium)', status: 'ACTIVE' },
  { code: 'UNSORTED', name: 'درهم / دست‌چین‌نشده', status: 'ACTIVE' }
];
for (const g of grades) {
  if (!app.state.masterData.grades.some(x => x.code === g.code)) {
    app.createReference('grades', g, `seed-grade-${g.code}`);
  }
}

// 4. Master Data: Sizes
const sizes = [
  { code: 'SIZE_LARGE', name: 'درشت (L - قطر +۷۵ میلیمتر)', status: 'ACTIVE' },
  { code: 'SIZE_MEDIUM', name: 'متوسط (M - قطر ۶۵ تا ۷۵)', status: 'ACTIVE' },
  { code: 'SIZE_SMALL', name: 'ریز (S - قطر زیر ۶۵)', status: 'ACTIVE' },
  { code: 'SIZE_MIXED', name: 'مخلوط / سایزبندی‌نشده', status: 'ACTIVE' }
];
for (const s of sizes) {
  if (!app.state.masterData.sizes.some(x => x.code === s.code)) {
    app.createReference('sizes', s, `seed-size-${s.code}`);
  }
}

// 5. Master Data: PackageTypes
const packageTypes = [
  { code: 'CARTON_5KG', name: 'کارتن مقوایی ۵ کیلویی پنج‌لایه', status: 'ACTIVE' },
  { code: 'CARTON_10KG', name: 'کارتن صادراتی ۱۰ کیلویی لمینت', status: 'ACTIVE' },
  { code: 'POUCH_500G', name: 'پاکت زیپ‌کیپ کرافت متالایز ۵۰۰ گرم', status: 'ACTIVE' },
  { code: 'PLASTIC_PUNNET', name: 'ظرف شفاف پت ۷۵۰ گرمی', status: 'ACTIVE' },
  { code: 'PALLET_WOODEN', name: 'پالت چوبی استاندارد ۱۲۰۰x۸۰۰', status: 'ACTIVE' }
];
for (const pt of packageTypes) {
  if (!app.state.masterData.packageTypes.some(x => x.code === pt.code)) {
    app.createReference('packageTypes', pt, `seed-pt-${pt.code}`);
  }
}

// 6. Harvest Periods
const currentYear = new Date().getFullYear();
app.state.harvestPeriods = []; // Clear demo 2000-2099 to avoid overlap
const harvestPeriodInput = {
  code: `HARVEST-${currentYear}-MAIN`,
  label: `فصل برداشت سراسری سال ${currentYear}`,
  startDate: `${currentYear}-01-01`,
  endDate: `${currentYear}-12-31`
};
const activeHarvest = app.createHarvestPeriod(harvestPeriodInput, 'seed-harvest-main');

// 7. Containers (Baskets and Trays)
// Note: Baskets for receiving must initially be in RECEIVING zone
const containerConfigs = [
  { codeSuffix: '001', type: 'BASKET', tare: 1.28, capacity: 25, zone: 'RECEIVING', stage: 'PRE_SORT', designated: ['RECEIVING', 'COLD_ROOM_DIRTY'] },
  { codeSuffix: '002', type: 'BASKET', tare: 1.28, capacity: 25, zone: 'RECEIVING', stage: 'PRE_SORT', designated: ['RECEIVING', 'COLD_ROOM_DIRTY'] },
  { codeSuffix: '003', type: 'BASKET', tare: 1.28, capacity: 25, zone: 'RECEIVING', stage: 'PRE_SORT', designated: ['RECEIVING', 'COLD_ROOM_DIRTY'] },
  { codeSuffix: '004', type: 'BASKET', tare: 1.28, capacity: 25, zone: 'RECEIVING', stage: 'PRE_SORT', designated: ['RECEIVING', 'COLD_ROOM_DIRTY'] },
  { codeSuffix: '005', type: 'BASKET', tare: 1.28, capacity: 25, zone: 'RECEIVING', stage: 'PRE_SORT', designated: ['RECEIVING', 'COLD_ROOM_DIRTY'] },
  { codeSuffix: '006', type: 'BASKET', tare: 1.28, capacity: 25, zone: 'RECEIVING', stage: 'PRE_SORT', designated: ['RECEIVING', 'COLD_ROOM_DIRTY'] },
  { codeSuffix: '007', type: 'BASKET', tare: 1.28, capacity: 25, zone: 'RECEIVING', stage: 'PRE_SORT', designated: ['RECEIVING', 'COLD_ROOM_DIRTY', 'SORTING'] },
  { codeSuffix: '008', type: 'BASKET', tare: 1.28, capacity: 25, zone: 'RECEIVING', stage: 'PRE_SORT', designated: ['RECEIVING', 'COLD_ROOM_DIRTY', 'WASHING'] },
  { codeSuffix: '009', type: 'BASKET', tare: 1.28, capacity: 25, zone: 'RECEIVING', stage: 'PRE_SORT', designated: ['RECEIVING', 'COLD_ROOM_DIRTY', 'SORTING'] },
  { codeSuffix: '010', type: 'BASKET', tare: 1.28, capacity: 25, zone: 'RECEIVING', stage: 'PRE_SORT', designated: ['RECEIVING', 'COLD_ROOM_DIRTY'] },
  { codeSuffix: '011', type: 'BASKET', tare: 1.28, capacity: 25, zone: 'RECEIVING', stage: 'PRE_SORT', designated: ['RECEIVING', 'COLD_ROOM_DIRTY'] },
  { codeSuffix: '012', type: 'BASKET', tare: 1.28, capacity: 25, zone: 'RECEIVING', stage: 'PRE_SORT', designated: ['RECEIVING', 'COLD_ROOM_DIRTY'] },
  { codeSuffix: '013', type: 'BASKET', tare: 1.28, capacity: 25, zone: 'RECEIVING', stage: 'PRE_SORT', designated: ['RECEIVING', 'COLD_ROOM_DIRTY'] },
  { codeSuffix: '014', type: 'BASKET', tare: 1.28, capacity: 25, zone: 'RECEIVING', stage: 'PRE_SORT', designated: ['RECEIVING', 'COLD_ROOM_DIRTY'] }
];

// Clean previous containers if they were in wrong zone
app.state.containers = [];

const createdContainers = [];
for (const c of containerConfigs) {
  let existing = app.state.containers.find(x => x.code === `C-IRAN-${c.codeSuffix}`);
  if (!existing) {
    existing = app.createContainer({
      type: c.type,
      capacityKg: c.capacity,
      tareWeightKg: c.tare,
      zone: c.zone,
      stage: c.stage,
      designatedZones: c.designated
    }, `seed-container-${c.codeSuffix}`);
  }
  createdContainers.push(existing);
}

// 8. Open an Operator Session to perform operational actions
const operatorSession = app.openSession('00000000-0000-4000-a000-000000000001', 'TEST-TERMINAL-01', 'RECEIVING', 'RECEIVING_OPERATOR');

// 9. Deliveries (محموله‌های ورودی)
// Delivery 1: RCV-1405-0928 (گوجه گیلاسی از گلخانه نمونه)
let delivery1 = app.state.deliveries.find(x => x.supplierCode === 'SUP_GOLKHANE_NEMOONE');
if (!delivery1) {
  delivery1 = app.startDelivery({
    supplierCode: 'SUP_GOLKHANE_NEMOONE',
    sessionId: operatorSession.id,
    vehiclePlate: '۶۸-۱۲۳ب۴۵',
    driverName: 'رحیمی',
    referenceNumber: 'BL-1405-091'
  }, 'seed-del-1');

  // Receive baskets into delivery
  const basket1 = app.receive({
    deliveryId: delivery1.id,
    sessionId: operatorSession.id,
    containerId: createdContainers[3].id,
    supplier: 'SUP_GOLKHANE_NEMOONE',
    product: 'TOMATO_CHERRY',
    grade: 'GRADE_A',
    size: 'SIZE_MEDIUM',
    weightKg: 21.5
  }, 'seed-rcv-1');

  const basket2 = app.receive({
    deliveryId: delivery1.id,
    sessionId: operatorSession.id,
    containerId: createdContainers[4].id,
    supplier: 'SUP_GOLKHANE_NEMOONE',
    product: 'TOMATO_CHERRY',
    grade: 'GRADE_A',
    size: 'SIZE_MEDIUM',
    weightKg: 20.8
  }, 'seed-rcv-2');

  const basket3 = app.receive({
    deliveryId: delivery1.id,
    sessionId: operatorSession.id,
    containerId: createdContainers[5].id,
    supplier: 'SUP_GOLKHANE_NEMOONE',
    product: 'TOMATO_CHERRY',
    grade: 'GRADE_B',
    size: 'SIZE_MIXED',
    weightKg: 19.4
  }, 'seed-rcv-3');

  // Complete Delivery and move to Cold Room Dirty
  app.completeDelivery(delivery1.id, { sessionId: operatorSession.id }, 'seed-del-1-comp');
  app.moveDeliveryContainers(delivery1.id, { sessionId: operatorSession.id, zone: 'COLD_ROOM_DIRTY' }, 'seed-del-1-move');
}

// Delivery 2: RCV-1405-0929 (سیب قرمز از باغات ارس)
let delivery2 = app.state.deliveries.find(x => x.supplierCode === 'SUP_ARAZ_ORCHARD');
if (!delivery2) {
  delivery2 = app.startDelivery({
    supplierCode: 'SUP_ARAZ_ORCHARD',
    sessionId: operatorSession.id,
    vehiclePlate: '۲۱-۸۹۷ج۱۴',
    driverName: 'مرادی',
    referenceNumber: 'BL-1405-092'
  }, 'seed-del-2');

  app.receive({
    deliveryId: delivery2.id,
    sessionId: operatorSession.id,
    containerId: createdContainers[0].id,
    supplier: 'SUP_ARAZ_ORCHARD',
    product: 'APPLE_RED',
    grade: 'GRADE_PREMIUM',
    size: 'SIZE_LARGE',
    weightKg: 22.4
  }, 'seed-rcv-apple-1');

  app.receive({
    deliveryId: delivery2.id,
    sessionId: operatorSession.id,
    containerId: createdContainers[1].id,
    supplier: 'SUP_ARAZ_ORCHARD',
    product: 'APPLE_RED',
    grade: 'GRADE_A',
    size: 'SIZE_LARGE',
    weightKg: 22.1
  }, 'seed-rcv-apple-2');

  app.completeDelivery(delivery2.id, { sessionId: operatorSession.id }, 'seed-del-2-comp');
  app.moveDeliveryContainers(delivery2.id, { sessionId: operatorSession.id, zone: 'COLD_ROOM_DIRTY' }, 'seed-del-2-move');
}

// Delivery 3: Currently Open Delivery (در حال دریافت زنده)
let delivery3 = app.state.deliveries.find(x => x.status === 'OPEN');
if (!delivery3) {
  delivery3 = app.startDelivery({
    supplierCode: 'SUP_KHAZAR_FRESH',
    sessionId: operatorSession.id,
    vehiclePlate: '۳۳-۴۵۶د۷۸',
    driverName: 'یزدانی',
    referenceNumber: 'BL-1405-095'
  }, 'seed-del-3');

  app.receive({
    deliveryId: delivery3.id,
    sessionId: operatorSession.id,
    containerId: createdContainers[2].id,
    supplier: 'SUP_KHAZAR_FRESH',
    product: 'STRAWBERRY',
    grade: 'GRADE_A',
    size: 'SIZE_LARGE',
    weightKg: 15.0
  }, 'seed-rcv-straw-1');
}

// 10. Consumables (اقلام مصرفی انبار و بسته‌بندی)
const consumablesData = [
  { code: 'BOX-5KG', name: 'کارتن مقوایی صادراتی ۵ کیلویی پنج‌لایه', unit: 'عدد', quantity: 2450, reorderThreshold: 500, source: 'شرکت کارتن‌سازی میهن' },
  { code: 'BOX-10KG', name: 'کارتن صادراتی ۱۰ کیلویی لمینت براق', unit: 'عدد', quantity: 1200, reorderThreshold: 300, source: 'صنایع بسته‌بندی سپیدار' },
  { code: 'POUCH-250G', name: 'پاکت زیپ‌کیپ کرافت ۲۵۰ گرم پنجره‌دار', unit: 'عدد', quantity: 5800, reorderThreshold: 1000, source: 'پلیمر گستر پارس' },
  { code: 'GEL-PACK-500G', name: 'آیس‌پک یخ ژله‌ای خشک ۵۰۰ گرمی حمل صادراتی', unit: 'عدد', quantity: 2100, reorderThreshold: 400, source: 'سرماسازان البرز' },
  { code: 'LABEL-ROLL-100X150', name: 'رول لیبل حرارتی زبرا ۱۰۰x۱۵۰ میلیمتر ضدآب', unit: 'رول', quantity: 180, reorderThreshold: 30, source: 'فناوری برچسب آوا' },
  { code: 'TAPE-CRYSTAL', name: 'چسب پهن شیشه‌ای ۵ سانتی ۹۰ یارد', unit: 'حلقه', quantity: 340, reorderThreshold: 50, source: 'چسب خاورمیانه' }
];

for (const item of consumablesData) {
  let c = app.state.consumables.find(x => x.code === item.code);
  if (!c) {
    c = app.createConsumable({
      code: item.code,
      name: item.name,
      unit: item.unit,
      reorderThreshold: item.reorderThreshold
    }, `seed-consumable-${item.code}`);
    app.receiveConsumable(c.id, {
      quantity: item.quantity,
      source: item.source,
      receivedAt: new Date().toISOString()
    }, `seed-c-rcv-${item.code}`);
  }
}

// 11. QC Checklist and Quality Inspections
let qcChecklist = app.state.qcChecklists.find(x => x.code === 'QC-CHK-TOMATO-IN');
if (!qcChecklist) {
  qcChecklist = app.createQcChecklist({
    code: 'QC-CHK-TOMATO-IN',
    name: 'چک‌لیست کنترل کیفیت گوجه گیلاسی ورودی',
    product: 'TOMATO_CHERRY',
    stage: 'RECEIVING',
    items: [
      { code: 'COLOR_UNIFORMITY', prompt: 'یکنواختی رنگ قرمز و رسیدگی میوه (+۸۵٪)', required: true },
      { code: 'BRIX_SUGAR', prompt: 'درجه بریکس قند میوه (حداقل ۵.۵)', required: true },
      { code: 'FIRM_TEXTURE', prompt: 'سفتی بافت و عدم نرمی یا له‌شدگی', required: true },
      { code: 'PEST_FREE', prompt: 'عدم وجود آفت، لک یا کپک قارچی', required: true },
      { code: 'PUDICLE_INTACT', prompt: 'سالم بودن کاسبرگ سبز میوه', required: false }
    ]
  }, 'seed-qc-checklist-tomato');
}

// Add an approved QC check for batch
if (app.state.batches.length > 0 && !app.state.qualityChecks.some(x => x.batchId === app.state.batches[0].id)) {
  const b = app.state.batches[0];
  app.state.qualityChecks.push({
    id: 'qc-00000000-0000-4000-a000-000000000001',
    batchId: b.id,
    checklistId: qcChecklist.id,
    result: 'APPROVED',
    inspectorId: '00000000-0000-4000-a000-000000000001',
    actorRoles: ['QUALITY_OPERATOR'],
    notes: 'میوه دارای کیفیت سوپر ممتاز، بریکس ۶.۲، فاقد هرگونه ضایعات، مناسب صادرات درجه یک',
    attestation: {
      userId: '00000000-0000-4000-a000-000000000001',
      score: 95,
      at: new Date().toISOString()
    },
    createdAt: new Date().toISOString()
  });
}

// 12. Operational Tasks
const tasksData = [
  {
    title: 'انتقال سبدهای گوجه گیلاسی به سردخانه مثبت کثیف',
    operationType: 'DELIVERY_CONTAINERS_MOVED',
    zone: 'COLD_ROOM_DIRTY',
    priority: 85,
    dueMinutes: 30,
    expectedDurationMinutes: 15,
    requiredRole: 'STORAGE_OPERATOR',
    entityId: app.state.batches[0]?.id || null
  },
  {
    title: 'سورتینگ و گریدبندی سیب‌های قرمز در خط ۱',
    operationType: 'BATCH_SORTED',
    zone: 'SORTING',
    priority: 60,
    dueMinutes: 60,
    expectedDurationMinutes: 45,
    requiredRole: 'SORTING_OPERATOR',
    assignedTo: '00000000-0000-4000-a000-000000000002',
    entityId: app.state.batches[1]?.id || null
  },
  {
    title: 'تخلیه سینی‌های فریزدرای دستگاه شماره ۲',
    operationType: 'CYCLE_FINISH',
    zone: 'FREEZE_DRYING',
    priority: 90,
    dueMinutes: 40,
    expectedDurationMinutes: 20,
    requiredRole: 'FREEZE_DRY_OPERATOR',
    entityId: null
  },
  {
    title: 'بسته‌بندی کارتن‌های ۵ کیلویی سفارش صادراتی دبی',
    operationType: 'PACKAGE_READY',
    zone: 'PACKAGING',
    priority: 95,
    dueMinutes: 120,
    expectedDurationMinutes: 60,
    requiredRole: 'PACKAGING_OPERATOR',
    entityId: null
  }
];

for (let i = 0; i < tasksData.length; i++) {
  const t = tasksData[i];
  const dueAt = new Date(Date.now() + t.dueMinutes * 60000).toISOString();
  app.createTask({
    title: t.title,
    zone: t.zone,
    priority: t.priority,
    dueAt,
    expectedDurationMinutes: t.expectedDurationMinutes,
    requiredRole: t.requiredRole,
    operationType: t.operationType,
    assignedTo: t.assignedTo ?? null,
    entityId: t.entityId ?? null
  }, `seed-task-${i + 1}`);
}

// 13. Operational Exceptions (انحرافات و عدم‌انطباق‌ها)
const exceptionsData = [
  {
    code: 'EXC-IRAN-001',
    type: 'WEIGHT_ANOMALY',
    entityType: 'BATCH',
    entityId: app.state.batches[0]?.id || 'b1',
    severity: 'WARNING',
    status: 'RESOLVED',
    details: { reason: 'اختلاف وزن باسکول با بارنامه ارسالی کشاورز (۳.۲ کیلوگرم اضافه بار)', resolvedNote: 'باسکول مجدداً کالیبره شد و وزن خالص تأیید شد' },
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    code: 'EXC-IRAN-002',
    type: 'DAMAGED_LABEL',
    entityType: 'CONTAINER',
    entityId: createdContainers[1]?.id || 'c1',
    severity: 'HIGH',
    status: 'OPEN',
    details: { reason: 'مخدوش شدن بارکد دو بعدی سبد C-IRAN-000002 در اثر شست‌وشو، نیازمند صدور برچسب مجدد' },
    createdAt: new Date().toISOString()
  }
];

for (const exc of exceptionsData) {
  if (!app.state.exceptions.some(x => x.code === exc.code)) {
    app.state.exceptions.push({
      id: `exc-${exc.code}`,
      code: exc.code,
      type: exc.type,
      entityType: exc.entityType,
      entityId: exc.entityId,
      severity: exc.severity,
      status: exc.status,
      details: exc.details,
      createdAt: exc.createdAt
    });
  }
}

// 14. Customers & Sales Orders
let customer1 = app.state.customers.find(x => x.code === 'CUST-AL-MAYA');
if (!customer1) {
  customer1 = app.createCustomer({
    code: 'CUST-AL-MAYA',
    name: 'گروه بین‌المللی هایپرمارکت‌های المایا (دبی - امارات)',
    contact: 'Mr. Tariq Al-Hashimi (+971-4-3214567)',
    address: 'Jebel Ali Free Zone, Dubai, UAE'
  }, 'seed-cust-almaya');
}

let customer2 = app.state.customers.find(x => x.code === 'CUST-MILAN-FRUIT');
if (!customer2) {
  customer2 = app.createCustomer({
    code: 'CUST-MILAN-FRUIT',
    name: 'شرکت بازرگانی میوه تازه میلان (ایتالیا)',
    contact: 'Sig. Marco Rossi (+39-02-8976543)',
    address: 'Via Mercato Ortofrutticolo, Milano, Italy'
  }, 'seed-cust-milan');
}

let salesOrder = app.state.salesOrders.find(x => x.customerId === customer1.id);
if (!salesOrder) {
  salesOrder = app.createSalesOrder({
    customerId: customer1.id,
    items: [
      { packageType: 'CARTON', quantity: 300 },
      { packageType: 'PALLET', quantity: 15 }
    ]
  }, 'seed-so-1');
}

// Save all changes to local persistent JSON
app.persist();
console.log('✅ Site Server (Iran) state saved successfully!');
console.log(`- Products: ${app.state.masterData.products.length}`);
console.log(`- Suppliers: ${app.state.masterData.suppliers.length}`);
console.log(`- Containers: ${app.state.containers.length}`);
console.log(`- Deliveries: ${app.state.deliveries.length}`);
console.log(`- Batches: ${app.state.batches.length}`);
console.log(`- Consumables: ${app.state.consumables.length}`);
console.log(`- Tasks: ${app.state.tasks.length}`);
console.log(`- Quality Checks: ${app.state.qualityChecks.length}`);
console.log(`- Customers: ${app.state.customers.length}`);
console.log(`- Sales Orders: ${app.state.salesOrders.length}`);

// 15. Seed Cloud Aggregator with Multi-Site Events
const cloudRepo = new JsonEventRepository(cloudDataFile);
const cloudAggregator = new Aggregator({ repository: cloudRepo });
await cloudAggregator.ready;

const sampleCloudEvents = [
  {
    id: 'evt-iran-001',
    site: 'IRAN',
    schemaVersion: 2,
    type: 'DELIVERY_COMPLETED',
    category: 'Inventory',
    entityId: delivery1.id,
    occurredAt: new Date(Date.now() - 7200000).toISOString(),
    payload: { supplier: 'SUP_GOLKHANE_NEMOONE', basketsCount: 3, totalWeightKg: 61.7 }
  },
  {
    id: 'evt-iran-002',
    site: 'IRAN',
    schemaVersion: 2,
    type: 'QC_APPROVED',
    category: 'Quality',
    entityId: app.state.batches[0]?.id || 'b1',
    occurredAt: new Date(Date.now() - 3600000).toISOString(),
    payload: { inspector: 'admin', score: 95, status: 'APPROVED' }
  },
  {
    id: 'evt-dubai-001',
    site: 'DUBAI',
    schemaVersion: 2,
    type: 'SHIPMENT_RECEIVED',
    category: 'Shipping',
    entityId: 'shipment-dubai-77',
    occurredAt: new Date(Date.now() - 5400000).toISOString(),
    payload: { origin: 'IRAN', totalBoxes: 300, temperatureAtArrival: 4.2 }
  },
  {
    id: 'evt-rome-001',
    site: 'ROME',
    schemaVersion: 2,
    type: 'INVENTORY_AUDIT_VERIFIED',
    category: 'Administration',
    entityId: 'audit-rome-12',
    occurredAt: new Date(Date.now() - 1800000).toISOString(),
    payload: { auditor: 'luigi', discrepancies: 0 }
  }
];

const ingestResult = await cloudAggregator.ingest('IRAN', sampleCloudEvents.filter(x => x.site === 'IRAN'));
await cloudAggregator.ingest('DUBAI', sampleCloudEvents.filter(x => x.site === 'DUBAI'));
await cloudAggregator.ingest('ROME', sampleCloudEvents.filter(x => x.site === 'ROME'));

console.log('✅ Cloud Aggregator seeded with multi-site events (Iran, Dubai, Rome)!');
console.log('Summary:', cloudAggregator.summary());
