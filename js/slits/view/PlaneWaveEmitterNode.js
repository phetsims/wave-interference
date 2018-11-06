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
  const Panel = require( 'SUN/Panel' );
  const RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );
  const SceneToggleNode = require( 'WAVE_INTERFERENCE/common/view/SceneToggleNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceSceneIcons = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceSceneIcons' );

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

      // Show an icon above the red button
      const sceneIcons = new WaveInterferenceSceneIcons();
      this.addChild( new Panel( new SceneToggleNode( model, scene => scene === model.waterScene ? sceneIcons.faucetIcon :
                                                                     scene === model.soundScene ? sceneIcons.speakerIcon :
                                                                     sceneIcons.laserPointerIcon ), {
        stroke: null,
        fill: '#d8d8d8',
        xMargin: 2,
        yMargin: 2,
        cornerRadius: 5,
        resize: false,
        centerX: this.centerX,
        bottom: button.top - 15
      } ) );
    }
  }

  return waveInterference.register( 'PlaneWaveEmitterNode', PlaneWaveEmitterNode );
} );