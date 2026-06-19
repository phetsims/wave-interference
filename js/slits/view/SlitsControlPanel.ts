// Copyright 2018-2026, University of Colorado Boulder

/**
 * Controls for the barrier/slits.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import Scene from '../../common/model/Scene.js';
import WaveInterferencePanel from '../../common/view/WaveInterferencePanel.js';
import WaveInterferenceText from '../../common/view/WaveInterferenceText.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';

class SlitsControlPanel extends WaveInterferencePanel {

  public constructor( alignGroup: AlignGroup, sceneProperty: Property<Scene>, waterScene: Scene | null, soundScene: Scene | null, lightScene: Scene | null, comboBoxParent: Node ) {

    // On the Slits screen all three scenes are always created (see SlitsModel/WavesModel), so they are non-null here.
    affirm( waterScene && soundScene && lightScene, 'waterScene, soundScene and lightScene are required' );

    const barrierTypeDynamicProperty = new DynamicProperty( sceneProperty, {

      // barrierTypeProperty is only created for plane-wave (slits) scenes, which are the only scenes used here.
      derive: ( scene: Scene ) => scene.barrierTypeProperty!,
      bidirectional: true
    } );

    const comboBox = new ComboBox( barrierTypeDynamicProperty, [
      { value: 'oneSlit', createNode: () => new WaveInterferenceText( WaveInterferenceStrings.oneSlitStringProperty ) },
      { value: 'twoSlits', createNode: () => new WaveInterferenceText( WaveInterferenceStrings.twoSlitsStringProperty ) },
      { value: 'noBarrier', createNode: () => new WaveInterferenceText( WaveInterferenceStrings.noBarrierStringProperty ) }
    ], comboBoxParent, {
      xMargin: 13,
      yMargin: 6,
      cornerRadius: 4
    } );

    const createLabel = ( text: string ) => new WaveInterferenceText( text, {
      fontSize: WaveInterferenceConstants.TICK_FONT_SIZE,
      maxWidth: WaveInterferenceConstants.TICK_MAX_WIDTH
    } );

    const createTicks = ( property: NumberProperty ) => [
      { value: property.range.min, label: createLabel( `${property.range.min}` ) },
      { value: property.range.max, label: createLabel( `${property.range.max}` ) }
    ];

    // Slit width controls.  Ranges, values and deltas specified in
    // https://github.com/phetsims/wave-interference/issues/177
    const waterSlitWidthControl = new NumberControl(
      WaveInterferenceStrings.slitWidthStringProperty, waterScene.slitWidthProperty, waterScene.slitWidthProperty.range, merge( {
        delta: 0.1, // cm
        numberDisplayOptions: {
          decimalPlaces: 1
        },
        sliderOptions: {
          majorTicks: createTicks( waterScene.slitWidthProperty )
        }
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );

    const soundSlitWidthControl = new NumberControl(
      WaveInterferenceStrings.slitWidthStringProperty, soundScene.slitWidthProperty, soundScene.slitWidthProperty.range, merge( {
        delta: 1, // cm
        sliderOptions: {
          constrainValue: ( value: number ) => Utils.roundToInterval( value, 10 ),
          majorTicks: createTicks( soundScene.slitWidthProperty )
        }
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );

    const lightSlitWidthControl = new NumberControl(
      WaveInterferenceStrings.slitWidthStringProperty, lightScene.slitWidthProperty, lightScene.slitWidthProperty.range, merge( {
        delta: 10, // nm
        sliderOptions: {
          constrainValue: ( value: number ) => Utils.roundToInterval( value, 50 ),
          majorTicks: createTicks( lightScene.slitWidthProperty )
        }
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
    const slitWidthControl = new ToggleNode( sceneProperty, [
      { value: waterScene, createNode: () => waterSlitWidthControl },
      { value: soundScene, createNode: () => soundSlitWidthControl },
      { value: lightScene, createNode: () => lightSlitWidthControl }
    ] );
    barrierTypeDynamicProperty.link( barrierType => {

      const enabled = barrierType === 'oneSlit' || barrierType === 'twoSlits';
      waterSlitWidthControl.enabled = enabled;
      soundSlitWidthControl.enabled = enabled;
      lightSlitWidthControl.enabled = enabled;
    } );

    // Slit separation controls.  Ranges, values and deltas specified in
    // https://github.com/phetsims/wave-interference/issues/177
    const waterSeparationControl = new NumberControl(
      WaveInterferenceStrings.slitSeparationStringProperty,
      waterScene.slitSeparationProperty,
      waterScene.slitSeparationProperty.range,
      merge( {
        delta: 0.1, // cm
        numberDisplayOptions: {
          decimalPlaces: 1
        },
        sliderOptions: {
          majorTicks: createTicks( waterScene.slitSeparationProperty )
        }
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );

    const soundSeparationControl = new NumberControl(
      WaveInterferenceStrings.slitSeparationStringProperty,
      soundScene.slitSeparationProperty,
      soundScene.slitSeparationProperty.range,
      merge( {
        delta: 1, // cm
        sliderOptions: {
          constrainValue: ( value: number ) => Utils.roundToInterval( value, 10 ),
          majorTicks: createTicks( soundScene.slitSeparationProperty )
        }
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );

    const lightSeparationControl = new NumberControl(
      WaveInterferenceStrings.slitSeparationStringProperty,
      lightScene.slitSeparationProperty,
      lightScene.slitSeparationProperty.range,
      merge( {
        delta: 10, // nm
        sliderOptions: {
          constrainValue: ( value: number ) => Utils.roundToInterval( value, 50 ),
          majorTicks: createTicks( lightScene.slitSeparationProperty )
        }
      }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
    const slitSeparationControl = new ToggleNode( sceneProperty, [
      { value: waterScene, createNode: () => waterSeparationControl },
      { value: soundScene, createNode: () => soundSeparationControl },
      { value: lightScene, createNode: () => lightSeparationControl }
    ] );

    barrierTypeDynamicProperty.link( barrierType => {

      const enabled = barrierType === 'twoSlits';
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

export default SlitsControlPanel;
