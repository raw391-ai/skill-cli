# Operations Guide

Practical how-to for creating, managing, and optimizing skills.

## Creating Your First Skill

### Step 1: Create Directory Structure

```bash
mkdir -p skills/my-skill
cd skills/my-skill
```

### Step 2: Create SKILL.md

```markdown
---
name: my-skill
description: Brief description for when skill should load
---

# My Skill

Quick-reference skill for [topic].

## When to Use This Skill

Load when user asks about:
- Topic A
- Topic B
- Topic C

## Quick Reference

### Most Common Question

**Direct answer here**

Key points:
- Point 1
- Point 2

## Progressive Detail Loading

For deeper information:
- **CONCEPTS.md** - Theory and fundamentals
- **OPERATIONS.md** - How-to guides
- **TECHNICAL.md** - Implementation details

## Philosophy

[One sentence core principle]
```

### Step 3: Test It

```bash
cd ../..  # Back to repo root
./skill-cli.js show my-skill
```

### Step 4: Add Detail Files (Optional)

Only create detail files if:
- SKILL.md is approaching 500 words
- Users need deeper explanations
- There's specialized content (how-tos, technical specs, etc.)

## Managing Token Budgets

### Word Count Guidelines

```bash
# Check word counts
wc -w skills/my-skill/*.md

# Target ranges:
# SKILL.md:       300-500 words (~400-650 tokens)
# Detail files:   1,000-2,000 words (~1,300-2,600 tokens)
```

### Token Estimation

Quick formula: `tokens ≈ words × 1.3`

### Budget Allocation

For a skill with 10,000 words total:

```
SKILL.md:        400 words (4%)   - Always loaded
CONCEPTS.md:     2,000 words (20%) - Load for "why" questions
OPERATIONS.md:   1,800 words (18%) - Load for "how" questions
TECHNICAL.md:    2,000 words (20%) - Load for implementation
REFERENCE.md:    1,500 words (15%) - Load for lookups
EXAMPLES.md:     2,300 words (23%) - Load for code examples
```

Typical query loads 4-24% of total content, not 100%.

## Common Workflows

### Workflow 1: Simple Skill (No Detail Files)

```bash
# 1. Create SKILL.md only
echo "---
name: quick-tips
description: Quick reference tips
---
# Tips
- Tip 1
- Tip 2
- Tip 3" > skills/quick-tips/SKILL.md

# 2. Use it
./skill-cli.js show quick-tips
```

### Workflow 2: Comprehensive Skill

```bash
# 1. Create SKILL.md (quick reference)
vim skills/comprehensive/SKILL.md

# 2. Create detail files
vim skills/comprehensive/CONCEPTS.md
vim skills/comprehensive/OPERATIONS.md
vim skills/comprehensive/TECHNICAL.md

# 3. Test progression
./skill-cli.js show comprehensive        # Quick ref
./skill-cli.js files comprehensive       # List details
./skill-cli.js detail comprehensive CONCEPTS  # Load detail
```

### Workflow 3: Migrating Existing Docs

```bash
# 1. Analyze existing docs
wc -w docs/*.md
# Identify most common questions (check issues, FAQs, support)

# 2. Extract quick reference
# Take top 3-5 questions, create SKILL.md with brief answers

# 3. Organize remaining content
# Split into CONCEPTS, OPERATIONS, TECHNICAL, etc.

# 4. Add progressive disclosure section
# Point users to appropriate detail files
```

## Troubleshooting

### Issue: SKILL.md Too Large

**Symptom**: Word count > 500

**Solution**:
1. Identify content that's not answering top 5 common questions
2. Move to appropriate detail file
3. Add pointer in SKILL.md

### Issue: Users Don't Know Which Detail File to Load

**Symptom**: Confusion about when to load what

**Solution**:
Add "Quick Answers Guide" section to SKILL.md:

```markdown
## Quick Answers Guide

**User asks "what is X?"** → Answer in Quick Reference above
**User asks "why X?"** → Read CONCEPTS.md
**User asks "how to Y?"** → Read OPERATIONS.md
**User needs code** → Read TECHNICAL.md
```

### Issue: Duplicate Information Across Files

**Symptom**: Same content in SKILL.md and detail file

**Solution**:
1. Remove from detail file if it's in SKILL.md, OR
2. Keep brief version in SKILL.md, full version in detail file

Rule: Each fact lives in exactly one place.

### Issue: Detail Files Too Long

**Symptom**: Detail file > 3,000 words

**Solution**:
Split into multiple focused files:

```
CONCEPTS.md → CONCEPTS-BASICS.md + CONCEPTS-ADVANCED.md
TECHNICAL.md → ARCHITECTURE.md + API.md + INTEGRATION.md
```

## Optimization Techniques

### Technique 1: Usage-Based Restructuring

Track what users ask:

```bash
# After 100 queries, analyze:
# - Which questions appear most?
# - What detail files are loaded most?

# Move frequently-needed content to SKILL.md
# Demote rarely-needed content to detail files
```

### Technique 2: Table-Based Quick Reference

Replace paragraphs with tables:

```markdown
### Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Success |
| 201 | Created | New resource |
| 400 | Bad Request | Invalid input |
```

Tables are more token-efficient for lookup data.

### Technique 3: Minimal Examples

In SKILL.md, use one-liners:

```markdown
### Example

`result = calculate(input)`

For full examples → EXAMPLES.md
```

### Technique 4: Progressive Refinement

Start simple, add complexity:

1. **Version 1**: SKILL.md only
2. **Version 2**: Add CONCEPTS.md when users ask "why"
3. **Version 3**: Add OPERATIONS.md when users ask "how"
4. **Version 4**: Add TECHNICAL.md when users need implementation

Don't build all detail files upfront - create as needed.

## Quality Checklist

Before publishing a skill:

- [ ] SKILL.md < 500 words
- [ ] Top 3-5 common questions answered in quick reference
- [ ] Progressive disclosure section present
- [ ] Clear pointers to detail files
- [ ] No duplicate content across files
- [ ] Tested with `./skill-cli.js show <skill>`
- [ ] Word counts checked: `wc -w *.md`
- [ ] Frontmatter includes name and description

## Integration with CI/CD

### GitHub Actions Example

```yaml
- name: Load skill context
  run: |
    # Always load quick reference
    ./skill-cli.js show my-skill

    # Conditionally load details
    if [[ "${{ github.event.pull_request.title }}" =~ "architecture" ]]; then
      ./skill-cli.js detail my-skill TECHNICAL
    fi
```

### Environment Variable Override

```yaml
- name: Load from custom directory
  run: |
    export SKILLS_DIR=/path/to/skills
    ./skill-cli.js show my-skill
```

## Maintenance

### Regular Reviews

Quarterly reviews:
1. Check word counts - any files growing too large?
2. Review usage patterns - what's being loaded?
3. Update quick reference - new common questions?
4. Prune obsolete content - anything outdated?

### Version Control

Skills should be versioned with your codebase:

```bash
git add skills/
git commit -m "Update my-skill with new examples"
```

This ensures skills stay in sync with code.

## Advanced Patterns

### Pattern 1: Conditional Skill Loading

Load different skills based on context:

```bash
# In CI
if [[ "$PR_FILES" =~ "frontend" ]]; then
  ./skill-cli.js show frontend-skill
elif [[ "$PR_FILES" =~ "backend" ]]; then
  ./skill-cli.js show backend-skill
fi
```

### Pattern 2: Skill Composition

Combine multiple skills:

```bash
./skill-cli.js show architecture    # High-level design
./skill-cli.js show api-patterns    # Specific patterns
./skill-cli.js show security        # Security concerns
```

### Pattern 3: Dynamic Search

Let AI find relevant skills:

```bash
PR_TITLE="Fix authentication bug in login flow"
./skill-cli.js search "authentication"
# Shows relevant skills, AI decides which to load
```

## Key Takeaways

1. **Start small** - SKILL.md only, add details later
2. **Measure everything** - Word counts, token estimates, usage patterns
3. **Iterate based on usage** - Move common content to quick reference
4. **Test regularly** - Ensure commands work, content is current
5. **No premature optimization** - Don't create detail files you don't need yet
