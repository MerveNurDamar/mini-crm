const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const xlsx = require('xlsx');
const { sequelize, Customer } = require('../../src/models');

function normalizePhone(input) {
  if (!input) return null;
  const digits = String(input).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('90') && digits.length === 12) return `+${digits}`;
  if (digits.startsWith('0') && digits.length === 11) return `+9${digits}`;
  if (digits.length === 10) return `+90${digits}`;
  if (digits.length >= 12) return `+${digits}`;
  return null;
}

function normalizeEmail(input) {
  if (!input) return null;
  const email = String(input).trim().toLowerCase();
  const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return basic.test(email) ? email : null;
}

function normalizeName(input) {
  if (!input) return null;
  return String(input).replace(/["“”]/g, '').trim();
}

function loadRows(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.csv') {
    const content = fs.readFileSync(filePath, 'utf8');
    return parse(content, { columns: true, skip_empty_lines: true, trim: true });
  }
  if (ext === '.xlsx' || ext === '.xls') {
    const wb = xlsx.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet, { defval: '' });
  }
  throw new Error('Unsupported file type. Use .csv or .xlsx');
}

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1];
}

async function main() {
  const filePath = getArg('--file');
  const dryRun = process.argv.includes('--dry-run');
  if (!filePath) {
    console.error('Usage: node scripts/etl/import_customers.js --file <path> [--dry-run]');
    process.exit(1);
  }

  const rows = loadRows(filePath);
  const existing = await Customer.findAll({ attributes: ['id', 'phone', 'email'] });
  const phoneSet = new Set(existing.map((c) => c.phone).filter(Boolean));
  const emailSet = new Set(existing.map((c) => c.email).filter(Boolean));

  const result = {
    total: rows.length,
    imported: 0,
    skipped: 0,
    errors: 0,
    duplicates: 0,
    errorRows: [],
  };

  for (const row of rows) {
    const firstName = normalizeName(row.Ad || row.first_name || row.firstName);
    const lastName = normalizeName(row.Soyad || row.last_name || row.lastName);
    const phone = normalizePhone(row.Telefon || row.phone);
    const email = normalizeEmail(row.Email || row.email);
    const address = normalizeName(row.Adres || row.address);
    const note = normalizeName(row.Not || row.note);

    if (!firstName) {
      result.errors += 1;
      result.errorRows.push({ row, reason: 'missing first_name' });
      continue;
    }
    if (!phone && !email) {
      result.errors += 1;
      result.errorRows.push({ row, reason: 'missing phone and email' });
      continue;
    }

    if ((phone && phoneSet.has(phone)) || (email && emailSet.has(email))) {
      result.duplicates += 1;
      result.skipped += 1;
      continue;
    }

    if (!dryRun) {
      await Customer.create({ firstName, lastName, phone, email, address, note });
    }

    if (phone) phoneSet.add(phone);
    if (email) emailSet.add(email);
    result.imported += 1;
  }

  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  fs.writeFileSync(path.join(reportsDir, `etl-${ts}.json`), JSON.stringify(result, null, 2));
  fs.writeFileSync(
    path.join(reportsDir, `etl-${ts}-errors.json`),
    JSON.stringify(result.errorRows, null, 2)
  );

  console.log(
    `ETL completed. imported=${result.imported} skipped=${result.skipped} errors=${result.errors}`
  );

  await sequelize.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
