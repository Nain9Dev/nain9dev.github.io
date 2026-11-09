// Builds /llms.txt, the Markdown site summary that AI answer engines read (specs/next-seo-discovery, DISC-001).
export interface LlmsLink {
  title: string;
  url: string;
  description?: string;
}

export interface LlmsSection {
  title: string;
  links: LlmsLink[];
}

export interface LlmsInput {
  siteName: string;
  summary: string;
  languageNote: string;
  sections: LlmsSection[];
}

const escapeLinkText = (value: string): string => value.replace(/[[\]]/g, (char) => `\\${char}`);
const oneLine = (value: string): string => value.replace(/\s+/g, ' ').trim();

export function buildLlmsTxt({ siteName, summary, languageNote, sections }: LlmsInput): string {
  const blocks = [`# ${siteName}`, `> ${oneLine(summary)}`, oneLine(languageNote)];
  for (const section of sections) {
    if (section.links.length === 0) continue;
    const lines = section.links.map((link) => {
      const text = `- [${escapeLinkText(oneLine(link.title))}](${link.url})`;
      return link.description ? `${text}: ${oneLine(link.description)}` : text;
    });
    blocks.push(`## ${section.title}\n\n${lines.join('\n')}`);
  }
  return `${blocks.join('\n\n')}\n`;
}
