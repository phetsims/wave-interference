// Copyright 2018, University of Colorado Boulder

/**
 * Controls for the barrier/slits.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BarrierTypeEnum = require( 'WAVE_INTERFERENCE/slits/model/BarrierTypeEnum' );
  const ComboBox = require( 'SUN/ComboBox' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const Range = require( 'DOT/Range' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const Util = require( 'DOT/Util' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // strings
  const cmValueString = require( 'string!WAVE_INTERFERENCE/cmValue' );
  const nmValueString = require( 'string!WAVE_INTERFERENCE/nmValue' );
  const noBarrierString = require( 'string!WAVE_INTERFERENCE/noBarrier' );
  const oneSlitString = require( 'string!WAVE_INTERFERENCE/oneSlit' );
  const slitSeparationString = require( 'string!WAVE_INTERFERENCE/slitSeparation' );
  const slitWidthString = require( 'string!WAVE_INTERFERENCE/slitWidth' );
  const twoSlitsString = require( 'string!WAVE_INTERFERENCE/twoSlits' );

  class SlitsControlPanel extends WaveInterferencePanel {

    /**
     * @param {AlignGroup} alignGroup
     * @param {SlitsModel} model
     * @param {Node} comboBoxParent
     */
    constructor( alignGroup, model, comboBoxParent ) {

      const barrierTypeDynamicProperty = new DynamicProperty( model.sceneProperty, {
        derive: 'barrierTypeProperty',
        bidirectional: true
      } );
      
      const comboBox = new ComboBox( [
        ComboBox.createItem( new WaveInterferenceText( noBarrierString ), BarrierTypeEnum.NO_BARRIER ),
        ComboBox.createItem( new WaveInterferenceText( oneSlitString ), BarrierTypeEnum.ONE_SLIT ),
        ComboBox.createItem( new WaveInterferenceText( twoSlitsString ), BarrierTypeEnum.TWO_SLITS )
      ], barrierTypeDynamicProperty, comboBoxParent, {
        buttonYMargin: 0
      } );

      const createLabel = text => new WaveInterferenceText( text, {
        fontSize: WaveInterferenceConstants.TICK_FONT_SIZE,
        maxWidth: WaveInterferenceConstants.TICK_MAX_WIDTH
      } );

      const createTicks = property => [
        { value: property.range.min, label: createLabel( '' + property.range.min ) },
        { value: property.range.max, label: createLabel( '' + property.range.max ) }
      ];

      // Slit width controls.  Ranges, values and deltas specified in
      // https://github.com/phetsims/wave-interference/issues/177
      const waterSlitWidthControl = new NumberControl(
        slitWidthString, model.waterScene.slitWidthProperty, model.waterScene.slitWidthProperty.range, _.extend( {
          delta: 0.1, // cm
          decimalPlaces: 1,
          valuePattern: cmValueString,
          majorTicks: createTicks( model.waterScene.slitWidthProperty )
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );

      const soundSlitWidthControl = new NumberControl(
        slitWidthString, model.soundScene.slitWidthProperty, model.soundScene.slitWidthProperty.range, _.extend( {
          delta: 1, // cm
          constrainValue: value => Util.roundToInterval( value, 10 ),
          valuePattern: cmValueString,
          majorTicks: createTicks( model.soundScene.slitWidthProperty )
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );

      const lightSlitWidthControl = new NumberControl(
        slitWidthString, model.lightScene.slitWidthProperty, model.lightScene.slitWidthProperty.range, _.extend( {
          delta: 10, // nm
          constrainValue: value => Util.roundToInterval( value, 50 ),
          valuePattern: nmValueString,
          majorTicks: createTicks( model.lightScene.slitWidthProperty )
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
      const slitWidthControl = new ToggleNode( model.sceneProperty, [
        { value: model.waterScene, node: waterSlitWidthControl },
        { value: model.soundScene, node: soundSlitWidthControl },
        { value: model.lightScene, node: lightSlitWidthControl }
      ] );
      barrierTypeDynamicProperty.link( barrierType => {
        const enabled = barrierType === BarrierTypeEnum.ONE_SLIT || barrierType === BarrierTypeEnum.TWO_SLITS;
        waterSlitWidthControl.enabled = enabled;
        soundSlitWidthControl.enabled = enabled;
        lightSlitWidthControl.enabled = enabled;
      } );

      // Slit separation controls.  Ranges, values and deltas specified in
      // https://github.com/phetsims/wave-interference/issues/177
      const waterSeparationControl = new NumberControl(
        slitSeparationString,
        model.waterScene.slitSeparationProperty,
        model.waterScene.slitSeparationProperty.range,
        _.extend( {
          decimalPlaces: 1,
          delta: 0.1, // cm
          valuePattern: cmValueString,
          majorTicks: createTicks( model.waterScene.slitSeparationProperty )
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );

      const soundSeparationControl = new NumberControl(
        slitSeparationString,
        model.soundScene.slitSeparationProperty,
        model.soundScene.slitSeparationProperty.range,
        _.extend( {
          delta: 1, // cm
          constrainValue: value => Util.roundToInterval( value, 10 ),
          valuePattern: cmValueString,
          majorTicks: createTicks( model.soundScene.slitSeparationProperty )
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );

      const lightSeparationControl = new NumberControl(
        slitSeparationString,
        model.lightScene.slitSeparationProperty,
        model.lightScene.slitSeparationProperty.range,
        _.extend( {
          delta: 10, // nm
          constrainValue: value => Util.roundToInterval( value, 50 ),
          valuePattern: nmValueString,
          majorTicks: createTicks( model.lightScene.slitSeparationProperty )
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
      const slitSeparationControl = new ToggleNode( model.sceneProperty, [
        { value: model.waterScene, node: waterSeparationControl },
        { value: model.soundScene, node: soundSeparationControl },
        { value: model.lightScene, node: lightSeparationControl }
      ] );

      barrierTypeDynamicProperty.link( barrierType => {
        const enabled = barrierType === BarrierTypeEnum.TWO_SLITS;
        waterSeparationControl.enabled = enabled;
        soundSeparationControl.enabled = enabled;
        lightSeparationControl.enabled = enabled;
      } );

      // Vertical layout
      slitWidthControl.top = comboBox.bottom + 10;
      slitSeparationControl.top = slitWidthControl.bottom + 14;

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

      super( content, {
        maxWidth: WaveInterferenceConstants.PANEL_MAX_WIDTH
      } );
    }
  }

  return waveInterference.register( 'SlitsControlPanel', SlitsControlPanel );
} );