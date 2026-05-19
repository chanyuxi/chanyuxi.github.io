优化 Footer

- 内联掉 `...ClassName` 变量，以 tw 的 `dark:` 特性做，把 `样式需求优先遵循 Tailwindcss 所能提供的能力，否则才回退到其他实现` 理念写入 AGENTS.md
- 移动 version 到 constants/index.ts 中导出，把 `可能被全局共享的常量写入 constants` 理念写入 AGENTS.md
- 实现 footerGroups 中配置的链接支持跳转
