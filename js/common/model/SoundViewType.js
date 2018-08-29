// Copyright 2018, University of Colorado Boulder

/**
 * For the SourceScene, selects whether to display waves, particles or both.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  const SoundViewType = {
    WAVES: 'WAVES',
    PARTICLES: 'PARTICLES',
    BOTH: 'BOTH'
  };

  SoundViewType.VALUES = _.values( SoundViewType );

  // in development mode, catch any attempted changes to the enum
  if ( assert ) { Object.freeze( SoundViewType ); }

  return waveInterference.register( 'SoundViewType', SoundViewType );
} );