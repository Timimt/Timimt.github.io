export type KnowledgeSpotlight = {
  id: string;
  title: string;
  summary: string;
  url: string;
};

export const knowledgeFacts = {
  url: "https://timimt.github.io/cs-daily-knowledge-content/",
  repository: "https://github.com/Timimt/cs-daily-knowledge-content",
  publishedLessons: 3,
};

export const knowledgeSpotlight: KnowledgeSpotlight[] = [
  {
    id: "S-001",
    title: "AES 與 RSA 的差異",
    summary: "從對稱式與非對稱式加密的差異出發，理解兩者在混合式加密中的分工。",
    url: "https://timimt.github.io/cs-daily-knowledge-content/#/lessons/S-001",
  },
  {
    id: "O-001",
    title: "Windows Process 與 Windows API",
    summary: "理解 Process、Thread、Handle 與使用者模式／核心模式邊界。",
    url: "https://timimt.github.io/cs-daily-knowledge-content/#/lessons/O-001",
  },
  {
    id: "S-002",
    title: "勒索病毒的混合式加密流程",
    summary: "拆解勒索病毒如何結合 AES 與 RSA，並整理備份與事件處理的防禦重點。",
    url: "https://timimt.github.io/cs-daily-knowledge-content/#/lessons/S-002",
  },
];
