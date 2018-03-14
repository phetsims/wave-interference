// Copyright 2018, University of Colorado Boulder

/**
 * Shows the icons for the radio buttons that choose between pulse and continuous waves.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var OscillationTypeEnum = require( 'WAVE_INTERFERENCE/common/model/OscillationTypeEnum' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  var NUM_SAMPLES = 100;                 // Number of samples to take along the curve
  var WAVE_HEIGHT = 10;                  // Amplitude of the wave for the icon
  var MAX_ANGLE = Math.PI * 2 + Math.PI; // Angle at which the wave ends, in radians
  var MARGIN = 10;                       // Width of the pulse side segments, in pixels
  var WIDTH = 50;                        // Size of wave, in pixels

  /**
   * @param {OscillationTypeEnum} incidentWaveType
   * @constructor
   */
  function InputTypeIconNode( incidentWaveType ) {
    Node.call( this );
    var minAngle = incidentWaveType === OscillationTypeEnum.PULSE ? Math.PI : 0;
    var minX = incidentWaveType === OscillationTypeEnum.PULSE ? MARGIN : 0;
    var maxX = incidentWaveType === OscillationTypeEnum.PULSE ? ( WIDTH - MARGIN ) : WIDTH;

    var shape = new Shape();
    for ( var i = 0; i < NUM_SAMPLES; i++ ) {
      var angle = Util.linear( 0, NUM_SAMPLES - 1, minAngle, MAX_ANGLE, i );
      var y = -Math.cos( angle ) * WAVE_HEIGHT;
      var x = Util.linear( minAngle, MAX_ANGLE, minX, maxX, angle );
      if ( i === 0 ) {
        if ( incidentWaveType === OscillationTypeEnum.PULSE ) {
          shape.moveTo( x - MARGIN, y );
          shape.lineTo( x, y );
        }
        else {
          shape.moveTo( x, y );
        }
      }
      else {
        shape.lineTo( x, y );
      }
    }
    if ( incidentWaveType === OscillationTypeEnum.PULSE ) {
      shape.lineToRelative( MARGIN, 0 );
    }
    this.addChild( new Path( shape, {
      stroke: 'black',
      lineWidth: 2
    } ) );
  }

  waveInterference.register( 'InputTypeIconNode', InputTypeIconNode );

  return inherit( Node, InputTypeIconNode );
} );