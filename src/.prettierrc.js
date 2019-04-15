module.exports = {
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  bracketSpacing: true,
  overrides: [
    {
      files: ['*.html'],
      options: {
        printWidth: 999,
      },
    },
  ],
}
