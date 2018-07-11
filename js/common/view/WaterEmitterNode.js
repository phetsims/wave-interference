// Copyright 2018, University of Colorado Boulder

/**
 * For the water scene, shows one hose for each emitter, each with its own on/off button.
 * TODO: factor out code between this and other emitter nodes?  Do this after getting them to be fully functional,
 * TODO: because they might diverge.
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

  // images
  var hoseImage = require( 'image!WAVE_INTERFERENCE/hose.png' );

  /**
   * @param {WavesScreenModel} model
   * @param {Node} waveAreaNode - for bounds
   * @constructor
   */
  function WaterEmitterNode( model, waveAreaNode ) {
    var options = {
      rightCenter: waveAreaNode.leftCenter.plusXY( 40, 0 ),
      scale: 0.75
    };
    var hoseNode1 = new Image( hoseImage, options );
    var button1 = new RoundStickyToggleButton( false, true, model.button1PressedProperty, {
      centerY: hoseNode1.centerY,
      left: 8,
      baseColor: WaveInterferenceConstants.EMITTER_BUTTON_COLOR,
      radius: WaveInterferenceConstants.EMITTER_BUTTON_RADIUS
    } );
    var hoseWithButton1 = new Node( {
      children: [ hoseNode1, button1 ]
    } );

    var hoseNode2 = new Image( hoseImage, options );
    var button2 = new RoundStickyToggleButton( false, true, model.button2PressedProperty, {
      centerY: hoseNode1.centerY, // TODO: why doesn't 0.5 work?
      left: 8, // TODO: duplicated
      baseColor: WaveInterferenceConstants.EMITTER_BUTTON_COLOR,
      radius: WaveInterferenceConstants.EMITTER_BUTTON_RADIUS
    } );
    var hoseWithButton2 = new Node( {
      children: [ hoseNode2, button2 ]
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
      children: [ hoseWithButton1, hoseWithButton2 ]
    } );

    var lightModelViewTransform = ModelViewTransform2.createRectangleMapping( model.waterScene.getWaveAreaBounds(), waveAreaNode.bounds );

    // TODO: this is duplicated in LightEmitterNode
    model.waterScene.sourceSeparationProperty.link( function( sourceSeparation ) {
      hoseNode2.visible = sourceSeparation > 0;

      var viewSeparation = lightModelViewTransform.modelToViewDeltaY( sourceSeparation );
      hoseWithButton1.centerY = waveAreaNode.centerY + viewSeparation / 2;
      hoseWithButton2.centerY = waveAreaNode.centerY - viewSeparation / 2;
    } );
  }

  waveInterference.register( 'WaterEmitterNode', WaterEmitterNode );

  return inherit( Node, WaterEmitterNode );
} );