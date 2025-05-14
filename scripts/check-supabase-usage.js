#!/usr/bin/env node

/**
 * Script para verificar o uso direto do cliente Supabase no código
 *
 * Este script procura padrões que possam indicar o uso do cliente Supabase
 * em vez da API REST.
 *
 * Uso:
 * node scripts/check-supabase-usage.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Padrões a serem procurados
const patterns = [
  "useSupabase",
  "createClient\\(\\)",
  "createSupabaseClient",
  "from\\(['\"]medias['\"]\\)",
  "from\\(['\"]posts['\"]\\)",
  "from\\(['\"]profiles['\"]\\)",
  "storage\\.from\\(",
  "supabase\\.storage",
  "supabase\\.from",
  "supabase\\.",
  "@supabase/supabase-js",
  "createBrowserSupabaseClient",
  "createServerSupabaseClient",
];

console.log("Verificando o uso direto do cliente Supabase no código...\n");

let totalMatches = 0;

// Verificar cada padrão separadamente
patterns.forEach((pattern) => {
  try {
    // Executar grep para encontrar o padrão
    const command = `grep -r --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" "${pattern}" src app components lib hooks`;
    const result = execSync(command, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    });

    const lines = result
      .trim()
      .split("\n")
      .filter((line) => line.trim() !== "");

    if (lines.length > 0) {
      console.log(
        `🔍 Encontrado padrão "${pattern}" em ${lines.length} lugares:`
      );

      lines.forEach((line) => {
        // Exibir apenas o caminho do arquivo e a linha específica
        const match = line.match(/^([^:]+):(\d+):(.*)/);
        if (match) {
          const [, filePath, lineNumber, content] = match;
          console.log(`  📄 ${filePath}:${lineNumber}`);
          console.log(`     ${content.trim()}`);
          console.log();
        } else {
          console.log(`  ${line}`);
        }
      });

      totalMatches += lines.length;
    }
  } catch (error) {
    // Grep retorna status de saída 1 quando nenhuma correspondência é encontrada
    if (error.status !== 1) {
      console.error(`Erro ao procurar padrão "${pattern}":`, error.message);
    }
  }
});

// Arquivo de compatibilidade
const compatibilityFiles = ["components/providers/supabase-provider.tsx"];

console.log(
  "Arquivos de compatibilidade que devem ser removidos depois da migração completa:"
);
compatibilityFiles.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    console.log(`  ⚠️  ${filePath} (ainda presente)`);
  } else {
    console.log(`  ✅  ${filePath} (já removido)`);
  }
});

console.log("\nResumo:");
if (totalMatches === 0) {
  console.log("✅ Nenhum uso direto do cliente Supabase encontrado!");
} else {
  console.log(
    `⚠️  Encontrados ${totalMatches} usos diretos do cliente Supabase no código.`
  );
  console.log("   Considere migrar esses casos para a API REST.");
}

// Verificar se o supabase-provider está sendo usado no layout
try {
  const layoutContent = fs.readFileSync("app/layout.tsx", "utf-8");
  if (layoutContent.includes("<SupabaseProvider>")) {
    console.log(
      "\n⚠️  O SupabaseProvider ainda está presente no layout da aplicação."
    );
    console.log("   Considere removê-lo após a migração completa.");
  }
} catch (error) {
  console.error("Erro ao verificar o arquivo de layout:", error.message);
}
