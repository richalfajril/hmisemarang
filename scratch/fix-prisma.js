const fs = require('fs');
const glob = require('child_process').execSync('find src -type f -name "*.ts" -o -name "*.tsx"').toString().split('\n').filter(Boolean);

for (const file of glob) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('new PrismaClient()') && !file.includes('src/shared/lib/prisma.ts')) {
    console.log('Fixing', file);
    // Remove const prisma = new PrismaClient()
    content = content.replace(/const prisma = new PrismaClient\(\);?/g, '');
    
    // Check if it already imports prisma from shared lib
    if (!content.includes('@/shared/lib/prisma')) {
      // Find the last import statement or put it at the top
      content = `import { prisma } from '@/shared/lib/prisma'\n` + content;
    }
    
    fs.writeFileSync(file, content);
  }
}
