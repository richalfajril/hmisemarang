const fs = require('fs');
const glob = require('child_process').execSync('find src -type f -name "*.ts" -o -name "*.tsx"').toString().split('\n').filter(Boolean);

for (const file of glob) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('@/shared/lib/prisma')) {
    const lines = content.split('\n');
    const newLines = [];
    let hasDirective = false;
    let directiveLine = '';
    let importLine = "import { prisma } from '@/shared/lib/prisma'";

    // Remove any existing import of prisma
    let filtered = lines.filter(l => !l.includes("import { prisma } from '@/shared/lib/prisma'"));

    // Check if first line or so is 'use server' or 'use client'
    if (filtered[0] && (filtered[0].includes("'use server'") || filtered[0].includes('"use server"') || filtered[0].includes("'use client'") || filtered[0].includes('"use client"'))) {
      hasDirective = true;
      directiveLine = filtered[0];
      filtered.shift();
    }

    // Now remove unused PrismaClient import if possible
    // Wait, let's just make sure we insert the import after directive
    let finalLines = [];
    if (hasDirective) {
      finalLines.push(directiveLine);
    }
    finalLines.push(importLine);
    finalLines.push(...filtered);

    // Write back
    fs.writeFileSync(file, finalLines.join('\n'));
    console.log('Fixed imports in', file);
  }
}
