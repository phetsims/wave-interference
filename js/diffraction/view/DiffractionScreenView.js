// Copyright 2017, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  // var LatticeNode = require( 'WAVE_INTERFERENCE/common/view/LatticeNode' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LatticeCanvasNode = require( 'WAVE_INTERFERENCE/common/view/LatticeCanvasNode' );
  var LatticeWebGLNode = require( 'WAVE_INTERFERENCE/common/view/LatticeWebGLNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Util = require( 'SCENERY/util/Util' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @param {WaveInterferenceModel} diffractionModel
   * @constructor
   */
  function DiffractionScreenView( diffractionModel ) {

    ScreenView.call( this );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        diffractionModel.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    var leftPanel = new Rectangle( 0, 0, 100, 100, { stroke: 'black' } );
    this.addChild( leftPanel );

    var rightPanel = new Rectangle( 120, 0, 100, 100, { stroke: 'black' } );
    this.addChild( rightPanel );
  }

  waveInterference.register( 'DiffractionScreenView', DiffractionScreenView );

  return inherit( ScreenView, DiffractionScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle view animation here.
    }
  } );
} );