#!/usr/bin/env node

/**
 * Skills CLI - Progressive Disclosure for AI Coding Assistants
 *
 * Mimics the Claude Code Skills system for use in CI/CD environments
 * where Claude doesn't have access to the Skill() function.
 *
 * Usage:
 *   ./skill-cli.js list                       # List all available skills
 *   ./skill-cli.js show <skill-name>          # Show quick reference
 *   ./skill-cli.js files <skill-name>         # List available detail files
 *   ./skill-cli.js detail <skill-name> <file> # Load detailed file
 *   ./skill-cli.js search <query>             # Search across skills
 *   ./skill-cli.js --version                  # Show version
 *
 * Key feature: Progressive disclosure - shows minimal info first,
 * load more only when needed (saves tokens in CI environments)
 */

const fs = require('fs');
const path = require('path');

// Get version from package.json
let version = '0.1.0';
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  version = packageJson.version || version;
} catch (e) {
  // Ignore if package.json not found
}

// Skills directory - can be overridden via SKILLS_DIR env var
const SKILLS_DIR = process.env.SKILLS_DIR || path.join(__dirname, 'skills');
const SKILL_FILE = 'SKILL.md';

// Parse frontmatter from markdown
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content };

  const frontmatter = match[1];
  const body = match[2];
  const meta = {};

  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      meta[key.trim()] = valueParts.join(':').trim();
    }
  });

  return { meta, content: body };
}

// Get all available skills
function listSkills() {
  const skills = [];
  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillPath = path.join(SKILLS_DIR, entry.name, SKILL_FILE);
    if (!fs.existsSync(skillPath)) continue;

    const content = fs.readFileSync(skillPath, 'utf8');
    const { meta } = parseFrontmatter(content);

    skills.push({
      name: entry.name,
      description: meta.description || 'No description',
      path: skillPath
    });
  }

  return skills;
}

// Show skill quick reference
function showSkill(skillName) {
  const skillPath = path.join(SKILLS_DIR, skillName, SKILL_FILE);

  if (!fs.existsSync(skillPath)) {
    console.error(`❌ Skill not found: ${skillName}`);
    process.exit(1);
  }

  const content = fs.readFileSync(skillPath, 'utf8');
  const { meta, content: body } = parseFrontmatter(content);

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📚 ${meta.name || skillName}`);
  console.log(`${'═'.repeat(60)}\n`);
  console.log(body);
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`💡 For more details, use: ./skill-cli.js files ${skillName}`);
  console.log(`${'═'.repeat(60)}\n`);
}

// List available detail files for a skill
function listDetailFiles(skillName) {
  const skillDir = path.join(SKILLS_DIR, skillName);

  if (!fs.existsSync(skillDir)) {
    console.error(`❌ Skill not found: ${skillName}`);
    process.exit(1);
  }

  const files = fs.readdirSync(skillDir)
    .filter(f => f.endsWith('.md') && f !== SKILL_FILE && f !== 'README.md')
    .sort();

  if (files.length === 0) {
    console.log(`\n📄 ${skillName} has no additional detail files\n`);
    return;
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📁 ${skillName} - Available Detail Files`);
  console.log(`${'═'.repeat(60)}\n`);

  files.forEach((file, idx) => {
    const basename = path.basename(file, '.md');
    console.log(`  ${idx + 1}. ${basename.padEnd(20)} (${file})`);
  });

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`💡 Load a file: ./skill-cli.js detail ${skillName} ${path.basename(files[0], '.md')}`);
  console.log(`${'═'.repeat(60)}\n`);
}

// Show detailed file
function showDetail(skillName, detailName) {
  const skillDir = path.join(SKILLS_DIR, skillName);

  if (!fs.existsSync(skillDir)) {
    console.error(`❌ Skill not found: ${skillName}`);
    process.exit(1);
  }

  // Try with .md extension
  let detailPath = path.join(skillDir, `${detailName}.md`);
  if (!fs.existsSync(detailPath)) {
    // Try uppercase
    detailPath = path.join(skillDir, `${detailName.toUpperCase()}.md`);
  }

  if (!fs.existsSync(detailPath)) {
    console.error(`❌ Detail file not found: ${detailName}`);
    console.error(`   Try: ./skill-cli.js files ${skillName}`);
    process.exit(1);
  }

  const content = fs.readFileSync(detailPath, 'utf8');

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📖 ${skillName} / ${detailName}`);
  console.log(`${'═'.repeat(60)}\n`);
  console.log(content);
  console.log(`\n${'═'.repeat(60)}\n`);
}

// Search across all skills
function searchSkills(query) {
  const skills = listSkills();
  const results = [];

  const lowerQuery = query.toLowerCase();

  for (const skill of skills) {
    const skillDir = path.join(SKILLS_DIR, skill.name);
    const files = fs.readdirSync(skillDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
      const filePath = path.join(skillDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        if (line.toLowerCase().includes(lowerQuery)) {
          results.push({
            skill: skill.name,
            file: file,
            line: idx + 1,
            content: line.trim()
          });
        }
      });
    }
  }

  if (results.length === 0) {
    console.log(`\n❌ No results found for: "${query}"\n`);
    return;
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🔍 Search Results for "${query}" (${results.length} matches)`);
  console.log(`${'═'.repeat(60)}\n`);

  // Group by skill
  const grouped = {};
  results.forEach(r => {
    if (!grouped[r.skill]) grouped[r.skill] = [];
    grouped[r.skill].push(r);
  });

  Object.entries(grouped).forEach(([skillName, matches]) => {
    console.log(`📚 ${skillName} (${matches.length} matches)`);
    matches.slice(0, 3).forEach(m => {
      console.log(`   ${m.file}:${m.line} - ${m.content.substring(0, 60)}...`);
    });
    if (matches.length > 3) {
      console.log(`   ... and ${matches.length - 3} more`);
    }
    console.log();
  });

  console.log(`${'═'.repeat(60)}\n`);
}

// Main CLI
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    console.log(`
${'═'.repeat(60)}
📚 Skills CLI - Progressive Disclosure for GitHub Actions
${'═'.repeat(60)}

USAGE:
  ./skill-cli.js <command> [args]

COMMANDS:
  list                          List all available skills
  show <skill-name>             Show skill quick reference
  files <skill-name>            List available detail files
  detail <skill-name> <file>    Load a specific detail file
  search <query>                Search across all skills
  help, --help, -h              Show this help
  --version, -v                 Show version

EXAMPLES:
  ./skill-cli.js list
  ./skill-cli.js show my-skill
  ./skill-cli.js files my-skill
  ./skill-cli.js detail my-skill CONCEPTS
  ./skill-cli.js search "search term"
  ./skill-cli.js --version

PROGRESSIVE DISCLOSURE:
  1. Start with 'list' to see what's available
  2. Use 'show' to get quick reference (minimal tokens)
  3. Use 'files' to see what detailed docs exist
  4. Use 'detail' to load full documentation (only when needed)

This saves tokens in CI environments where context is limited!
${'═'.repeat(60)}
`);
    return;
  }

  if (command === '--version' || command === '-v') {
    console.log(version);
    return;
  }

  switch (command) {
    case 'list':
      const skills = listSkills();
      console.log(`\n${'═'.repeat(60)}`);
      console.log(`📚 Available Skills (${skills.length})`);
      console.log(`${'═'.repeat(60)}\n`);
      skills.forEach(s => {
        console.log(`  • ${s.name.padEnd(25)} - ${s.description}`);
      });
      console.log(`\n${'─'.repeat(60)}`);
      console.log(`💡 View a skill: ./skill-cli.js show <skill-name>`);
      console.log(`${'═'.repeat(60)}\n`);
      break;

    case 'show':
      if (!args[1]) {
        console.error('❌ Usage: ./skill-cli.js show <skill-name>');
        process.exit(1);
      }
      showSkill(args[1]);
      break;

    case 'files':
      if (!args[1]) {
        console.error('❌ Usage: ./skill-cli.js files <skill-name>');
        process.exit(1);
      }
      listDetailFiles(args[1]);
      break;

    case 'detail':
      if (!args[1] || !args[2]) {
        console.error('❌ Usage: ./skill-cli.js detail <skill-name> <file-name>');
        process.exit(1);
      }
      showDetail(args[1], args[2]);
      break;

    case 'search':
      if (!args[1]) {
        console.error('❌ Usage: ./skill-cli.js search <query>');
        process.exit(1);
      }
      searchSkills(args.slice(1).join(' '));
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      console.error(`   Try: ./skill-cli.js help`);
      process.exit(1);
  }
}

main();
