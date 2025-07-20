### Guide for commit messages

# Format

<type>(optional-scope): <short summary (in imperative tone)>

(optional longer description explaining the change)
(optional footer with breaking changes and references)

| **Keyword** | **Meaning / Use Case**                                   |
| ----------- | -------------------------------------------------------- |
| `feat`      | ✅ **Feature**: introduces a new feature                 |
| `fix`       | 🐞 **Bug fix**: fixes a bug                              |
| `docs`      | 📄 **Documentation**: changes to docs only               |
| `style`     | 🎨 **Style**: formatting, no logic change (e.g., spaces) |
| `refactor`  | ♻️ **Refactor**: code change without feature or bug      |
| `perf`      | 🚀 **Performance**: improves performance                 |
| `test`      | ✅ **Tests**: adds or fixes tests                        |
| `chore`     | 🔧 **Chores**: maintenance tasks (build, CI config)      |
| `revert`    | ⏪ **Revert**: reverts a previous commit                 |

### JSDoc-style comments snippet

```json
{
  "JSDoc Function Template": {
    "prefix": "jsdocfn",
    "body": [
      "/**",
      " * ${1:Function description}",
      " *",
      " * @param {${2:string}} ${3:paramName} - ${4:Parameter description}",
      " * @returns {${5:void}} - ${6:Return description}",
      " */",
      "export const ${7:functionName} = (${3}) => {",
      "  $0",
      "};"
    ],
    "description": "Create a function with JSDoc-style comment"
  }
}
```

### Starting the ngrok server (for publicizing local host URL)

cmd

> F:
> cd Dev-tools\ngrok-v3-stable-windows-amd64

# or in one line

> cd /d F:\Dev-tools\ngrok-v3-stable-windows-amd64

# fo ngrok url

> ngrok http 5100
