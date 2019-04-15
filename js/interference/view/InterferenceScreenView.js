// Copyright 2018, University of Colorado Boulder

/**
 * ScreenView for the "Interference" screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const SeparationControl = require( 'WAVE_INTERFERENCE/interference/view/SeparationControl' );
  const Shape = require( 'KITE/Shape' );
  const TheoryInterferenceOverlay = require( 'WAVE_INTERFERENCE/slits/view/TheoryInterferenceOverlay' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceQueryParameters = require( 'WAVE_INTERFERENCE/common/WaveInterferenceQueryParameters' );
  const WavesScreenView = require( 'WAVE_INTERFERENCE/waves/view/WavesScreenView' );

  class InterferenceScreenView extends WavesScreenView {

    /**
     * @param {WavesModel} model
     * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
     */
    constructor( model, alignGroup ) {

      super( model, alignGroup, {

        // The pulse option does not appear in the Interference screen, because it is distracting and does not meet a
        // specific learning goal in this context.
        showPulseContinuousRadioButtons: false,
        controlPanelOptions: {
          additionalControl: new SeparationControl( model )
        }
      } );

      // When enabled by a query parameter, show the theoretical interference pattern.
      if ( WaveInterferenceQueryParameters.theory ) {
        this.addChild( new TheoryInterferenceOverlay( model.sceneProperty, model.scenes, this.waveAreaNode.bounds, {
          clipArea: Shape.bounds( this.waveAreaNode.bounds )
        } ) );
      }
    }
  }

  return waveInterference.register( 'InterferenceScreenView', InterferenceScreenView );
} );