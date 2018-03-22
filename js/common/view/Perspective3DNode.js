// Copyright 2018, University of Colorado Boulder

/**
 * Shows the partially rotated wave view in a pseudo-3D view.  Ported from RotationGlyph.java
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   */
  function Perspective3DNode() {

  }

  waveInterference.register( 'Perspective3DNode', Perspective3DNode );

  return inherit( Object, Perspective3DNode );
} );