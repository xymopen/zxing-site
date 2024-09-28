// @ts-nocheck
import globals from "globals";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";
import html from "@html-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import hooks from "eslint-plugin-react-hooks";
import refresh from "eslint-plugin-react-refresh";

/** @type {import('eslint').Linter.Config[]} */
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
		...reactRecommended,
		...reactJsxRuntime,
		...hooks.configs.recommended,
		languageOptions: {
			ecmaVersion: 2020,
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			},
			globals: globals.browser
		},
		plugins: {
			react,
			'react-hooks': hooks,
			"react-refresh": refresh
		},
		rules: {
			...reactRecommended.rules,
			...reactJsxRuntime.rules,
			...hooks.configs.recommended.rules,
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
		...js.configs.recommended
	},
	...tseslint.config({
		files: [
			"**/*.ts",
			"**/*.mts",
			"**/*.tsx"
		],
		extends: [
			...tseslint.configs.recommended,
			tseslint.configs.eslintRecommended,
			...tseslint.configs.recommendedTypeChecked
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
	}),
	{
		files: [
			"**/*.htm",
			"**/*.html"
		],
		...html.configs["flat/recommended"],
		rules: {
			...html.configs["flat/recommended"].rules,
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
];
