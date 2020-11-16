const DOCTOR_MODE = 'DOCTOR_MODE'
const CABINET_MODE = 'CABINET_MODE'

const colWidth = count => 100 / count

const tableWidth = count => {
  if (count < 3) return 50
  if (count < 4) return 75
  return 100
}

export { DOCTOR_MODE, CABINET_MODE, colWidth, tableWidth }
