// Copyright 2018, University of Colorado Boulder

/**
 * Vertical cylinder with a button that produces the plane wave along the left edge of the wave area.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const Node = require( 'SCENERY/nodes/Node' );
  const RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // images
  const planeWaveSourceImage = require( 'image!WAVE_INTERFERENCE/plane_wave_source.png' );

  class PlaneWaveEmitterNode extends Node {

    /**
     * @param {WavesScreenModel} model
     * @param {Bounds2} waveAreaBounds
     * @param {Object} [options]
     */
    constructor( model, waveAreaBounds, options ) {
      super();
      const verticalCylinderImageNode = new Image( planeWaveSourceImage, {
        scale: waveAreaBounds.height / ( planeWaveSourceImage.height - 52 ),
        rightCenter: waveAreaBounds.leftCenter.plusXY( 2, 0 )
      } );

      const button = new RoundStickyToggleButton( false, true, model.button1PressedProperty, {
        scale: 1.2,
        center: verticalCylinderImageNode.center,
        baseColor: WaveInterferenceConstants.EMITTER_BUTTON_COLOR,
        radius: WaveInterferenceConstants.EMITTER_BUTTON_RADIUS
      } );

      options = _.extend( { children: [ verticalCylinderImageNode, button ] }, options );

      this.mutate( options );
    }
  }

  return waveInterference.register( 'PlaneWaveEmitterNode', PlaneWaveEmitterNode );
} );