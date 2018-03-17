// Copyright 2018, University of Colorado Boulder

/**
 * Controls for the barrier/slits.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BarrierTypeEnum = require( 'WAVE_INTERFERENCE/slits/model/BarrierTypeEnum' );
  var ComboBox = require( 'SUN/ComboBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  /**
   * @constructor
   */
  function SlitsControlPanel( alignGroup, model, comboBoxParent, options ) {

    // TODO: center or make as wide as the rest of the controls
    var comboBox = new ComboBox( [
      ComboBox.createItem( new WaveInterferenceText( 'No Barrier' ), BarrierTypeEnum.NO_BARRIER ),
      ComboBox.createItem( new WaveInterferenceText( 'Mirror' ), BarrierTypeEnum.MIRROR ),
      ComboBox.createItem( new WaveInterferenceText( 'One Slit' ), BarrierTypeEnum.ONE_SLIT ),
      ComboBox.createItem( new WaveInterferenceText( 'Two Slits' ), BarrierTypeEnum.TWO_SLITS )
    ], model.barrierTypeProperty, comboBoxParent, {
      buttonYMargin: 0
    } );

    // TODO: factor out NumberControls
    var TRACK_SIZE = new Dimension2( 100, 3 );
    var locationControl = new NumberControl( 'Location', new Property( 4000 ), new Range( 1000, 5000 ), {
      trackSize: TRACK_SIZE,
      majorTickLength: 12,
      valuePattern: '{0} nm',
      thumbSize: new Dimension2( 22, 30 ), // TODO: match with other sliders in SlitsControlPanel
      majorTicks: [ {
        value: 1000,
        label: new WaveInterferenceText( 1000, { fontSize: 10 } )
      }, {
        value: 5000,
        label: new WaveInterferenceText( 5000, { fontSize: 10 } )
      } ],
      layoutFunction: NumberControl.createLayoutFunction4( { verticalSpacing: 1 } )
    } );
    model.barrierTypeProperty.link( function( barrierType ) {
      locationControl.enabled = barrierType === BarrierTypeEnum.MIRROR ||
                                barrierType === BarrierTypeEnum.ONE_SLIT ||
                                barrierType === BarrierTypeEnum.TWO_SLITS;
    } );

    var slitWidthControl = new NumberControl( 'Slit Width', new Property( 100 ), new Range( 0, 200 ), {
      trackSize: TRACK_SIZE,
      valuePattern: '{0} nm',
      thumbSize: new Dimension2( 22, 30 ), // TODO: match with other sliders in SlitsControlPanel
      majorTickLength: 12,
      majorTicks: [ {
        value: 0,
        label: new WaveInterferenceText( 0, { fontSize: 10 } )
      }, {
        value: 200,
        label: new WaveInterferenceText( 200, { fontSize: 10 } )
      } ],
      layoutFunction: NumberControl.createLayoutFunction4( { verticalSpacing: 1 } )
    } );
    model.barrierTypeProperty.link( function( barrierType ) {
      slitWidthControl.enabled = barrierType === BarrierTypeEnum.ONE_SLIT ||
                                 barrierType === BarrierTypeEnum.TWO_SLITS;
    } );

    var slitSeparationControl = new NumberControl( 'Slit Separation', new Property( 1000 ), new Range( 0, 2000 ), {
      trackSize: TRACK_SIZE,
      thumbSize: new Dimension2( 22, 30 ), // TODO: match with other sliders in SlitsControlPanel
      valuePattern: '{0} nm',
      majorTickLength: 12,
      majorTicks: [ {
        value: 0,
        label: new WaveInterferenceText( 0, { fontSize: 10 } )
      }, {
        value: 2000,
        label: new WaveInterferenceText( 2000, { fontSize: 10 } )
      } ],
      layoutFunction: NumberControl.createLayoutFunction4( { verticalSpacing: 1 } )
    } );
    model.barrierTypeProperty.link( function( barrierType ) {
      slitSeparationControl.enabled = barrierType === BarrierTypeEnum.TWO_SLITS;
    } );

    // Vertical layout
    locationControl.top = comboBox.bottom + 2;
    slitWidthControl.top = locationControl.bottom + 2;
    slitSeparationControl.top = slitWidthControl.bottom + 2;

    // Horizontal layout
    locationControl.centerX = comboBox.centerX;
    slitWidthControl.left = locationControl.left;
    slitSeparationControl.left = locationControl.left;

    var content = alignGroup.createBox( new Node( {
      children: [
        comboBox,
        locationControl,
        slitWidthControl,
        slitSeparationControl
      ]
    } ) );

    WaveInterferencePanel.call( this, content, options );
  }

  waveInterference.register( 'SlitsControlPanel', SlitsControlPanel );

  return inherit( WaveInterferencePanel, SlitsControlPanel );
} );