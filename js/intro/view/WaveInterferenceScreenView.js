// Copyright 2017, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var LatticeCanvasNode = require( 'WAVE_INTERFERENCE/intro/view/LatticeCanvasNode' );
  // var LatticeNode = require( 'WAVE_INTERFERENCE/intro/view/LatticeNode' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LatticeWebGLNode = require( 'WAVE_INTERFERENCE/intro/view/LatticeWebGLNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var Util = require( 'SCENERY/util/Util' );

  /**
   * @param {WaveInterferenceModel} waveInterferenceModel
   * @constructor
   */
  function WaveInterferenceScreenView( waveInterferenceModel ) {

    ScreenView.call( this );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        waveInterferenceModel.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    var webGLSupported = Util.isWebGLSupported && phet.chipper.queryParameters.webgl;
    // this.addChild( new LatticeNode( waveInterferenceModel.lattice ) );
    // this.addChild( new LatticeCanvasNode( waveInterferenceModel.lattice ) );
    if ( webGLSupported ) {
      this.addChild( new LatticeWebGLNode( waveInterferenceModel.lattice ) );
    }
    else {
      this.addChild( new LatticeCanvasNode( waveInterferenceModel.lattice ) );
    }

    this.addChild( new HSlider( waveInterferenceModel.frequencyProperty, {
      min: 1,
      max: 30
    }, {
      centerX: this.layoutBounds.centerX,
      top: this.layoutBounds.top + 10
    } ) );
  }

  waveInterference.register( 'WaveInterferenceScreenView', WaveInterferenceScreenView );

  return inherit( ScreenView, WaveInterferenceScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle view animation here.
    }
  } );
} );