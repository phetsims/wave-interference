// Copyright 2018, University of Colorado Boulder

//REVIEW ViewType is a pretty weak name. ViewpointEnum?
//REVIEW* I renamed it to ViewpointEnum, please review.
/**
 * Selects whether the wave is shown from the top (default) or side view.  This value represents the user selection--
 * the view animates between the selections.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  return waveInterference.register( 'ViewpointEnum', new Enumeration( [ 'TOP', 'SIDE' ] ) );
} );