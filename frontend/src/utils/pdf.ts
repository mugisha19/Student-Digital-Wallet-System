type Cell = string | number | null | undefined

type ReportPdfOptions = {
  filename: string
  title: string
  studentNumber?: string
  studentName?: string
  head: string[]
  rows: Cell[][]
}

export async function downloadReportPdf({
  filename,
  title,
  studentNumber,
  studentName,
  head,
  rows,
}: ReportPdfOptions) {
  const [{ jsPDF }, autoTableMod] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])
  const autoTable = autoTableMod.default

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const margin = 40
  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Student Digital Wallet', margin, 50)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(100)
  doc.text(title, margin, 68)

  const meta: string[] = []
  if (studentName) meta.push(`Name: ${studentName}`)
  if (studentNumber) meta.push(`Student ID: ${studentNumber}`)
  meta.push(`Generated: ${new Date().toLocaleString()}`)
  meta.push('Currency: RWF')
  doc.setFontSize(9)
  doc.text(meta.join('   ·   '), margin, 84)

  doc.setDrawColor(220)
  doc.line(margin, 94, pageWidth - margin, 94)

  autoTable(doc, {
    startY: 110,
    margin: { left: margin, right: margin },
    head: [head],
    body: rows.map((r) => r.map((c) => (c === null || c === undefined ? '' : String(c)))),
    styles: { font: 'helvetica', fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [247, 248, 251] },
    theme: 'grid',
  })

  doc.save(filename)
}

export function todayStamp(): string {
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
}
