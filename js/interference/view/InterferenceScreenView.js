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
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
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
    }
  }

  return waveInterference.register( 'InterferenceScreenView', InterferenceScreenView );
} );