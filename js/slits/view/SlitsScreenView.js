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
  var SceneType = require( 'WAVE_INTERFERENCE/common/model/SceneType' );
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
    WavesScreenView.call( this, model, alignGroup );

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

    var barriersNode = new BarriersNode( model, this.waveAreaNode.bounds );
    Property.multilink( [ model.rotationAmountProperty, model.sceneProperty, model.viewTypeProperty ], function( rotationAmount, scene, view ) {

      // Hide the barriers for water side view and while rotating
      var hide = scene === SceneType.WATER && view === ViewType.SIDE || ( rotationAmount > 0 && rotationAmount < 1 ); // TODO: create isRotatingProperty
      barriersNode.visible = !hide;
    } );
    this.addChild( barriersNode );
  }

  waveInterference.register( 'SlitsScreenView', SlitsScreenView );

  return inherit( WavesScreenView, SlitsScreenView );
} );