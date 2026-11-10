import { marked, Renderer } from "marked";
import sanitizeHtml from "sanitize-html";
import { slugify } from "./format";

export async function renderGithubMarkdown(
  markdown: string,
  repositoryUrl: string,
  branch: string,
): Promise<string> {
  const baseUrl = `${repositoryUrl}/blob/${branch}/`;
  const renderer = new Renderer();
  renderer.heading = function heading({ tokens, depth }) {
    const inline = this.parser.parseInline(tokens);
    const plainText = sanitizeHtml(inline, {
      allowedTags: [],
      allowedAttributes: {},
    });
    return `<h${depth} id="${slugify(plainText)}">${inline}</h${depth}>\n`;
  };
  const rendered = await marked.parse(markdown, {
    gfm: true,
    breaks: false,
    renderer,
  });

  return sanitizeHtml(rendered, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "details",
      "summary",
      "picture",
      "source",
    ]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      code: ["class"],
      pre: ["class"],
      span: ["class"],
      h1: ["id"],
      h2: ["id"],
      h3: ["id"],
    },
    transformTags: {
      a(tagName, attributes) {
        const href = resolveUrl(attributes.href, baseUrl);
        const external = Boolean(href && /^https?:\/\//i.test(href));
        return {
          tagName,
          attribs: {
            ...attributes,
            ...(href ? { href } : {}),
            ...(external ? { target: "_blank", rel: "noreferrer noopener" } : {}),
          },
        };
      },
      img(tagName, attributes) {
        return {
          tagName,
          attribs: {
            ...attributes,
            ...(attributes.src
              ? { src: resolveUrl(attributes.src, baseUrl) ?? attributes.src }
              : {}),
            loading: "lazy",
          },
        };
      },
    },
  });
}

function resolveUrl(value: string | undefined, baseUrl: string): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("#")) return value;
  try {
    return new URL(value, baseUrl).href;
  } catch {
    return value;
  }
}
