// Copyright 2018, University of Colorado Boulder

//REVIEW ViewType is a pretty weak name. ViewpointEnum?
//REVIEW* I renamed it to ViewpointEnum, please review.
/**
 * The wave area can be viewed from the TOP or from the SIDE. The view animates between the selections.
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