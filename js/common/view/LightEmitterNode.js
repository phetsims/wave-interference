// Copyright 2018, University of Colorado Boulder

/**
 * For the lightScene, shows one laser pointer for each emitter, with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var IncomingWaveType = require( 'WAVE_INTERFERENCE/common/model/IncomingWaveType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  /**
   * @param {WavesScreenModel} model
   * @param {Node} waveAreaNode - for bounds
   * @constructor
   */
  function LightEmitterNode( model, waveAreaNode ) {
    var laserPointerOptions = {
      bodySize: new Dimension2( 80, 40 ),
      nozzleSize: new Dimension2( 10, 28 ),
      hasGlass: true,
      rightCenter: waveAreaNode.leftCenter.plusXY( 20, 0 ),
      buttonColor: WaveInterferenceConstants.EMITTER_BUTTON_COLOR,
      buttonRadius: WaveInterferenceConstants.EMITTER_BUTTON_RADIUS
    };
    // TODO: if we use LaserPointerNode with no button, we can use the same code for adding the buttons in all scenes
    var laserPointerNode1 = new LaserPointerNode( model.button1PressedProperty, laserPointerOptions );
    var laserPointerNode2 = new LaserPointerNode( model.button2PressedProperty, laserPointerOptions );

    var updateEnabled = function() {
      if ( model.inputTypeProperty.value === IncomingWaveType.PULSE ) {
        laserPointerNode1.enabled = !model.pulseFiringProperty.value;
        laserPointerNode2.enabled = !model.pulseFiringProperty.value;
      }
      else if ( model.inputTypeProperty.value === IncomingWaveType.CONTINUOUS ) {
        laserPointerNode1.enabled = true;
        laserPointerNode2.enabled = true;
      }
    };
    model.inputTypeProperty.link( updateEnabled );
    model.pulseFiringProperty.link( updateEnabled );
    Node.call( this, {
      children: [ laserPointerNode1, laserPointerNode2 ]
    } );

    var lightModelViewTransform = ModelViewTransform2.createRectangleMapping( model.lightScene.getWaveAreaBounds(), waveAreaNode.bounds );

    model.lightScene.sourceSeparationProperty.link( function( sourceSeparation ) {
      laserPointerNode2.visible = sourceSeparation > 0;

      var viewSeparation = lightModelViewTransform.modelToViewDeltaY( sourceSeparation );
      laserPointerNode1.centerY = waveAreaNode.centerY + viewSeparation / 2;
      laserPointerNode2.centerY = waveAreaNode.centerY - viewSeparation / 2;
    } );
  }

  waveInterference.register( 'LightEmitterNode', LightEmitterNode );

  return inherit( Node, LightEmitterNode );
} );