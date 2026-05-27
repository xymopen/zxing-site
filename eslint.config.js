// @ts-nocheck
import globals from "globals";
import js from "@eslint/js";
import { defineConfig, globalIgnores } from 'eslint/config'
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";
import html from "@html-eslint/eslint-plugin";
import hooks from "eslint-plugin-react-hooks";
import refresh from "eslint-plugin-react-refresh";

export default defineConfig([
	globalIgnores([
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
	]),
	{
		languageOptions: {
			sourceType: "module"
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
			"src/**/*.jsx",
			"src/**/*.ts",
			"src/**/*.mts",
			"src/**/*.tsx"
		],
		extends: [
			hooks.configs.flat.recommended,
			refresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			},
			globals: globals.browser
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
			"*.ts",
			"*.mts",
		],
		languageOptions: {
			ecmaVersion: 2022,
			globals: globals.nodeBuiltin
		}
	},
	{
		files: [
			"**/*.js",
			"**/*.mjs",
			"**/*.jsx"
		],
		extends: [
			js.configs.recommended
		]
	},
	{
		files: [
			"**/*.ts",
			"**/*.mts",
			"**/*.tsx"
		],
		extends: [
			tseslint.configs.recommended
		],
		languageOptions: {
			parserOptions: {
				projectService: true
			}
		},
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"error", {
					varsIgnorePattern: "^_"
				}
			]
		}
	},
	{
		files: [
			"**/*.htm",
			"**/*.html"
		],
		extends: [
			html.configs["flat/recommended"]
		],
		rules: {
			"@html-eslint/require-lang": "off",
			"@html-eslint/indent": [
				"error",
				"tab"
			],
			"@html-eslint/require-closing-tags": [
				"error",
				{
					selfClosing: "always"
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
]);
