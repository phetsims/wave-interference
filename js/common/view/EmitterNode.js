// Copyright 2018, University of Colorado Boulder

/**
 * For each scene, shows one node for each emitter, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const IncomingWaveType = require( 'WAVE_INTERFERENCE/common/model/IncomingWaveType' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );


  class EmitterNode extends Node {

    /**
     * @param {WavesScreenModel} model
     * @param {Scene} scene
     * @param {Node} waveAreaNode - for bounds
     * @param {number} buttonPosition - x offset
     * @param {Node} sourceNode - for the emitters, shared with scenery DAG
     * @constructor
     */
    constructor( model, scene, waveAreaNode, buttonPosition, sourceNode ) {
      const buttonOptions = {
        centerY: sourceNode.centerY,
        left: buttonPosition,
        baseColor: WaveInterferenceConstants.EMITTER_BUTTON_COLOR,
        radius: WaveInterferenceConstants.EMITTER_BUTTON_RADIUS
      };
      const button1 = new RoundStickyToggleButton( false, true, model.button1PressedProperty, buttonOptions );
      const nodeWithButton1 = new Node( { children: [ sourceNode, button1 ] } );

      const button2 = new RoundStickyToggleButton( false, true, model.button2PressedProperty, buttonOptions );
      const nodeWithButton2 = new Node( { children: [ sourceNode, button2 ] } );

      const updateEnabled = function() {
        if ( model.inputTypeProperty.value === IncomingWaveType.PULSE ) {
          button1.enabled = !model.pulseFiringProperty.value;
          button2.enabled = !model.pulseFiringProperty.value;
        }
        else if ( model.inputTypeProperty.value === IncomingWaveType.CONTINUOUS ) {
          button1.enabled = true;
          button2.enabled = true;
        }
      };
      model.inputTypeProperty.link( updateEnabled );
      model.pulseFiringProperty.link( updateEnabled );
      super( {
        children: [ nodeWithButton1, nodeWithButton2 ]
      } );

      const modelViewTransform = ModelViewTransform2.createRectangleMapping( scene.getWaveAreaBounds(), waveAreaNode.bounds );

      scene.sourceSeparationProperty.link( function( sourceSeparation ) {
        nodeWithButton2.visible = sourceSeparation > 0;

        const viewSeparation = modelViewTransform.modelToViewDeltaY( sourceSeparation );
        nodeWithButton1.centerY = waveAreaNode.centerY + viewSeparation / 2;
        nodeWithButton2.centerY = waveAreaNode.centerY - viewSeparation / 2;
      } );
    }
  }

  waveInterference.register( 'EmitterNode', EmitterNode );

  return EmitterNode;
} );