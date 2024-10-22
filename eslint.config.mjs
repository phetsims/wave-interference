// Copyright 2024, University of Colorado Boulder

/**
 * ESLint configuration for wave-interference.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import simEslintConfig from '../perennial-alias/js/eslint/sim.eslint.config.mjs';

export default [
  ...simEslintConfig,
  {
    languageOptions: {
      globals: {
        FFT: 'readonly'
      }
    }
  },
  {
    files: [ '**/*.ts' ],
    rules: {
      'phet/bad-typescript-text': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  }
];