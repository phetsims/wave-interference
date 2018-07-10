// Copyright 2018, University of Colorado Boulder

/**
 * ScreenView for the Slits screen
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BarriersNode = require( 'WAVE_INTERFERENCE/slits/view/BarriersNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var SlitsControlPanel = require( 'WAVE_INTERFERENCE/slits/view/SlitsControlPanel' );
  var ViewType = require( 'WAVE_INTERFERENCE/common/model/ViewType' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WavesScreenView = require( 'WAVE_INTERFERENCE/waves/view/WavesScreenView' );

  /**
   * @param {SlitsScreenModel} model
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   * @constructor
   */
  function SlitsScreenView( model, alignGroup ) {
    var self = this;
    WavesScreenView.call( this, model, alignGroup, {
      showPulseContinuousRadioButtons: false
    } );

    // The Slits screen has an additional control panel below the main control panel, which controls the barrier/slits
    var slitControlPanel = new SlitsControlPanel( alignGroup, model, this );

    // When the alignGroup changes the size of the slitsControlPanel, readjust its positioning.  Should only happen
    // during startup.  Use the same pattern as required in WavesScreenView for consistency.
    var updateSlitControlPanel = function() {
      slitControlPanel.mutate( {
        left: self.controlPanel.left,
        top: self.controlPanel.bottom + WavesScreenView.SPACING
      } );
    };
    updateSlitControlPanel();
    slitControlPanel.on( 'bounds', updateSlitControlPanel );
    this.addChild( slitControlPanel );

    var waterBarriersNode = new BarriersNode( model, model.waterScene, this.waveAreaNode.bounds );
    var soundBarriersNode = new BarriersNode( model, model.soundScene, this.waveAreaNode.bounds );
    var lightBarriersNode = new BarriersNode( model, model.lightScene, this.waveAreaNode.bounds );
    Property.multilink( [ model.sceneProperty, model.rotationAmountProperty, model.isRotatingProperty, model.viewTypeProperty ], function( scene, rotationAmount, isRotating, viewType ) {

      // Hide the barriers for water side view and while rotating
      var hide = scene === model.waterScene && viewType === ViewType.SIDE || isRotating;
      waterBarriersNode.visible = !hide && scene === model.waterScene;
      soundBarriersNode.visible = !hide && scene === model.soundScene;
      lightBarriersNode.visible = !hide && scene === model.lightScene
    } );
    this.addChild( waterBarriersNode );
    this.addChild( soundBarriersNode );
    this.addChild( lightBarriersNode );
  }

  waveInterference.register( 'SlitsScreenView', SlitsScreenView );

  return inherit( WavesScreenView, SlitsScreenView );
} );