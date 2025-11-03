# Claude Skill Creation Guide: Avoiding Token Bloat

A practical guide to creating efficient, token-optimized Claude skills using progressive disclosure.

## The Token Problem

**Every time a skill is loaded, ALL content in SKILL.md is sent as context tokens.**

### Real Example: Domain-Specific Skill

**Before optimization:**
- SKILL.md: ~1,500 words = ~1,900 tokens
- Simple question: Used 1,900 tokens
- **Only needed ~200 tokens worth of info**
- **Overhead: 850% waste**

**After optimization:**
- SKILL.md: ~390 words = ~500 tokens
- Same question: Uses 500 tokens
- **Token savings: 74%**

## Core Principles

### 1. Progressive Disclosure

**Don't load everything upfront. Load details on-demand.**

```
SKILL.md (always loaded)
├── Quick overview
├── Most common answers
├── Pointers to detail files
└── When to load each file

Detail files (loaded only when needed)
├── CONCEPTS.md
├── OPERATIONS.md
├── TECHNICAL.md
└── REFERENCE.md
```

### 2. The 400-Word Rule

**SKILL.md should be ~400 words maximum.**

- Quick reference for common questions
- Clear pointers to detail files
- No deep dives
- No exhaustive examples

### 3. Answer Simple, Reference Complex

**SKILL.md should:**
- ✅ Answer the top 3-5 most common questions directly
- ✅ Provide quick lookup tables/formulas
- ✅ Correct common misconceptions
- ❌ Not include detailed explanations
- ❌ Not include comprehensive guides
- ❌ Not include extensive examples

## File Structure Template

### SKILL.md (~400 words)

```markdown
---
name: skill-name
description: Brief description for when skill should load
---

# Skill Name

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

### Second Most Common Question

**Short answer**

### Common Misconceptions

1. **"Wrong belief"** → Correct understanding
2. **"Another wrong belief"** → Correction

## Progressive Detail Loading

For deeper information, use Read tool to load:

- **CONCEPTS.md** - Theory, fundamentals, deep dives
- **OPERATIONS.md** - How-to guides, troubleshooting
- **TECHNICAL.md** - Implementation details, architecture
- **REFERENCE.md** - Formulas, constants, lookup tables

## Quick Answers Guide

**User asks X** → Answer from Quick Reference above
**User asks "why" or theory** → Read CONCEPTS.md
**User has problems** → Read OPERATIONS.md
**User needs code/architecture** → Read TECHNICAL.md
**User needs formula/lookup** → Read REFERENCE.md

## Philosophy

[1-2 sentence core principle]
```

### Detail Files (~1,500-2,000 words each)

**CONCEPTS.md** - Theory and fundamentals
```markdown
# Concepts

Deep dive into [topic] theory, principles, and understanding.

## Section 1
[Detailed explanation]

## Section 2
[Detailed explanation]
```

**OPERATIONS.md** - Practical how-to
```markdown
# Operations Guide

Practical procedures, troubleshooting, and management.

## How to X
[Step-by-step]

## Troubleshooting Y
[Diagnosis and solutions]
```

**TECHNICAL.md** - Implementation details
```markdown
# Technical Architecture

Implementation details, code structure, integration points.

## Component Overview
[Architecture explanation]

## API/Integration
[Technical details]
```

**REFERENCE.md** - Quick lookup
```markdown
# Quick Reference

Formulas, constants, commands for rapid lookup.

## Formulas
[Formula list]

## Constants
[Constant list]

## Commands
[Command reference]
```

## Writing Guidelines

### For SKILL.md

**DO:**
- Start with most common question (Pareto principle - 80/20 rule)
- Use bullet points and short paragraphs
- Include "Progressive Detail Loading" section
- Map user questions → which file to load
- Keep examples minimal (1-2 lines max)

**DON'T:**
- Include full tutorials
- Duplicate information from detail files
- Use long code examples
- Explain edge cases
- Include historical context

### Example: Good vs Bad

**❌ BAD - Too detailed in SKILL.md:**
```markdown
### Understanding Response Time

Response time is a complex statistical concept in distributed systems.
Request processing follows an exponential distribution where each
request is independent with probability P = 1/(λ * processing_time).
The expected queue length follows a Poisson distribution...

[3 more paragraphs]

Example calculation:
```
avg_processing = 50ms
request_rate = 100/s
expected_latency = 50ms * (1 + λ) = 75ms

For actual response:
- 25ms: 33% (very fast!)
- 75ms: 100% (exactly expected)
- 150ms: 200% (slow)
```
[More examples...]
```

**✅ GOOD - Concise with pointer:**
```markdown
### Response Time (Most Common Question)

**Lower percentages = GOOD (faster processing)**

- 33% = Very fast! Processed in 33% of expected time
- 100% = Average (at expected latency)
- 200% = Slow (took 2x expected time)
- Formula: `efficiency = (expected_time / actual_time) × 100`
- Normal range: 50-200% short-term, averages to 100% long-term

**For theory and examples** → Read CONCEPTS.md
```

## Token Budget Guidelines

### Target Token Counts

```
SKILL.md:        ~500 tokens   (always loaded)
CONCEPTS.md:     ~2,000 tokens (load for theory)
OPERATIONS.md:   ~1,800 tokens (load for how-to)
TECHNICAL.md:    ~2,000 tokens (load for code)
REFERENCE.md:    ~1,500 tokens (load for lookup)

Total skill: ~7,800 tokens
But typical query uses: 500-2,500 tokens
```

### Conversion Estimates

```
~1 word = ~1.3 tokens (English average)
400 words ≈ 520 tokens
1,500 words ≈ 1,950 tokens
2,000 words ≈ 2,600 tokens
```

### Query Cost Analysis

**Simple question (80% of queries):**
```
SKILL.md only: ~500 tokens ✅
```

**Medium complexity (15% of queries):**
```
SKILL.md + one detail file: ~2,000-2,500 tokens ✅
```

**Complex question (5% of queries):**
```
SKILL.md + multiple files: ~3,000-4,000 tokens
Still better than loading everything! ✅
```

## Identifying What Goes Where

### Decision Tree

```
User question →
  ├─ Can be answered in 2-3 bullet points?
  │  └─ YES → Put in SKILL.md Quick Reference
  │
  ├─ Needs explanation of "why" or theory?
  │  └─ YES → Put in CONCEPTS.md
  │
  ├─ How to do something or troubleshoot?
  │  └─ YES → Put in OPERATIONS.md
  │
  ├─ Code, architecture, or implementation?
  │  └─ YES → Put in TECHNICAL.md
  │
  └─ Formula, constant, or lookup?
     └─ YES → Put in REFERENCE.md
```

### Examples

**Question: "What is X?"**
- Short definition → SKILL.md
- Detailed explanation → CONCEPTS.md

**Question: "How does X work?"**
- High-level overview → SKILL.md
- Technical details → TECHNICAL.md

**Question: "How do I fix X?"**
- Common cause → SKILL.md
- Troubleshooting steps → OPERATIONS.md

**Question: "What's the formula for X?"**
- Formula only → SKILL.md
- Derivation and examples → REFERENCE.md + CONCEPTS.md

## Anti-Patterns to Avoid

### ❌ The Encyclopedia Pattern

**Problem:** Trying to cover everything in SKILL.md

```markdown
# My Skill

## Complete Guide to X
[5000 words]

## Comprehensive Tutorial
[3000 words]

## All Possible Scenarios
[4000 words]

Total: 12,000 words = 15,600 tokens ALWAYS LOADED
```

**Solution:** Split into focused files, minimal SKILL.md

### ❌ The Duplicate Pattern

**Problem:** Same content in multiple files

```markdown
# SKILL.md
[Explanation of concept X]

# CONCEPTS.md
[Same explanation of concept X, slightly reworded]
```

**Solution:** SKILL.md has one-liner, CONCEPTS.md has full explanation

### ❌ The Example Overload Pattern

**Problem:** Too many examples in SKILL.md

```markdown
### How to Do X

Example 1:
[Code block]

Example 2:
[Code block]

Example 3:
[Code block]

Example 4:
[Code block]
```

**Solution:** One minimal example in SKILL.md, rest in detail files

### ❌ The No-Structure Pattern

**Problem:** Everything in one big file with no organization

```markdown
# Everything About My Topic
[Random order of content, no progressive disclosure]
```

**Solution:** Clear file structure with purpose-driven organization

## Testing Your Skill Efficiency

### Before Publishing

**1. Word Count Check:**
```bash
wc -w SKILL.md
# Target: <500 words

wc -w *.md
# Total target: <8,000 words
```

**2. Common Question Test:**

List your top 5 most common questions. For each:
- Can SKILL.md answer it directly?
- If not, is the pointer clear?
- Simulated token usage acceptable?

**3. Load Pattern Analysis:**

```
Question type     | Should load        | Estimated tokens
------------------|--------------------|------------------
Quick lookup      | SKILL.md only      | ~500
Explanation       | SKILL + CONCEPTS   | ~2,500
How-to            | SKILL + OPERATIONS | ~2,300
Implementation    | SKILL + TECHNICAL  | ~2,500
```

**4. Redundancy Check:**

- Is anything duplicated across files?
- Could any content be removed without losing value?
- Are examples necessary or just nice-to-have?

## Migration Guide: Optimizing Existing Skills

### Step 1: Analyze Current State

```bash
# Check current size
wc -w SKILL.md

# Identify most common questions (review logs/issues/FAQs)
# What do users ask most often?
```

### Step 2: Extract to Quick Reference

Move to SKILL.md:
- Top 3-5 common questions with brief answers
- Critical misconceptions
- Essential formulas/constants

### Step 3: Create Detail Files

Organize remaining content:
- **Theory/why** → CONCEPTS.md
- **How-to/troubleshooting** → OPERATIONS.md
- **Code/architecture** → TECHNICAL.md
- **Reference/lookup** → REFERENCE.md

### Step 4: Add Progressive Disclosure

In SKILL.md, add:
```markdown
## Progressive Detail Loading

For deeper information, use the Read tool to load:
- **CONCEPTS.md** - [when to load]
- **OPERATIONS.md** - [when to load]
...

## Quick Answers Guide

**User asks X** → Answer from SKILL.md
**User asks Y** → Read CONCEPTS.md
...
```

### Step 5: Measure Improvement

```bash
# Before and after
echo "Before: $(cat SKILL.md.backup | wc -w) words"
echo "After: $(cat SKILL.md | wc -w) words"

# Calculate savings
# Estimate: words * 1.3 = tokens
```

## Real-World Example: Domain Skill Optimization

### Before Optimization

```
Structure:
  SKILL.md: 1,500 words (everything in one file)
  CONCEPTS.md: 2,000 words (duplicate info)
  OPERATIONS.md: 3,000 words (too detailed)
  TECHNICAL.md: 3,500 words (too much)
  REFERENCE.md: 2,200 words (redundant)

Total: 12,200 words
SKILL.md load: 1,900 tokens EVERY TIME

Simple question token usage: 1,900 tokens
Waste: 1,700 tokens (89%)
```

### After Optimization

```
Structure:
  SKILL.md: 392 words (quick reference only)
  CONCEPTS.md: 1,769 words (focused theory)
  OPERATIONS.md: 1,647 words (focused troubleshooting)
  TECHNICAL.md: 1,729 words (focused architecture)
  REFERENCE.md: 1,332 words (focused lookup)

Total: 7,778 words (36% reduction)
SKILL.md load: 500 tokens

Simple question token usage: 500 tokens
Waste: ~0 tokens (answered directly)
Savings: 74%
```

### What Changed

**SKILL.md Before:**
- Explained concepts with full theoretical background
- Multiple detailed examples
- Deep technical implementation details
- Complete troubleshooting guides
- Full formulas with mathematical derivations

**SKILL.md After:**
- Quick reference scales and key metrics
- One-line formulas
- Pointer to CONCEPTS.md for theory
- Pointer to OPERATIONS.md for troubleshooting
- Pointer to REFERENCE.md for derivations

## Checklist: Publishing a New Skill

**Planning Phase:**
- [ ] Identified top 5 most common questions
- [ ] Determined what should be quick-reference vs deep-dive
- [ ] Sketched file structure (which files needed)

**Writing Phase:**
- [ ] SKILL.md < 500 words
- [ ] Quick Reference section answers top 3-5 questions
- [ ] Progressive Disclosure section clearly explains when to load each file
- [ ] Detail files focused on single purpose each
- [ ] No duplicate content across files
- [ ] Examples minimal in SKILL.md, detailed in appropriate file

**Quality Check:**
- [ ] Tested common questions - can SKILL.md answer directly?
- [ ] Tested complex questions - is pointer to detail file clear?
- [ ] Word count check: `wc -w *.md`
- [ ] Estimated token usage for common queries
- [ ] Removed unnecessary examples
- [ ] Removed redundant explanations

**Documentation:**
- [ ] README.md explains file structure
- [ ] README.md shows token efficiency gains
- [ ] Clear usage examples
- [ ] File purpose table with word counts

## Tools & Commands

### Useful Commands

```bash
# Count words in skill files
wc -w /path/to/skill/*.md

# Find duplicate phrases (potential redundancy)
grep -r "specific phrase" /path/to/skill/

# Estimate tokens (rough)
echo "scale=1; $(wc -w file.md | awk '{print $1}') * 1.3" | bc

# Compare before/after
diff -u SKILL.md.backup SKILL.md | grep -E '^[-+]' | wc -l
```

### Token Estimation

```python
# Quick token estimator
def estimate_tokens(word_count):
    return int(word_count * 1.3)

# Usage
words = 400
tokens = estimate_tokens(words)
print(f"{words} words ≈ {tokens} tokens")
```

## Summary: Golden Rules

1. **SKILL.md < 500 words** - Always
2. **Answer the common, reference the complex** - Pareto principle
3. **Progressive disclosure** - Load details on-demand
4. **No duplication** - Each fact lives in one place
5. **Purpose-driven files** - One clear purpose per file
6. **Test token usage** - Measure common query costs
7. **Update based on usage** - Move commonly-asked items to SKILL.md

## Further Reading

- Claude skill documentation: [Claude Code docs]
- Progressive disclosure pattern: [UX design principles]
- Token optimization: [LLM context management]

---

**Version**: 1.0
**Created**: Based on real-world skill optimization examples (12,200 → 7,778 words, 74% token savings)
**Use**: Reference when creating or optimizing Claude skills
