# Progressive Disclosure Concepts

Deep dive into the theory and philosophy of progressive disclosure for AI context management.

## What is Progressive Disclosure?

Progressive disclosure is a UX pattern that shows users only the information they need, when they need it. Applied to AI context management, it means:

1. **Start minimal** - Load only essential quick reference
2. **Expand on demand** - Load detailed docs when needed
3. **Pay per use** - Only spend tokens on what you actually use

## The Token Problem

Every token sent to an AI costs money and uses context window space. Traditional approaches load everything upfront:

```bash
# Traditional: Load all files
cat skills/my-skill/*.md
# Result: 20,000+ tokens, but user only needed 1,500 tokens worth
```

This creates massive waste when users ask simple questions.

## The Solution: Progressive Levels

### Level 1: Discovery (list)
**Tokens**: ~500
**Purpose**: "What skills are available?"
**Output**: Skill names and one-line descriptions

### Level 2: Quick Reference (show)
**Tokens**: 1,500-3,000
**Purpose**: "Give me the essentials"
**Output**: SKILL.md with answers to 80% of common questions

### Level 3: Available Details (files)
**Tokens**: ~100
**Purpose**: "What deep dives are available?"
**Output**: List of detail file names

### Level 4: Full Documentation (detail)
**Tokens**: 2,000-8,000
**Purpose**: "I need comprehensive understanding"
**Output**: Complete detail file content

### Level 5: Search (search)
**Tokens**: 200-1,000
**Purpose**: "Where is concept X mentioned?"
**Output**: File/line matches across all skills

## The 80/20 Rule (Pareto Principle)

80% of questions can be answered with 20% of the content:

- **80% of queries**: "What is X?" "How do I Y?" → Quick Reference (1,500 tokens)
- **20% of queries**: "Why does X work that way?" "Show me all edge cases" → Detail files (5,000 tokens)

By separating these, you serve both efficiently.

## Information Architecture

### SKILL.md Design Principles

1. **Brevity** - Under 400 words (~500 tokens)
2. **Relevance** - Answer most common questions only
3. **Pointers** - Clear guidance to detail files
4. **Examples** - Minimal (1-2 lines max)
5. **Tables** - Quick lookup data

### Detail File Design Principles

1. **Focus** - One purpose per file
2. **Depth** - Comprehensive on topic
3. **Examples** - Extensive, real-world
4. **Context** - Assume reader has read SKILL.md

## Token Budget Psychology

Users have a mental model:

- **Quick answer**: Should cost ~1,500 tokens
- **Medium complexity**: Should cost ~3,000 tokens
- **Deep dive**: Should cost ~5,000 tokens

If a "quick answer" costs 20,000 tokens because everything loads, users feel cheated.

## Progressive Disclosure in Practice

### Example: Database Schema Question

**Bad Approach (Load All)**:
```bash
cat database-schema.md  # 15,000 tokens
cat examples.md         # 5,000 tokens
cat migrations.md       # 3,000 tokens
# Total: 23,000 tokens for simple question
```

**Good Approach (Progressive)**:
```bash
show database-schema    # 1,500 tokens - answers question!
# Done! Saved 21,500 tokens (93%)
```

**Complex Question**:
```bash
show database-schema    # 1,500 tokens - provides overview
detail database-schema MIGRATIONS  # 3,000 tokens - specific detail
# Total: 4,500 tokens (vs. 23,000 = 80% savings)
```

## Cognitive Load Management

Progressive disclosure also manages cognitive load:

1. **Overwhelm prevention**: Don't dump 20,000 tokens at once
2. **Relevance first**: User sees most relevant info immediately
3. **Exploration support**: User can choose what to dive deeper into
4. **Mental models**: Mirrors how humans naturally learn (overview → details)

## Comparison to Traditional Documentation

| Approach | Initial Load | Total Load (Simple Q) | Total Load (Complex Q) |
|----------|--------------|---------------------|----------------------|
| **Traditional** | 20,000 tokens | 20,000 tokens | 20,000 tokens |
| **Progressive** | 1,500 tokens | 1,500 tokens | 5,000 tokens |
| **Savings** | 93% | 93% | 75% |

## When NOT to Use Progressive Disclosure

Progressive disclosure is not ideal when:

1. **All content is essential** - If every piece of info is needed for every query
2. **Content is tiny** - If total content < 2,000 tokens, don't bother
3. **No common patterns** - If queries are equally distributed across all topics

In these cases, a single comprehensive file may be better.

## Best Practices

1. **Test with real queries** - Use actual questions to validate structure
2. **Measure token usage** - Track how much each level costs
3. **Iterate based on usage** - Move frequently-needed details to quick reference
4. **Clear pointers** - Make it obvious where to find more info
5. **No duplication** - Each fact lives in exactly one place

## The Future: AI-Driven Progressive Disclosure

Future enhancements could include:

- **Automatic skill recommendation** - AI suggests relevant skills based on context
- **Query-based loading** - AI determines which detail files to load
- **Token budgeting** - Set max token budget, AI optimizes loading strategy
- **Usage analytics** - Track what's loaded, optimize skill structure

## Key Insight

**Information should be like a pyramid**: Wide base of quick answers, narrow peak of deep expertise. Most users never need the peak, but it's there when they do.

Progressive disclosure is about **respecting the user's token budget and cognitive capacity**.
