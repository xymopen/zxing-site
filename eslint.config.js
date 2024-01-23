// @ts-nocheck
import globals from "globals";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import html from "@html-eslint/eslint-plugin";
import htmlParser from "@html-eslint/parser";
import react from "eslint-plugin-react";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import hooks from "eslint-plugin-react-hooks";
import refresh from "eslint-plugin-react-refresh";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	{
		ignores: [
			"logs",
			"pids",
			"lib-cov",
			"coverage",
			".nyc_output",
			"build/Release",
			"node_modules/",
			".npm",
			".eslintcache",
			".vite/",
			"dist/",
			".yarn/cache",
			".yarn/unplugged",
			".pnp.*"
		],
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: "module",
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			}
		},
		plugins: {
			"@stylistic": stylistic
		},
		rules: {
			"@stylistic/eol-last": [
				"error",
				"always"
			],
			"@stylistic/indent": [
				"error",
				"tab"
			],
			"@stylistic/linebreak-style": [
				"error",
				"windows"
			],
			"@stylistic/no-trailing-spaces": [
				"error"
			],
			"@stylistic/quotes": [
				"error",
				"double"
			],
			"@stylistic/semi": [
				"error",
				"always"
			]
		}
	},
	{
		files: [
			"src/**/*.js",
			"src/**/*.mjs",
			"src/**/*.cjs",
			"src/**/*.jsx",
			"src/**/*.ts",
			"src/**/*.mts",
			"src/**/*.cts",
			"src/**/*.tsx"
		],
		...reactRecommended,
		...reactJsxRuntime,
		...hooks.configs.recommended,
		languageOptions: {
			globals: globals.browser
		},
		plugins: {
			react,
			"react-refresh": refresh
		},
		rules: {
			"react/jsx-no-target-blank": "off",
			"react-refresh/only-export-components": [
				"warn",
				{
					allowConstantExport: true
				}
			]
		},
		settings: {
			react: {
				version: "18.2"
			}
		}
	},
	{
		files: [
			"*.js",
			"*.mjs",
			"*.cjs",
			"*.ts",
			"*.mts",
			"*.cts"
		],
		languageOptions: {
			globals: globals.node
		}
	},
	{
		files: [
			"**/*.js",
			"**/*.mjs",
			"**/*.cjs",
			"**/*.jsx"
		],
		...js.configs.recommended
	},
	{
		files: [
			"**/*.ts",
			"**/*.mts",
			"**/*.cts",
			"**/*.tsx"
		],
		languageOptions: {
			parser: typescriptParser,
			/** @type {import('@typescript-eslint/parser/dist/index').ParserOptions} */
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: import.meta.dirname
			}
		},
		plugins: {
			"@typescript-eslint": typescript
		},
		rules: {
			...typescript.configs["eslint-recommended"].rules,
			...typescript.configs["recommended-type-checked"].rules,
		}
	},
	{
		files: [
			"**/*.htm",
			"**/*.html"
		],
		...html.configs.recommended,
		languageOptions: {
			parser: htmlParser
		},
		plugins: {
			"@html-eslint": html
		},
		rules: {
			"@html-eslint/require-lang": "off",
			"@html-eslint/indent": [
				"error",
				"tab"
			],
			"@html-eslint/require-closing-tags": [
				"error",
				{
					selfClosing: "always",
					allowSelfClosingCustom: false
				}
			],
			"@html-eslint/quotes": [
				"error",
				"double"
			],
			"@html-eslint/no-extra-spacing-attrs": [
				"error",
				{
					enforceBeforeSelfClose: true,
					disallowMissing: true
				}
			]
		}
	}
];
