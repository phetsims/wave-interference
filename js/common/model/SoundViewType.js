// Copyright 2018, University of Colorado Boulder

//REVIEW I see no "SourceScene".  Do you mean "SoundScene"?
/**
 * For the SourceScene, selects whether to display waves, particles or both.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'SoundViewType', new Enumeration( [ 'WAVES', 'PARTICLES', 'BOTH' ] ) );
} );