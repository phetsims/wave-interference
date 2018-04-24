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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Range = require( 'DOT/Range' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // strings
  var noBarrierString = require( 'string!WAVE_INTERFERENCE/noBarrier' );
  var oneSlitString = require( 'string!WAVE_INTERFERENCE/oneSlit' );
  var twoSlitsString = require( 'string!WAVE_INTERFERENCE/twoSlits' );
  var locationString = require( 'string!WAVE_INTERFERENCE/location' );
  var slitWidthString = require( 'string!WAVE_INTERFERENCE/slitWidth' );
  var slitSeparationString = require( 'string!WAVE_INTERFERENCE/slitSeparation' );

  /**
   * @param {AlignGroup} alignGroup
   * @param {SlitsScreenModel} model
   * @param {Node} comboBoxParent
   * @param {Object} [options]
   * @constructor
   */
  function SlitsControlPanel( alignGroup, model, comboBoxParent, options ) {

    // TODO: center or make as wide as the rest of the controls
    var comboBox = new ComboBox( [
      ComboBox.createItem( new WaveInterferenceText( noBarrierString ), BarrierTypeEnum.NO_BARRIER ),
      ComboBox.createItem( new WaveInterferenceText( oneSlitString ), BarrierTypeEnum.ONE_SLIT ),
      ComboBox.createItem( new WaveInterferenceText( twoSlitsString ), BarrierTypeEnum.TWO_SLITS )
    ], model.barrierTypeProperty, comboBoxParent, {
      buttonYMargin: 0
    } );

    // Controls are in the coordinate frame of the lattice
    var locationControl = new NumberControl( locationString, model.barrierLocationProperty, new Range( model.lattice.dampX, model.lattice.width - model.lattice.dampX ), _.extend( {
      majorTicks: [
        { value: 1000, label: new WaveInterferenceText( 1000, { fontSize: 10 } ) },
        { value: 5000, label: new WaveInterferenceText( 5000, { fontSize: 10 } ) } ]
    }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );

    model.barrierTypeProperty.link( function( barrierType ) {
      locationControl.enabled = barrierType === BarrierTypeEnum.ONE_SLIT ||
                                barrierType === BarrierTypeEnum.TWO_SLITS;
    } );

    var slitWidthControl = new NumberControl( slitWidthString, model.slitWidthProperty, new Range( 0, 20 ), _.extend( {
      majorTicks: [
        { value: 0, label: new WaveInterferenceText( 0, { fontSize: 10 } ) },
        { value: 200, label: new WaveInterferenceText( 200, { fontSize: 10 } ) } ]
    }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
    model.barrierTypeProperty.link( function( barrierType ) {
      slitWidthControl.enabled = barrierType === BarrierTypeEnum.ONE_SLIT ||
                                 barrierType === BarrierTypeEnum.TWO_SLITS;
    } );

    var slitSeparationControl = new NumberControl( slitSeparationString, model.slitSeparationProperty, new Range( 0, 30 ), _.extend( {
      majorTicks: [
        { value: 0, label: new WaveInterferenceText( 0, { fontSize: 10 } ) },
        { value: 2000, label: new WaveInterferenceText( 2000, { fontSize: 10 } ) } ]
    }, WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS ) );
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