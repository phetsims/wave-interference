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
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );
  const SceneToggleNode = require( 'WAVE_INTERFERENCE/common/view/SceneToggleNode' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // images
  const planeWaveSourceImage = require( 'image!WAVE_INTERFERENCE/plane_wave_source.png' );

  class PlaneWaveGeneratorNode extends Node {

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

      const button = new SceneToggleNode(
        model,
        scene => new RoundStickyToggleButton( false, true, scene.button1PressedProperty, {
          scale: 1.2,
          baseColor: WaveInterferenceConstants.EMITTER_BUTTON_COLOR,
          radius: WaveInterferenceConstants.EMITTER_BUTTON_RADIUS
        } ), {
          center: verticalCylinderImageNode.center
        } );

      options = _.extend( { children: [ verticalCylinderImageNode, button ] }, options );

      this.mutate( options );

      // Show descriptive text label at the bottom of the cylinder
      this.addChild( new SceneToggleNode( model, scene => {
        const textNode = new WaveInterferenceText( scene.planeWaveGeneratorNodeText, {
          rotation: -Math.PI / 2,

          // About the same amount of space between the button and the text as between the text and the bottom
          maxWidth: 180
        } );
        const backgroundNode = Rectangle.bounds( textNode.bounds.dilated( 4 ), {
          fill: 'white',
          opacity: 0.2
        } );
        return new Node( {
          children: [ backgroundNode, textNode ]
        } );
      }, {
        centerX: this.centerX,
        top: verticalCylinderImageNode.top + 42,
        alignChildren: ToggleNode.BOTTOM
      } ) );
    }
  }

  return waveInterference.register( 'PlaneWaveGeneratorNode', PlaneWaveGeneratorNode );
} );