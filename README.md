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
