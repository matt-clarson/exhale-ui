module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
  ],
  babel: async options => ({
    ...options,
    plugins: [
      ...options.plugins.filter(p => p[0].match(/decorators/) === null),
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
    ]
  }),
}