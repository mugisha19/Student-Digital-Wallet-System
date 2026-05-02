type Props = { value: number | string | null | undefined }

const fmt = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export default function Money({ value }: Props) {
  const n = typeof value === 'string' ? Number(value) : value
  if (n === null || n === undefined || Number.isNaN(n)) return <span>—</span>
  return <span>{fmt.format(n)}</span>
}
