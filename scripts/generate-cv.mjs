import fs from "node:fs";
import path from "node:path";

const outFile = path.resolve("assets/Kartika-Devi-Lestari-CV.pdf");
const pageWidth = 595.28;
const pageHeight = 841.89;
const margin = 42;
const contentWidth = pageWidth - margin * 2;

const data = {
  name: "Kartika Devi Lestari",
  title: "Accounting Student & Administration Enthusiast",
  campus: "Politeknik LP3I Pekanbaru - Komputerisasi Akuntansi",
  summary:
    "Mahasiswi yang memiliki minat dalam akuntansi, administrasi, pengolahan data, dan teknologi informasi. Aktif dalam organisasi kampus maupun sekolah sehingga terbiasa bekerja sama, berkomunikasi, dan menjaga kerapian administrasi.",
  education: [
    "SMA Negeri 1 Kampar Kiri Hilir (2022 - 2025)",
    "Politeknik LP3I Pekanbaru - Komputerisasi Akuntansi (2025 - Sekarang)",
  ],
  experience: [
    {
      title: "Sekretaris BEM Politeknik LP3I Pekanbaru",
      tasks:
        "Mengelola surat menyurat, jadwal rapat, notulensi, dan arsip administrasi agar koordinasi organisasi tetap tertata.",
      result:
        "Membantu dokumentasi kegiatan dan proses koordinasi internal menjadi lebih rapi dan responsif.",
    },
    {
      title: "Anggota OSIS Bidang Prestasi Akademik, Seni, dan Olahraga",
      tasks:
        "Mendukung pelaksanaan program bidang prestasi, membantu koordinasi acara, dan menjaga komunikasi antaranggota.",
      result:
        "Berpartisipasi dalam kegiatan yang mendorong keterlibatan siswa dan kerja sama tim.",
    },
    {
      title: "Peserta Pramuka Tingkat Kecamatan",
      tasks:
        "Mengikuti pembinaan yang menekankan disiplin, kemandirian, kepemimpinan, dan kerja sama kelompok.",
      result:
        "Memperkuat karakter tangguh, adaptif, dan komunikatif dalam kegiatan lapangan.",
    },
  ],
  skills: [
    "Microsoft Word",
    "Microsoft Excel",
    "Microsoft PowerPoint",
    "Administrasi Perkantoran",
    "Akuntansi Dasar",
    "Pengolahan Data",
    "Public Speaking",
    "Leadership",
    "Teamwork",
    "Time Management",
  ],
  contact: [
    "Email: kartika.devi.lestari@example.com",
    "WhatsApp: +62 812-3456-7890",
    "Instagram: @kartikadev",
    "LinkedIn: linkedin.com/in/kartikadevilestari",
  ],
};

const escapePdfText = (value) =>
  value
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");

const approxCharsPerLine = (fontSize, width = contentWidth) =>
  Math.max(24, Math.floor(width / (fontSize * 0.55)));

const wrapText = (text, fontSize, width = contentWidth) => {
  const maxChars = approxCharsPerLine(fontSize, width);
  const paragraphs = text.split("\n");
  const lines = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push("");
      continue;
    }

    const words = paragraph.split(/\s+/);
    let current = "";

    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (next.length <= maxChars) {
        current = next;
      } else {
        if (current) {
          lines.push(current);
        }
        current = word;
      }
    }

    if (current) {
      lines.push(current);
    }
  }

  return lines;
};

const pageContent = [];
const push = (line) => pageContent.push(line);

const drawText = (x, y, size, text, font = "F1", color = [0.06, 0.14, 0.25]) => {
  push(
    `BT /${font} ${size} Tf ${color[0]} ${color[1]} ${color[2]} rg ${x.toFixed(2)} ${y.toFixed(2)} Td (${escapePdfText(text)}) Tj ET`
  );
};

const drawLine = (x1, y1, x2, y2, width = 1, color = [0.07, 0.72, 0.85]) => {
  push(`${color[0]} ${color[1]} ${color[2]} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
};

const drawRect = (x, y, w, h, fill = [0.06, 0.14, 0.25]) => {
  push(`${fill[0]} ${fill[1]} ${fill[2]} rg ${x} ${y} ${w} ${h} re f`);
};

const sectionTitle = (title, y) => {
  drawText(margin, y, 13, title, "F2", [0.06, 0.14, 0.25]);
  drawLine(margin, y - 7, margin + 120, y - 7, 1.3);
};

const paragraph = (text, x, y, size, width = contentWidth, leading = 15) => {
  const lines = wrapText(text, size, width);
  let cursor = y;

  for (const line of lines) {
    if (line === "") {
      cursor -= leading * 0.65;
      continue;
    }
    drawText(x, cursor, size, line);
    cursor -= leading;
  }

  return cursor;
};

const bulletList = (items, x, y, size, width = contentWidth, leading = 14) => {
  let cursor = y;

  for (const item of items) {
    const lines = wrapText(item, size, width - 18);
    lines.forEach((line, index) => {
      const prefix = index === 0 ? "- " : "  ";
      drawText(x, cursor, size, `${prefix}${line}`);
      cursor -= leading;
    });
    cursor -= leading * 0.2;
  }

  return cursor;
};

// Page background
drawRect(0, 0, pageWidth, pageHeight, [0.97, 0.98, 1]);
drawRect(0, pageHeight - 132, pageWidth, 132, [0.06, 0.14, 0.25]);
drawRect(0, pageHeight - 140, pageWidth, 8, [0.07, 0.72, 0.85]);

drawText(margin, pageHeight - 58, 24, data.name, "F2", [1, 1, 1]);
drawText(margin, pageHeight - 85, 12, data.title, "F1", [0.86, 0.95, 1]);
drawText(margin, pageHeight - 108, 10, data.campus, "F1", [0.78, 0.9, 1]);

let y = pageHeight - 170;
sectionTitle("Profil Singkat", y);
y -= 28;
y = paragraph(data.summary, margin, y, 10.5, contentWidth, 14);
y -= 10;

sectionTitle("Pendidikan", y);
y -= 24;
y = bulletList(data.education, margin, y, 10.5, contentWidth, 14);
y -= 8;

sectionTitle("Pengalaman Organisasi", y);
y -= 24;
for (const item of data.experience) {
  drawText(margin, y, 11.2, item.title, "F2", [0.06, 0.14, 0.25]);
  y -= 15;
  y = paragraph(`Tugas: ${item.tasks}`, margin, y, 10.2, contentWidth, 13);
  y -= 1;
  y = paragraph(`Pencapaian: ${item.result}`, margin, y, 10.2, contentWidth, 13);
  y -= 7;
}

sectionTitle("Keahlian", y);
y -= 24;
y = paragraph(data.skills.join("  |  "), margin, y, 10.3, contentWidth, 13);
y -= 8;

sectionTitle("Kontak", y);
y -= 24;
y = bulletList(data.contact, margin, y, 10.3, contentWidth, 13);

drawText(margin, 38, 9.4, "CV ini dibuat agar mudah diperbarui ketika data terbaru tersedia.", "F1", [0.36, 0.45, 0.55]);
drawText(pageWidth - margin - 154, 38, 9.4, "Format: A4 | 1 halaman", "F1", [0.36, 0.45, 0.55]);

const contentStream = pageContent.join("\n");

const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`,
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  `<< /Length ${Buffer.byteLength(contentStream, "utf8")} >>\nstream\n${contentStream}\nendstream`,
];

const header = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
const offsets = [0];
let body = "";

for (let index = 0; index < objects.length; index += 1) {
  offsets.push(header.length + body.length);
  body += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
}

const xrefOffset = header.length + body.length;
let xref = `xref\n0 ${objects.length + 1}\n`;
xref += "0000000000 65535 f \n";
for (let index = 1; index < offsets.length; index += 1) {
  xref += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
}

const trailer = [
  "trailer",
  `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
  "startxref",
  `${xrefOffset}`,
  "%%EOF",
  "",
].join("\n");

const pdfBuffer = Buffer.from(header + body + xref + trailer, "binary");
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, pdfBuffer);

console.log(`Wrote ${outFile}`);
