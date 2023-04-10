// Copyright 2018-2023, University of Colorado Boulder
// @ts-nocheck
/**
 * Controls for the barrier/slits.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import { Node } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import Scene from '../../common/model/Scene.js';
import WaveInterferencePanel from '../../common/view/WaveInterferencePanel.js';
import WaveInterferenceText from '../../common/view/WaveInterferenceText.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';

const cmValueString = WaveInterferenceStrings.cmValue;
const nmValueString = WaveInterferenceStrings.nmValue;
const noBarrierString = WaveInterferenceStrings.noBarrier;
const oneSlitString = WaveInterferenceStrings.oneSlit;
const slitSeparationString = WaveInterferenceStrings.slitSeparation;
const slitWidthString = WaveInterferenceStrings.slitWidth;
const twoSlitsString = WaveInterferenceStrings.twoSlits;

class SlitsControlPanel extends WaveInterferencePanel {

  public constructor( alignGroup, sceneProperty, waterScene, soundScene, lightScene, comboBoxParent ) {

    const barrierTypeDynamicProperty = new DynamicProperty( sceneProperty, {
      derive: 'barrierTypeProperty',
      bidirectional: true
    } );

    const comboBox = new ComboBox( barrierTypeDynamicProperty, [
      { value: Scene.BarrierType.ONE_SLIT, createNode: () => new WaveInterferenceText( oneSlitString ) },
      { value: Scene.BarrierType.TWO_SLITS, createNode: () => new WaveInterferenceText( twoSlitsString ) },
      { value: Scene.BarrierType.NO_BARRIER, createNode: () => new WaveInterferenceText( noBarrierString ) }
    ], comboBoxParent, {
      xMargin: 13,
      yMargin: 6,
      cornerRadius: 4
    } );

    const createLabel = text => new WaveInterferenceText( text, {
      fontSize: WaveInterferenceConstants.TICK_FONT_SIZE,
      maxWidth: WaveInterferenceConstants.TICK_MAX_WIDTH
    } );

    const createTicks = property => [
      { value: property.range.min, label: createLabel( `${property.range.min}` ) },
      { value: property.range.max, label: createLabel( `${property.range.max}` ) }
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
          constrainValue: value => Utils.roundToInterval( value, 10 ),
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
          constrainValue: value => Utils.roundToInterval( value, 50 ),
          majorTicks: createTicks( lightScene.slitWidthProperty )
        },
        numberDisplayOptions: {
          valuePattern: nmValueString
        }
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
    const slitWidthControl = new ToggleNode( sceneProperty, [
      { value: waterScene, createNode: () => waterSlitWidthControl },
      { value: soundScene, createNode: () => soundSlitWidthControl },
      { value: lightScene, createNode: () => lightSlitWidthControl }
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
          constrainValue: value => Utils.roundToInterval( value, 10 ),
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
          constrainValue: value => Utils.roundToInterval( value, 50 ),
          majorTicks: createTicks( lightScene.slitSeparationProperty )
        },
        numberDisplayOptions: { valuePattern: nmValueString }
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
    const slitSeparationControl = new ToggleNode( sceneProperty, [
      { value: waterScene, createNode: () => waterSeparationControl },
      { value: soundScene, createNode: () => soundSeparationControl },
      { value: lightScene, createNode: () => lightSeparationControl }
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

waveInterference.register( 'SlitsControlPanel', SlitsControlPanel );
export default SlitsControlPanel;