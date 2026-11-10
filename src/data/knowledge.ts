export type KnowledgeSpotlight = {
  id: string;
  title: string;
  summary: string;
  url: string;
};

export const knowledgeFacts = {
  url: "https://timimt.github.io/cs-daily-knowledge-content/",
  repository: "https://github.com/Timimt/cs-daily-knowledge-content",
  publishedLessons: 23,
};

export const knowledgeSpotlight: KnowledgeSpotlight[] = [
  {
    id: "day-005",
    title: "雜湊函式與密碼儲存",
    summary: "雜湊與加密的差別，以及為什麼密碼需要鹽與慢速雜湊。",
    url: "https://timimt.github.io/cs-daily-knowledge-content/#/lessons/day-005",
  },
  {
    id: "day-009",
    title: "TLS 握手與 HTTPS 的信任來源",
    summary: "拆解 TLS 握手，搞懂瀏覽器鎖頭到底代表什麼。",
    url: "https://timimt.github.io/cs-daily-knowledge-content/#/lessons/day-009",
  },
  {
    id: "day-015",
    title: "SQL Injection 與參數化查詢",
    summary: "從根本原因理解注入，並用參數化查詢把資料與指令分開。",
    url: "https://timimt.github.io/cs-daily-knowledge-content/#/lessons/day-015",
  },
  {
    id: "day-024",
    title: "事件處理與 STRIDE 威脅建模",
    summary: "事件處理的階段，以及開發前用 STRIDE 系統性找威脅。",
    url: "https://timimt.github.io/cs-daily-knowledge-content/#/lessons/day-024",
  },
];
