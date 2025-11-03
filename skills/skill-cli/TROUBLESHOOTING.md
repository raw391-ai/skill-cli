# Troubleshooting skill-cli

Common issues and solutions.

## Installation Issues

### "Permission denied" when running skill-cli.js

**Symptom:** `bash: ./skill-cli.js: Permission denied`

**Solution:**
```bash
chmod +x skill-cli.js
```

### "command not found: node"

**Symptom:** `skill-cli.js: line 1: node: command not found`

**Solution:** Install Node.js
```bash
# Ubuntu/Debian
sudo apt install nodejs

# macOS
brew install node

# Verify
node --version
```

## Runtime Issues

### No skills found / Empty list

**Symptom:** `./skill-cli.js list` shows "Available Skills (0)"

**Cause:** Skills directory doesn't exist or is empty

**Solution:**
```bash
# Check current directory for skills/
ls -la skills/

# Or set SKILLS_DIR
export SKILLS_DIR=/path/to/your/skills
./skill-cli.js list
```

### Skill not found error

**Symptom:** `❌ Skill not found: my-skill`

**Causes & Solutions:**

1. **Typo in skill name:**
   ```bash
   # List skills to see exact names
   ./skill-cli.js list
   ```

2. **Skill directory missing SKILL.md:**
   ```bash
   # Check directory structure
   ls -la skills/my-skill/
   # Should contain SKILL.md file
   ```

3. **Wrong SKILLS_DIR:**
   ```bash
   # Verify directory
   echo $SKILLS_DIR
   ls -la $SKILLS_DIR/
   ```

### Detail file not found

**Symptom:** `❌ Detail file not found: CONCEPTS`

**Solution:**
```bash
# List available detail files
./skill-cli.js files my-skill

# Use exact filename (case-sensitive)
./skill-cli.js detail my-skill CONCEPTS
```

## Formatting Issues

### Broken characters or encoding issues

**Symptom:** Weird characters in output (�, mojibake)

**Solution:**
```bash
# Check terminal encoding
echo $LANG
# Should be UTF-8

# Set UTF-8 if needed
export LANG=en_US.UTF-8
```

### No formatting / plain text

**Symptom:** Output lacks visual formatting

**Cause:** Terminal doesn't support Unicode box-drawing characters

**Solution:** Use a modern terminal (iTerm2, Windows Terminal, modern GNOME Terminal)

## Search Issues

### Search returns no results

**Symptom:** `❌ No results found for: "query"`

**Causes & Solutions:**

1. **Query too specific:**
   ```bash
   # Try broader search
   ./skill-cli.js search "token"  # instead of "token-efficiency"
   ```

2. **Case sensitivity:**
   ```bash
   # Search is case-insensitive, but verify spelling
   ./skill-cli.js search "disclosure"
   ```

3. **No skills loaded:**
   ```bash
   # Verify skills exist
   ./skill-cli.js list
   ```

## Environment Variable Issues

### SKILLS_DIR not working

**Symptom:** Changes to SKILLS_DIR don't affect output

**Solution:**
```bash
# Export the variable
export SKILLS_DIR=/path/to/skills
./skill-cli.js list

# Or inline (works in single command)
SKILLS_DIR=/path/to/skills ./skill-cli.js list
```

### Path with spaces causes issues

**Symptom:** Errors when SKILLS_DIR contains spaces

**Solution:**
```bash
# Quote the path
export SKILLS_DIR="/path/with spaces/skills"
./skill-cli.js list
```

## GitHub Actions Issues

### skill-cli not found in workflow

**Symptom:** `skill-cli: command not found` in GitHub Actions

**Solution:**
```yaml
# Use full path
- run: ./skill-cli/skill-cli.js list

# Or symlink to PATH
- run: |
    sudo ln -s $PWD/skill-cli/skill-cli.js /usr/local/bin/skill-cli
    skill-cli list
```

### SKILLS_DIR not accessible

**Symptom:** Skills not found in GitHub Actions

**Solution:**
```yaml
# Check paths relative to workspace
- run: |
    pwd
    ls -la
    export SKILLS_DIR=./project-skills
    ./skill-cli.js list
```

## Cursor/Windsurf Issues

### AI can't access skill-cli

**Symptom:** AI reports "command not found"

**Solutions:**

1. **Provide full path:**
   ```
   Use /home/user/project/skill-cli.js to load skills
   ```

2. **Check working directory:**
   ```
   AI: what's your current directory?
   Then: cd to correct directory first
   ```

3. **Use absolute SKILLS_DIR:**
   ```bash
   SKILLS_DIR=/absolute/path/to/skills ./skill-cli.js list
   ```

## Hot-Swap Issues

### Changes not reflected

**Symptom:** Edited skill shows old content

**Cause:** Wrong SKILLS_DIR or reading cached file

**Solution:**
```bash
# Verify you're editing the right file
ls -la /tmp/test-skills/my-skill/SKILL.md

# Verify you're reading from the right place
SKILLS_DIR=/tmp/test-skills ./skill-cli.js show my-skill

# Check file modification time
stat /tmp/test-skills/my-skill/SKILL.md
```

## Performance Issues

### Slow execution

**Symptom:** Commands take >2 seconds

**Causes & Solutions:**

1. **Very large skill files:**
   - Split large files into multiple detail files
   - Keep SKILL.md under 500 words

2. **Network filesystem:**
   - Copy skills to local disk
   - Use local SKILLS_DIR

3. **Many skills (100+):**
   - This is expected, but should still be <3s
   - Consider organizing skills into subdirectories

## Frontmatter Parsing Issues

### Description not showing

**Symptom:** `list` shows "No description" for a skill

**Cause:** Invalid frontmatter format

**Solution:** Check SKILL.md format:
```markdown
---
name: my-skill
description: This is the description
---

# My Skill
...rest of content...
```

**Common mistakes:**
- Missing `---` delimiters
- No newline after closing `---`
- Extra spaces before colons
- Multi-line descriptions (must be single line)

## Exit Code Issues

### Wrong exit codes

**Symptom:** Exit code is 0 when it should be 1 (or vice versa)

**Check:**
```bash
./skill-cli.js invalid-command
echo $?  # Should be 1

./skill-cli.js list
echo $?  # Should be 0
```

**If incorrect:** Report as bug - exit codes are critical for CI/CD

## Still Having Issues?

1. **Check Node.js version:**
   ```bash
   node --version
   # Should be 12+
   ```

2. **Run with verbose output:**
   ```bash
   # No built-in verbose mode, but can debug:
   node skill-cli.js list  # Run directly with node
   ```

3. **Verify file permissions:**
   ```bash
   ls -la skill-cli.js
   ls -la skills/
   ```

4. **Check for error messages:**
   - Read error messages carefully
   - They usually indicate the exact problem

5. **Create minimal reproduction:**
   ```bash
   mkdir -p /tmp/test/skills/test-skill
   echo "---
   name: test-skill
   description: test
   ---
   # Test" > /tmp/test/skills/test-skill/SKILL.md

   cd /tmp/test
   /path/to/skill-cli.js list
   ```

6. **Report issue:** If none of the above work, create GitHub issue with:
   - Node.js version
   - OS and version
   - Exact commands run
   - Full error output
   - Minimal reproduction steps

## Getting Help

- **Documentation:** See README.md for usage examples
- **Testing:** See TESTING.md for verification steps
- **Issues:** https://github.com/raw391/skill-cli/issues
