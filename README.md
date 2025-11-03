# Skills CLI

> Progressive disclosure for AI coding assistants everywhere

A zero-dependency Node.js CLI tool that brings Claude Code's Skills system to environments where the native `Skill()` function isn't available.

## Use Cases

**Perfect for:**
- 🚀 **GitHub Actions/CI** - Load domain knowledge in automated workflows
- 🔄 **Hot-swapping skills** - Test new skills before committing to Claude Code
- 💻 **Cursor, Windsurf, & other editors** - Use Claude Code skills in any AI coding assistant
- 🌍 **Any environment** - Works anywhere Node.js runs (Codex, custom tools, etc.)
- 📦 **Skill development** - Test and iterate on skills without restarting Claude Code

## Quick Start

```bash
# Clone and use
git clone https://github.com/raw391-ai/skill-cli.git
cd skill-cli
./skill-cli.js list

# Create your skills directory
mkdir -p skills/my-skill
echo "---
name: my-skill
description: Your skill description
---
# My Skill
Quick reference content here" > skills/my-skill/SKILL.md

# Use it
./skill-cli.js show my-skill
```

## Why This Exists

**Problem**: Claude Code's `Skill()` function only works in Claude Code desktop. Many environments need access to the same skills:
- GitHub Actions and CI/CD pipelines
- Cursor, Windsurf, and other AI coding tools
- Codex and custom AI integrations
- Development/testing of new skills

**Solution**: A CLI tool that provides the same progressive disclosure pattern anywhere Node.js runs, saving 70-90% of tokens compared to loading all documentation at once.

## Commands

```bash
./skill-cli.js list                    # List all available skills (~500 tokens)
./skill-cli.js show <skill-name>       # Quick reference (~1,500-3,000 tokens)
./skill-cli.js files <skill-name>      # List detail files (~100 tokens)
./skill-cli.js detail <skill> <file>   # Load full docs (~2,000-8,000 tokens)
./skill-cli.js search <query>          # Search across skills (~200-1,000 tokens)
```

## Progressive Disclosure

Load minimal context first, add more only when needed:

1. **Level 1**: `list` - See what's available
2. **Level 2**: `show` - Quick reference (start here!)
3. **Level 3**: `files` - Check what details exist
4. **Level 4**: `detail` - Full documentation (only if needed)

**Token savings: 70-90%** vs. loading everything upfront

## Skill Structure

Each skill follows this pattern:

```
skills/
└── my-skill/
    ├── SKILL.md          # Quick reference (~400 words, always loaded)
    ├── CONCEPTS.md       # Theory/fundamentals (loaded on demand)
    ├── OPERATIONS.md     # How-to guides (loaded on demand)
    ├── TECHNICAL.md      # Implementation details (loaded on demand)
    └── REFERENCE.md      # Quick lookup (loaded on demand)
```

### SKILL.md Format

```markdown
---
name: my-skill
description: Brief description for when skill should load
---

# My Skill

Quick-reference skill for [topic] with progressive detail loading.

## When to Use This Skill

Load when user asks about:
- Topic 1
- Topic 2
- Topic 3

## Quick Reference

### Most Common Question (80% of queries)

**Short, direct answer here**

Key points:
- Point 1
- Point 2
- Point 3

## Progressive Detail Loading

For deeper information, use Read tool to load:

- **CONCEPTS.md** - Theory, fundamentals, deep dives
- **OPERATIONS.md** - How-to guides, troubleshooting
- **TECHNICAL.md** - Implementation details, architecture
- **REFERENCE.md** - Formulas, constants, lookup tables

## Philosophy

[1-2 sentence core principle]
```

## Usage in GitHub Actions

### Basic Pattern

```yaml
- name: Load domain knowledge
  run: |
    # Quick reference only (1,500 tokens)
    node skill-cli.js show my-skill
```

### Conditional Loading

```yaml
- name: Load context based on changes
  run: |
    CHANGED_FILES=$(git diff --name-only origin/main...HEAD)

    if echo "$CHANGED_FILES" | grep -q "src/"; then
      node skill-cli.js show my-skill

      # Load details only if needed
      if echo "${{ github.event.pull_request.title }}" | grep -qi "architecture"; then
        node skill-cli.js detail my-skill TECHNICAL
      fi
    fi
```

### Search-Based Loading

```yaml
- name: Find relevant context
  run: |
    PR_TITLE="${{ github.event.pull_request.title }}"
    node skill-cli.js search "$PR_TITLE"
    node skill-cli.js show my-skill
```

## Environment Variables

```bash
# Override skills directory (default: ./skills)
export SKILLS_DIR=/path/to/skills
./skill-cli.js list
```

## Platform-Specific Usage

### Cursor / Windsurf / AI Coding Tools

Use skill-cli to access Claude Code skills in any AI coding assistant:

```bash
# 1. Clone your Claude Code skills (or create new ones)
mkdir -p ~/my-project/.ai-skills
cp -r ~/.claude/skills/* ~/my-project/.ai-skills/

# 2. In your AI chat, ask Claude to run:
SKILLS_DIR=.ai-skills ./skill-cli.js show my-skill

# 3. Or add to your project's instructions:
# "Use ./skill-cli.js in .ai-skills/ to load domain knowledge"
```

**Pro tip**: Add skill-cli to your project repo so AI assistants can use your skills automatically!

### Hot-Swapping Skills (Development)

Test new skills without restarting Claude Code:

```bash
# 1. Create/edit a skill in a separate directory
mkdir -p /tmp/test-skills/new-skill
vim /tmp/test-skills/new-skill/SKILL.md

# 2. Test it immediately
SKILLS_DIR=/tmp/test-skills ./skill-cli.js show new-skill

# 3. Iterate rapidly
vim /tmp/test-skills/new-skill/SKILL.md
SKILLS_DIR=/tmp/test-skills ./skill-cli.js show new-skill

# 4. When satisfied, move to Claude Code skills directory
cp -r /tmp/test-skills/new-skill ~/.claude/skills/
```

**Use case**: Develop and test skills without polluting your main skills directory or restarting your IDE.

### Codex / Custom AI Tools

Integrate with any AI tool that can execute commands:

```bash
# Tell your AI tool where skills live
export SKILLS_DIR=/path/to/skills

# AI can now query skills on-demand
./skill-cli.js search "relevant concept"
./skill-cli.js show discovered-skill
```

### CI/CD Pipelines (Jenkins, GitLab, etc.)

Works with any CI system that runs bash:

```bash
# Jenkins/GitLab CI
script:
  - git clone https://github.com/raw391-ai/skill-cli.git
  - export SKILLS_DIR=./project-skills
  - ./skill-cli/skill-cli.js show deployment-skill
```

## Token Efficiency

| Method | Tokens | Use Case |
|--------|--------|----------|
| `list` | ~500 | See what's available |
| `show` | 1,500-3,000 | **Start here (90% of cases)** |
| `files` | ~100 | Check what details exist |
| `detail` | 2,000-8,000 | Deep dive (only if needed) |
| `search` | 200-1,000 | Find concepts |
| **Loading all files** | **20,000+** | **Don't do this** |

## Creating Skills

See [SKILL-CREATION-GUIDE.md](SKILL-CREATION-GUIDE.md) for detailed guidance on:

- The 400-word rule for SKILL.md
- Progressive disclosure patterns
- Token budget guidelines
- Avoiding common anti-patterns

**Golden Rules:**
1. SKILL.md < 500 words (always)
2. Answer common questions, reference complex ones
3. Progressive disclosure - load details on-demand
4. No duplication - each fact lives in one place
5. Purpose-driven files - one clear purpose per file

## Examples

### Example 1: Simple Quick Reference

```bash
./skill-cli.js show my-skill
# Output: Quick reference (1,500 tokens)
# Usually sufficient - done!
```

### Example 2: Need More Details

```bash
./skill-cli.js show my-skill
# Output: Quick reference points to CONCEPTS.md

./skill-cli.js detail my-skill CONCEPTS
# Output: Full conceptual explanation (4,000 tokens)
```

### Example 3: Find Relevant Context

```bash
./skill-cli.js search "error handling"
# Shows which skills/files mention it

./skill-cli.js show error-handling-skill
```

## Comparison

| Feature | Claude Code Skills | skill-cli | cat all files |
|---------|-------------------|-----------|---------------|
| **GitHub Actions** | ❌ No | ✅ Yes | ✅ Yes |
| **Progressive disclosure** | ✅ Yes | ✅ Yes | ❌ No |
| **Token efficient** | ✅ Yes | ✅ Yes | ❌ No |
| **Searchable** | ✅ Yes | ✅ Yes | ❌ No |
| **Setup** | Built-in | `chmod +x` | None |
| **Dependencies** | None | Node.js | None |

## Contributing

1. Fork this repository
2. Create your skill following the guidelines
3. Test with `./skill-cli.js show your-skill`
4. Submit a pull request

## License

MIT

## Credits

Inspired by [Claude Code's Skills system](https://docs.claude.com/claude-code) and progressive disclosure UX patterns.

---

**Key Insight**: Progressive disclosure saves 70-90% of tokens by loading only what Claude needs, when it needs it.
