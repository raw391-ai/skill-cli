---
name: example-skill
description: Example skill demonstrating progressive disclosure pattern
---

# Example Skill

Quick-reference skill demonstrating the progressive disclosure pattern.

## When to Use This Skill

Load when you want to see:
- How to structure a skill
- Progressive disclosure in action
- Best practices for token efficiency

## Quick Reference

### Most Common Question: What is Progressive Disclosure?

**Load minimal info first, add details only when needed**

Benefits:
- 70-90% token savings
- Faster initial context loading
- Better user experience
- Pay for what you need

Formula: `tokens_saved = total_tokens - (quick_ref + needed_details)`

### How Skills Are Structured

```
skills/
└── skill-name/
    ├── SKILL.md       # This file (~400 words, always loaded)
    ├── CONCEPTS.md    # Theory (loaded on demand)
    ├── OPERATIONS.md  # How-to guides (loaded on demand)
    ├── TECHNICAL.md   # Implementation (loaded on demand)
    └── REFERENCE.md   # Quick lookup (loaded on demand)
```

### Common Misconceptions

1. **"Load everything upfront for best results"** → NO: Progressive loading is better
2. **"SKILL.md should be comprehensive"** → NO: Keep it minimal, point to details
3. **"All queries need full context"** → NO: 80% of queries need quick reference only

## Progressive Detail Loading

For deeper information, use Read tool to load:

- **CONCEPTS.md** - Theory, fundamentals, philosophy of progressive disclosure
- **OPERATIONS.md** - How to create skills, manage token budgets
- **TECHNICAL.md** - Implementation details, file formats
- **REFERENCE.md** - Command reference, token estimates

## Quick Answers Guide

**User asks "what is progressive disclosure?"** → Answer from Quick Reference above
**User asks "why" or theory** → Read CONCEPTS.md
**User asks "how to create a skill"** → Read OPERATIONS.md
**User needs technical details** → Read TECHNICAL.md
**User needs command reference** → Read REFERENCE.md

## Key Commands

```bash
./skill-cli.js show example-skill      # Load this quick reference
./skill-cli.js files example-skill     # See available detail files
./skill-cli.js detail example-skill CONCEPTS  # Load concepts
```

## Philosophy

**Answer the common, reference the complex.** SKILL.md provides quick answers for 80% of questions, while detail files handle the remaining 20% that need deeper explanation.
