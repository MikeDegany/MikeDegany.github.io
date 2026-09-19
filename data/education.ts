export type EducationItem = {
  degree: string
  institution: string
  /** Position along the education road, 0..1 */
  pathT: number
  align: "left" | "center" | "right"
}

export const EDUCATION_ITEMS: EducationItem[] = [
  {
    degree: "Bachelor of Science: Electronics Engineering",
    institution: "Yazd University (2012 - 2016)",
    pathT: 0.15,
    align: "left",
  },
  {
    degree: "Master of Science: Mechatronics Engineering",
    institution: "Amirkabir University of Technology (AUT) (2016 - 2019) - Distinguished Graduate Award (Ranked 3rd of Class)",
    pathT: 0.5,
    align: "center",
  },
  {
    degree: "Doctor of Philosophy: Computer Science and Engineering",
    institution: "University of North Texas (UNT) Texas, USA (2022 - 2026)",
    pathT: 0.85,
    align: "right",
  },
]
