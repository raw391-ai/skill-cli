# Testing Guide for skill-cli

Complete testing procedures to verify skill-cli works correctly.

## Quick Verification (2 minutes)

Run these commands in order and verify output:

```bash
cd /path/to/skill-cli

# Test 1: List command
./skill-cli.js list
# Expected: Shows 2+ skills (example-skill, skill-cli, etc.)
# Exit code: 0

# Test 2: Show command
./skill-cli.js show skill-cli
# Expected: Displays this skill's SKILL.md with formatting
# Exit code: 0

# Test 3: Files command
./skill-cli.js files skill-cli
# Expected: Lists TESTING.md and TROUBLESHOOTING.md
# Exit code: 0

# Test 4: Detail command
./skill-cli.js detail skill-cli TESTING
# Expected: Displays this file you're reading now
# Exit code: 0

# Test 5: Search command
./skill-cli.js search "progressive"
# Expected: Shows matches grouped by skill
# Exit code: 0

# Test 6: Help command
./skill-cli.js help
# Expected: Shows usage information
# Exit code: 0
```

**All tests passing? ✅ skill-cli is working!**

## Comprehensive Testing (10 minutes)

### 1. Environment Variable Override

Test SKILLS_DIR environment variable:

```bash
# Create test skills directory
mkdir -p /tmp/test-skills/test-skill
cat > /tmp/test-skills/test-skill/SKILL.md << 'EOF'
---
name: test-skill
description: Test skill for verification
---
# Test Skill
This is a test!
EOF

# Test with override
SKILLS_DIR=/tmp/test-skills ./skill-cli.js list
# Expected: Shows test-skill only

SKILLS_DIR=/tmp/test-skills ./skill-cli.js show test-skill
# Expected: Shows test skill content

# Cleanup
rm -rf /tmp/test-skills
```

✅ **Pass criteria:** Custom directory skills loaded correctly

### 2. Claude Code Skills Compatibility

Test with real Claude Code skills:

```bash
# Point to Claude Code skills directory
SKILLS_DIR=~/.claude/skills ./skill-cli.js list
# Expected: Shows all Claude Code skills

# Show a specific skill
SKILLS_DIR=~/.claude/skills ./skill-cli.js show verification-before-completion
# Expected: Displays skill content

# Search across skills
SKILLS_DIR=~/.claude/skills ./skill-cli.js search "test-driven"
# Expected: Shows matches from multiple skills
```

✅ **Pass criteria:** All Claude Code skills accessible and properly formatted

### 3. Progressive Disclosure

Verify token savings:

```bash
# Count words in quick reference
./skill-cli.js show example-skill | wc -w
# Expected: ~400-500 words

# Count total words in all files
cat skills/example-skill/*.md | wc -w
# Expected: 2000+ words

# Calculate savings
# Savings = (total - quick_ref) / total * 100
# Expected: >70% savings
```

✅ **Pass criteria:** Loading quick reference uses <30% of total tokens

### 4. Error Handling

Test error conditions:

```bash
# Non-existent skill
./skill-cli.js show nonexistent-skill
# Expected: Error message, exit code 1

# Non-existent detail file
./skill-cli.js detail example-skill NONEXISTENT
# Expected: Error message suggesting to use 'files' command

# Invalid command
./skill-cli.js invalid-command
# Expected: Error message, exit code 1
```

✅ **Pass criteria:** Proper error messages, non-zero exit codes

### 5. Output Formatting

Verify visual formatting:

```bash
./skill-cli.js show skill-cli
```

Check for:
- ✅ Header with skill name surrounded by `═`
- ✅ Body content displays correctly
- ✅ Footer with suggestion to use `files` command
- ✅ No broken formatting or encoding issues

### 6. Frontmatter Parsing

Test frontmatter extraction:

```bash
./skill-cli.js list
```

Verify:
- ✅ Skill names extracted from frontmatter `name:` field
- ✅ Descriptions extracted from `description:` field
- ✅ Skills without frontmatter show "No description"

### 7. Search Functionality

Test search across all skills:

```bash
./skill-cli.js search "token"
```

Verify:
- ✅ Results grouped by skill name
- ✅ Shows file:line matches
- ✅ Shows match count per skill
- ✅ First 3 matches displayed, rest summarized

### 8. Multi-line Content

Verify multi-line content displays correctly:

```bash
./skill-cli.js show example-skill
```

Check:
- ✅ Code blocks render properly
- ✅ Lists and tables display correctly
- ✅ Markdown formatting preserved
- ✅ Line breaks maintained

## Platform-Specific Testing

### GitHub Actions

Create a test workflow:

```yaml
# .github/workflows/test-skill-cli.yml
name: Test skill-cli
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./skill-cli.js list
      - run: ./skill-cli.js show skill-cli
```

✅ **Pass criteria:** Workflow runs successfully, commands execute

### Cursor/Windsurf

In your AI coding assistant:

1. Clone repo with skills
2. Ask AI: "Use ./skill-cli.js to load the skill-cli skill"
3. Verify AI can read and understand the output

✅ **Pass criteria:** AI successfully loads and references skill content

### Hot-Swap Development

Test rapid iteration:

```bash
# Create test skill
mkdir -p /tmp/hotswap-test/my-skill
echo "---
name: my-skill
description: v1
---
# Version 1" > /tmp/hotswap-test/my-skill/SKILL.md

# Test v1
SKILLS_DIR=/tmp/hotswap-test ./skill-cli.js show my-skill
# Expected: Shows "Version 1"

# Edit (no restart needed)
echo "---
name: my-skill
description: v2
---
# Version 2 - Updated!" > /tmp/hotswap-test/my-skill/SKILL.md

# Test v2 immediately
SKILLS_DIR=/tmp/hotswap-test ./skill-cli.js show my-skill
# Expected: Shows "Version 2 - Updated!"

# Cleanup
rm -rf /tmp/hotswap-test
```

✅ **Pass criteria:** Changes reflected immediately without restart

## Regression Testing

When making changes to skill-cli, re-run all tests above and verify:

1. ✅ All commands still work
2. ✅ Exit codes correct
3. ✅ Output formatting unchanged
4. ✅ No new errors introduced
5. ✅ Performance acceptable

## Performance Testing

Test with large skill sets:

```bash
# Time list command
time ./skill-cli.js list

# Time search across many skills
time SKILLS_DIR=~/.claude/skills ./skill-cli.js search "test"
```

✅ **Pass criteria:**
- `list` completes in <1 second
- `search` completes in <2 seconds with 20+ skills

## Integration Testing

Test full workflow:

```bash
# 1. Discover skills
./skill-cli.js list

# 2. Find relevant skill
./skill-cli.js search "my topic"

# 3. Load quick reference
./skill-cli.js show discovered-skill

# 4. Check for details
./skill-cli.js files discovered-skill

# 5. Load detailed docs
./skill-cli.js detail discovered-skill CONCEPTS
```

✅ **Pass criteria:** Complete workflow executes smoothly

## Test Report Format

After running tests, report results:

```
skill-cli Test Report
=====================

Quick Verification:     ✅ PASS (all 6 commands)
Environment Override:   ✅ PASS
Claude Code Compat:     ✅ PASS
Progressive Disclosure: ✅ PASS (78% token savings)
Error Handling:         ✅ PASS
Output Formatting:      ✅ PASS
Frontmatter Parsing:    ✅ PASS
Search Functionality:   ✅ PASS

Platform Tests:
- GitHub Actions:       ✅ PASS
- Hot-swap:            ✅ PASS

Performance:
- list: 0.2s           ✅ PASS
- search: 0.5s         ✅ PASS

Overall: ✅ ALL TESTS PASSED
```

## Troubleshooting Failed Tests

If tests fail, see TROUBLESHOOTING.md for common issues and solutions.

## Continuous Testing

For ongoing development:

1. Run quick verification before each commit
2. Run comprehensive testing before each release
3. Run platform-specific tests when changing docs
4. Run regression tests after any code changes

## Automated Testing (Future)

Consider adding:
- Unit tests for each function
- Integration tests for full workflows
- CI/CD pipeline for automated testing
- Test coverage reporting
