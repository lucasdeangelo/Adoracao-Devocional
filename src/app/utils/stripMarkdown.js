// utils/stripMarkdown.ts
export function stripMarkdown(markdown){
  return markdown
    .replace(/[#>*_`~\-]+/g, '')         // remove #, *, >, _, ` etc.
    .replace(/\!\[.*?\]\(.*?\)/g, '')    // remove imagens
    .replace(/\[.*?\]\(.*?\)/g, '')      // remove links
    .replace(/^\s*\n/gm, '')             // remove linhas em branco
    .trim();
}
