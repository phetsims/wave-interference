// Copyright 2018-2019, University of Colorado Boulder

/**
 * ScreenView for the Slits screen
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BarriersNode = require( 'WAVE_INTERFERENCE/slits/view/BarriersNode' );
  const PlaneWaveGeneratorNode = require( 'WAVE_INTERFERENCE/slits/view/PlaneWaveGeneratorNode' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
  const SlitsControlPanel = require( 'WAVE_INTERFERENCE/slits/view/SlitsControlPanel' );
  const TheoryInterferenceOverlay = require( 'WAVE_INTERFERENCE/slits/view/TheoryInterferenceOverlay' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceQueryParameters = require( 'WAVE_INTERFERENCE/common/WaveInterferenceQueryParameters' );
  const WavesModel = require( 'WAVE_INTERFERENCE/waves/model/WavesModel' );
  const WavesScreenView = require( 'WAVE_INTERFERENCE/waves/view/WavesScreenView' );

  class SlitsScreenView extends WavesScreenView {

    /**
     * @param {SlitsModel} model
     * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
     */
    constructor( model, alignGroup ) {
      super( model, alignGroup, {
        showPulseContinuousRadioButtons: false,

        // Show the plane wave generator instead of the individual scene-specific emitters
        showSceneSpecificWaveGeneratorNodes: false
      } );

      // The Slits screen has an additional control panel below the main control panel, which controls the barrier/slits
      const slitControlPanel = new SlitsControlPanel(
        alignGroup, model.sceneProperty, model.waterScene, model.soundScene, model.lightScene, this
      );

      // When the alignGroup changes the size of the slitsControlPanel, readjust its positioning.  Should only happen
      // during startup.  Use the same pattern as required in WavesScreenView for consistency.
      const updateSlitControlPanel = () => {
        slitControlPanel.mutate( {
          left: this.controlPanel.left,
          top: this.controlPanel.bottom + WavesScreenView.SPACING
        } );
      };
      updateSlitControlPanel();
      slitControlPanel.on( 'bounds', updateSlitControlPanel );
      this.controlPanel.on( 'bounds', updateSlitControlPanel );
      this.addChild( slitControlPanel );

      // Make sure tools go in front of this control panel, see https://github.com/phetsims/wave-interference/issues/218
      slitControlPanel.moveToBack();

      // Show the barriers when appropriate. Cannot use ToggleNode because of asymmetry, see the multilink
      const waterBarriersNode = new BarriersNode( model, model.waterScene, this.waveAreaNode.bounds );
      const soundBarriersNode = new BarriersNode( model, model.soundScene, this.waveAreaNode.bounds );
      const lightBarriersNode = new BarriersNode( model, model.lightScene, this.waveAreaNode.bounds );
      Property.multilink(
        [ model.sceneProperty, model.rotationAmountProperty, model.isRotatingProperty, model.viewpointProperty ],
        ( scene, rotationAmount, isRotating, viewpoint ) => {

          // Hide the barriers for water side view and while rotating
          const hide = scene === model.waterScene && viewpoint === WavesModel.Viewpoint.SIDE || isRotating;
          waterBarriersNode.visible = !hide && scene === model.waterScene;
          soundBarriersNode.visible = !hide && scene === model.soundScene;
          lightBarriersNode.visible = !hide && scene === model.lightScene;
        } );
      this.afterWaveAreaNode.addChild( waterBarriersNode );
      this.afterWaveAreaNode.addChild( soundBarriersNode );
      this.afterWaveAreaNode.addChild( lightBarriersNode );

      // When enabled by a query parameter, show the theoretical interference pattern.
      if ( WaveInterferenceQueryParameters.theory ) {
        this.addChild( new TheoryInterferenceOverlay( model.sceneProperty, model.scenes, this.waveAreaNode.bounds, {
          interferenceScreen: false,
          clipArea: Shape.bounds( this.waveAreaNode.bounds )
        } ) );
      }

      // Show the plane wave generator instead of the individual scene-specific emitters
      const planeWaveGeneratorNode = new PlaneWaveGeneratorNode( model, this.waveAreaNode.bounds );
      this.waveGeneratorLayer.addChild( planeWaveGeneratorNode );
    }
  }

  return waveInterference.register( 'SlitsScreenView', SlitsScreenView );
} );