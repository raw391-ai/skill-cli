# Skills CLI Quickstart

**Problem**: AI assistants in GitHub Actions can't access Claude Code's `Skill()` function ❌

**Solution**: Use the Skills CLI for progressive disclosure ✅

## 30-Second Setup

```bash
# 1. Create a skill
mkdir -p skills/my-skill
cat > skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: Your domain knowledge
---
# My Skill
Quick reference content here.
EOF

# 2. Use it
./skill-cli.js show my-skill
```

That's it! Claude now has access to your domain knowledge.

## 5 Essential Commands

```bash
# 1. List available skills (< 500 tokens)
./skill-cli.js list

# 2. Load quick reference (< 2000 tokens) - START HERE
./skill-cli.js show my-skill

# 3. Check what details exist (< 100 tokens)
./skill-cli.js files my-skill

# 4. Load full documentation (2000-8000 tokens) - ONLY IF NEEDED
./skill-cli.js detail my-skill CONCEPTS

# 5. Search for concepts (200-1000 tokens)
./skill-cli.js search "search term"
```

## Real-World Example

### Creating Your First Skill

```bash
# Create skill directory
mkdir -p skills/api-patterns

# Create quick reference
cat > skills/api-patterns/SKILL.md << 'EOF'
---
name: api-patterns
description: REST API design patterns and conventions
---

# API Patterns

Quick-reference skill for API design patterns.

## Quick Reference

### REST Endpoints

- **GET** /resources - List all
- **GET** /resources/:id - Get one
- **POST** /resources - Create
- **PUT** /resources/:id - Update
- **DELETE** /resources/:id - Delete

### Status Codes

- 200 OK - Success
- 201 Created - Resource created
- 400 Bad Request - Invalid input
- 404 Not Found - Resource doesn't exist
- 500 Server Error - Internal error

## Progressive Detail Loading

For deeper information:
- **CONVENTIONS.md** - Naming, versioning, pagination
- **SECURITY.md** - Auth, rate limiting, CORS
- **EXAMPLES.md** - Full endpoint examples
EOF

# Create detail file
cat > skills/api-patterns/CONVENTIONS.md << 'EOF'
# API Conventions

## Naming
- Use plural nouns: /users not /user
- Use kebab-case: /user-profiles not /userProfiles
- Nest resources: /users/123/posts

## Versioning
- URL versioning: /v1/users
- Header versioning: Accept: application/vnd.api.v1+json

## Pagination
- Use offset/limit or cursor-based
- Include total count in response
EOF
```

### Using Your Skill

```bash
# Quick reference (520 tokens)
./skill-cli.js show api-patterns

# Check available details
./skill-cli.js files api-patterns
# Output: CONVENTIONS, SECURITY, EXAMPLES

# Load specific detail
./skill-cli.js detail api-patterns CONVENTIONS
```

**Tokens**: 520 → 2,100 (vs. 8,000 loading all)

## In GitHub Actions

### Pattern 1: Always Load Quick Refs

```yaml
- name: Provide context
  run: |
    node skill-cli.js show api-patterns
    node skill-cli.js show testing-patterns
```

### Pattern 2: Conditional Loading

```yaml
- name: Load context based on changes
  run: |
    if git diff --name-only | grep -q "api/"; then
      node skill-cli.js detail api-patterns SECURITY
    fi
```

### Pattern 3: Search-Based

```yaml
- name: Find relevant context
  run: |
    PR_TITLE="${{ github.event.pull_request.title }}"
    node skill-cli.js search "$PR_TITLE"
```

## Token Savings

| Method | Tokens | Use Case |
|--------|--------|----------|
| `list` | ~500 | See what's available |
| `show` | 1,500-3,000 | **Start here (90% of cases)** |
| `files` | ~100 | Check what details exist |
| `detail` | 2,000-8,000 | Deep dive (only if needed) |
| `search` | 200-1,000 | Find concepts |
| **Traditional (cat all)** | **20,000+** | **Don't do this** |

## Progressive Disclosure Pattern

1. **List** → See what skills exist
2. **Show** → Get quick reference (usually sufficient)
3. **Files** → Check what detailed docs exist (if needed)
4. **Detail** → Load full docs (only when necessary)

**Key**: Load minimal context first, add more only when needed.

## Common Mistakes

❌ **Loading everything upfront**
```bash
cat skills/*/*.md  # 20,000+ tokens
```

✅ **Progressive disclosure**
```bash
./skill-cli.js show my-skill  # 1,500 tokens
# Only if needed:
./skill-cli.js detail my-skill CONCEPTS  # +4,000 tokens
```

❌ **Not checking what's available**
```bash
# Just guessing what exists
./skill-cli.js detail my-skill RANDOM
```

✅ **Check first**
```bash
./skill-cli.js files my-skill  # See what exists
./skill-cli.js detail my-skill CONCEPTS  # Load specific file
```

## Next Steps

- Read [SKILL-CREATION-GUIDE.md](SKILL-CREATION-GUIDE.md) for best practices
- See [README.md](README.md) for complete documentation
- Check `skills/` directory for example skills

## Key Insight

**Progressive disclosure saves 70-90% of tokens** by loading only what Claude needs, when it needs it.

Start with `show`, load `detail` only when necessary.
