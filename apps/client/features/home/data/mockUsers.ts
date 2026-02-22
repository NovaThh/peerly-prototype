export type HomeUser = {
  id: string;
  name: string;
  major: string;
  educationLevel: "HBO" | "WO" | "MBO" | "Master HBO" | "Master WO";
  goodAt: string[];
  needHelp: string[];
};

export const MOCK_USERS: HomeUser[] = [
  {
    id: "1",
    name: "Nhien",
    major: "ICT",
    educationLevel: "HBO",
    goodAt: ["Java Programming", "GitLab CI/CD", "English", "Dutch"],
    needHelp: ["C# Programming", "Python Programming"],
  },
  {
    id: "2",
    name: "Wen",
    major: "ICT",
    educationLevel: "HBO",
    goodAt: ["Java Programming", "Embedded Programming", "Accounting"],
    needHelp: ["Dutch", "Spanish"],
  },
  {
    id: "3",
    name: "Jan",
    major: "ICT",
    educationLevel: "HBO",
    goodAt: ["Java Programming", "C# Programming", "GitLab CI/CD"],
    needHelp: ["Advanced Mathematics", "Embedded Programming"],
  },
  {
    id: "4",
    name: "User D",
    major: "ICT",
    educationLevel: "HBO",
    goodAt: ["Geography", "History", "English", "Dutch"],
    needHelp: ["Python Programming", "Advanced Mathematics"],
  },
  {
    id: "5",
    name: "User E",
    major: "Accounting",
    educationLevel: "HBO",
    goodAt: ["Finance", "English", "Advanced Mathematics"],
    needHelp: ["Matlab", "Dutch"],
  },
];