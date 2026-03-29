/**
 * Assembles a final prompt from a base template and user input.
 */
export function buildPrompt(baseTemplate: string, userInput: string): string {
  return `${baseTemplate}

\u3010\u7528\u6237\u8F93\u5165\u3011
${userInput}

\u3010\u8BF4\u660E\u3011
\u8BF7\u4E25\u683C\u6309\u7167\u4E0A\u9762\u7684\u6A21\u5757\u8BF4\u660E\u3001\u8F93\u5165\u8981\u6C42\u3001\u6267\u884C\u6B65\u9AA4\u4E0E\u8F93\u51FA\u683C\u5F0F\u8FDB\u884C\u5904\u7406\uFF0C\u4E0D\u8981\u504F\u9898\u3002`;
}
