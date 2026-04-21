export type BopCarClass = 'GT3' | 'GT4' | 'GT2' | 'unknown'

const GT3_CAR_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
const GT4_CAR_IDS = [50, 51, 52, 53, 55, 56, 57, 58, 59, 60, 61]
const GT2_CAR_IDS = [80, 82, 83, 84, 85, 86]

export function getCarClass(carModel: number): BopCarClass {
  if (GT3_CAR_IDS.includes(carModel)) return 'GT3'
  if (GT4_CAR_IDS.includes(carModel)) return 'GT4'
  if (GT2_CAR_IDS.includes(carModel)) return 'GT2'
  return 'unknown'
}
