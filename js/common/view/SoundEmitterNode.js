// Copyright 2018, University of Colorado Boulder

/**
 * For the sound scene, shows one speaker for each emitter, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var IncomingWaveType = require( 'WAVE_INTERFERENCE/common/model/IncomingWaveType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // image
  var speakerImage = require( 'image!WAVE_INTERFERENCE/speaker.png' );

  /**
   * @param {WavesScreenModel} model
   * @param {Node} waveAreaNode - for bounds
   * @constructor
   */
  function SoundEmitterNode( model, waveAreaNode ) {
    var options = {
      rightCenter: waveAreaNode.leftCenter.plusXY( 20, 0 ),
      scale: 0.75
    };
    var speakerNode1 = new Image( speakerImage, options );
    var left = 42;
    var button1 = new RoundStickyToggleButton( false, true, model.button1PressedProperty, {
      centerY: speakerNode1.centerY,
      left: left,
      baseColor: WaveInterferenceConstants.EMITTER_BUTTON_COLOR,
      radius: WaveInterferenceConstants.EMITTER_BUTTON_RADIUS
    } );
    var speakerWithButton1 = new Node( {
      children: [ speakerNode1, button1 ]
    } );

    var speakerNode2 = new Image( speakerImage, options );
    var button2 = new RoundStickyToggleButton( false, true, model.button2PressedProperty, {
      centerY: speakerNode2.centerY,
      left: left,
      baseColor: WaveInterferenceConstants.EMITTER_BUTTON_COLOR,
      radius: WaveInterferenceConstants.EMITTER_BUTTON_RADIUS
    } );
    var speakerWithButton2 = new Node( {
      children: [ speakerNode2, button2 ]
    } );

    // TODO: this is duplicated in LightEmitterNode
    var updateEnabled = function() {
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
    Node.call( this, {
      children: [ speakerWithButton1, speakerWithButton2 ]
    } );

    var lightModelViewTransform = ModelViewTransform2.createRectangleMapping( model.soundScene.getWaveAreaBounds(), waveAreaNode.bounds );

    // TODO: this is duplicated in LightEmitterNode
    model.soundScene.sourceSeparationProperty.link( function( sourceSeparation ) {
      speakerNode2.visible = sourceSeparation > 0;

      var viewSeparation = lightModelViewTransform.modelToViewDeltaY( sourceSeparation );
      speakerWithButton1.centerY = waveAreaNode.centerY + viewSeparation / 2;
      speakerWithButton2.centerY = waveAreaNode.centerY - viewSeparation / 2;
    } );
  }

  waveInterference.register( 'SoundEmitterNode', SoundEmitterNode );

  return inherit( Node, SoundEmitterNode );
} );