// Copyright 2018, University of Colorado Boulder

/**
 * Controls for the barrier/slits.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const BarrierTypeEnum = require( 'WAVE_INTERFERENCE/slits/model/BarrierTypeEnum' );
  const ComboBox = require( 'SUN/ComboBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const Range = require( 'DOT/Range' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // strings
  const noBarrierString = require( 'string!WAVE_INTERFERENCE/noBarrier' );
  const oneSlitString = require( 'string!WAVE_INTERFERENCE/oneSlit' );
  const slitSeparationString = require( 'string!WAVE_INTERFERENCE/slitSeparation' );
  const slitWidthString = require( 'string!WAVE_INTERFERENCE/slitWidth' );
  const twoSlitsString = require( 'string!WAVE_INTERFERENCE/twoSlits' );
  const cmValueString = require( 'string!WAVE_INTERFERENCE/cmValue' );
  const nmValueString = require( 'string!WAVE_INTERFERENCE/nmValue' );

  /**
   * @param {AlignGroup} alignGroup
   * @param {SlitsScreenModel} model
   * @param {Node} comboBoxParent
   * @param {Object} [options]
   * @constructor
   */
  function SlitsControlPanel( alignGroup, model, comboBoxParent, options ) {

    const comboBox = new ComboBox( [
      ComboBox.createItem( new WaveInterferenceText( noBarrierString ), BarrierTypeEnum.NO_BARRIER ),
      ComboBox.createItem( new WaveInterferenceText( oneSlitString ), BarrierTypeEnum.ONE_SLIT ),
      ComboBox.createItem( new WaveInterferenceText( twoSlitsString ), BarrierTypeEnum.TWO_SLITS )
    ], model.barrierTypeProperty, comboBoxParent, {
      buttonYMargin: 0
    } );

    const createLabel = function( text ) {
      return new WaveInterferenceText( text, { fontSize: 10 } );
    };
    const waterSlitWidthControl = new NumberControl( slitWidthString, model.waterScene.slitWidthProperty, new Range( 0, 5 ), _.extend( {
      valuePattern: cmValueString,
      majorTicks: [
        { value: 0, label: createLabel( '0 cm' ) },
        { value: 5, label: createLabel( '5 cm' ) } ]
    }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
    const soundSlitWidthControl = new NumberControl( slitWidthString, model.soundScene.slitWidthProperty, new Range( 0, 50 ), _.extend( {
      valuePattern: cmValueString,
      majorTicks: [
        { value: 0, label: createLabel( '0 cm' ) },
        { value: 50, label: createLabel( '50 cm' ) } ]
    }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
    const lightSlitWidthControl = new NumberControl( slitWidthString, model.lightScene.slitWidthProperty, new Range( 0, 2000 ), _.extend( {
      valuePattern: nmValueString,
      majorTicks: [
        { value: 0, label: createLabel( '0 nm' ) },
        { value: 2000, label: createLabel( '2000 nm' ) } ]
    }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
    const slitWidthControl = new ToggleNode( [
      { value: model.waterScene, node: waterSlitWidthControl },
      { value: model.soundScene, node: soundSlitWidthControl },
      { value: model.lightScene, node: lightSlitWidthControl }
    ], model.sceneProperty );
    model.barrierTypeProperty.link( function( barrierType ) {
      const enabled = barrierType === BarrierTypeEnum.ONE_SLIT || barrierType === BarrierTypeEnum.TWO_SLITS;
      waterSlitWidthControl.enabled = enabled;
      soundSlitWidthControl.enabled = enabled;
      lightSlitWidthControl.enabled = enabled;
    } );

    const waterSeparationControl = new NumberControl( slitSeparationString, model.waterScene.slitSeparationProperty, new Range( 0, 5 ), _.extend( {
      valuePattern: cmValueString,
      majorTicks: [
        { value: 0, label: createLabel( '0 cm' ) },
        { value: 5, label: createLabel( '5 cm' ) } ]
    }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
    const soundSeparationControl = new NumberControl( slitSeparationString, model.soundScene.slitSeparationProperty, new Range( 0, 50 ), _.extend( {
      valuePattern: cmValueString,
      majorTicks: [
        { value: 0, label: createLabel( '0 cm' ) },
        { value: 50, label: createLabel( '50 cm' ) } ]
    }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
    const lightSeparationControl = new NumberControl( slitSeparationString, model.lightScene.slitSeparationProperty, new Range( 0, 2000 ), _.extend( {
      valuePattern: nmValueString,
      majorTicks: [
        { value: 0, label: createLabel( '0 nm' ) },
        { value: 2000, label: createLabel( '2000 nm' ) } ]
    }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
    const slitSeparationControl = new ToggleNode( [
      { value: model.waterScene, node: waterSeparationControl },
      { value: model.soundScene, node: soundSeparationControl },
      { value: model.lightScene, node: lightSeparationControl }
    ], model.sceneProperty );

    model.barrierTypeProperty.link( function( barrierType ) {
      const enabled = barrierType === BarrierTypeEnum.TWO_SLITS;
      waterSeparationControl.enabled = enabled;
      soundSeparationControl.enabled = enabled;
      lightSeparationControl.enabled = enabled;
    } );

    // Vertical layout
    slitWidthControl.top = comboBox.bottom + 2;
    slitSeparationControl.top = slitWidthControl.bottom + 2;

    // Horizontal layout
    slitWidthControl.centerX = comboBox.centerX;
    slitSeparationControl.left = slitWidthControl.left;

    const content = alignGroup.createBox( new Node( {
      children: [
        comboBox,
        slitWidthControl,
        slitSeparationControl
      ]
    } ) );

    WaveInterferencePanel.call( this, content, options );
  }

  waveInterference.register( 'SlitsControlPanel', SlitsControlPanel );

  return inherit( WaveInterferencePanel, SlitsControlPanel );
} );