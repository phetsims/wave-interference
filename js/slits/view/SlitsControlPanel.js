// Copyright 2018-2019, University of Colorado Boulder

/**
 * Controls for the barrier/slits.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const Scene = require( 'WAVE_INTERFERENCE/common/model/Scene' );
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
     * @param {Property.<Scene>} sceneProperty
     * @param {Scene} waterScene
     * @param {Scene} soundScene
     * @param {Scene} lightScene
     * @param {Node} comboBoxParent
     */
    constructor( alignGroup, sceneProperty, waterScene, soundScene, lightScene, comboBoxParent ) {

      const barrierTypeDynamicProperty = new DynamicProperty( sceneProperty, {
        derive: 'barrierTypeProperty',
        bidirectional: true
      } );

      const comboBox = new ComboBox( [
        new ComboBoxItem( new WaveInterferenceText( oneSlitString ), Scene.BarrierType.ONE_SLIT ),
        new ComboBoxItem( new WaveInterferenceText( twoSlitsString ), Scene.BarrierType.TWO_SLITS ),
        new ComboBoxItem( new WaveInterferenceText( noBarrierString ), Scene.BarrierType.NO_BARRIER )
      ], barrierTypeDynamicProperty, comboBoxParent, {
        xMargin: 13,
        yMargin: 6,
        cornerRadius: 4
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
        slitWidthString, waterScene.slitWidthProperty, waterScene.slitWidthProperty.range, merge( {
          delta: 0.1, // cm
          numberDisplayOptions: {
            decimalPlaces: 1,
            valuePattern: cmValueString
          },
          sliderOptions: {
            majorTicks: createTicks( waterScene.slitWidthProperty )
          }
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );

      const soundSlitWidthControl = new NumberControl(
        slitWidthString, soundScene.slitWidthProperty, soundScene.slitWidthProperty.range, merge( {
          delta: 1, // cm
          sliderOptions: {
            constrainValue: value => Util.roundToInterval( value, 10 ),
            majorTicks: createTicks( soundScene.slitWidthProperty )
          },
          numberDisplayOptions: {
            valuePattern: cmValueString
          }
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );

      const lightSlitWidthControl = new NumberControl(
        slitWidthString, lightScene.slitWidthProperty, lightScene.slitWidthProperty.range, merge( {
          delta: 10, // nm
          sliderOptions: {
            constrainValue: value => Util.roundToInterval( value, 50 ),
            majorTicks: createTicks( lightScene.slitWidthProperty )
          },
          numberDisplayOptions: {
            valuePattern: nmValueString
          }
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
      const slitWidthControl = new ToggleNode( sceneProperty, [
        { value: waterScene, node: waterSlitWidthControl },
        { value: soundScene, node: soundSlitWidthControl },
        { value: lightScene, node: lightSlitWidthControl }
      ] );
      barrierTypeDynamicProperty.link( barrierType => {
        const enabled = barrierType === Scene.BarrierType.ONE_SLIT || barrierType === Scene.BarrierType.TWO_SLITS;
        waterSlitWidthControl.enabled = enabled;
        soundSlitWidthControl.enabled = enabled;
        lightSlitWidthControl.enabled = enabled;
      } );

      // Slit separation controls.  Ranges, values and deltas specified in
      // https://github.com/phetsims/wave-interference/issues/177
      const waterSeparationControl = new NumberControl(
        slitSeparationString,
        waterScene.slitSeparationProperty,
        waterScene.slitSeparationProperty.range,
        merge( {
          delta: 0.1, // cm
          numberDisplayOptions: {
            decimalPlaces: 1,
            valuePattern: cmValueString
          },
          sliderOptions: {
            majorTicks: createTicks( waterScene.slitSeparationProperty )
          }
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );

      const soundSeparationControl = new NumberControl(
        slitSeparationString,
        soundScene.slitSeparationProperty,
        soundScene.slitSeparationProperty.range,
        merge( {
          delta: 1, // cm
          numberDisplayOptions: {
            valuePattern: cmValueString
          },
          sliderOptions: {
            constrainValue: value => Util.roundToInterval( value, 10 ),
            majorTicks: createTicks( soundScene.slitSeparationProperty )
          }
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );

      const lightSeparationControl = new NumberControl(
        slitSeparationString,
        lightScene.slitSeparationProperty,
        lightScene.slitSeparationProperty.range,
        merge( {
          delta: 10, // nm
          sliderOptions: {
            constrainValue: value => Util.roundToInterval( value, 50 ),
            majorTicks: createTicks( lightScene.slitSeparationProperty )
          },
          numberDisplayOptions: { valuePattern: nmValueString }
        }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
      const slitSeparationControl = new ToggleNode( sceneProperty, [
        { value: waterScene, node: waterSeparationControl },
        { value: soundScene, node: soundSeparationControl },
        { value: lightScene, node: lightSeparationControl }
      ] );

      barrierTypeDynamicProperty.link( barrierType => {
        const enabled = barrierType === Scene.BarrierType.TWO_SLITS;
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