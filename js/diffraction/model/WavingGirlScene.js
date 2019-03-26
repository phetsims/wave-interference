// Copyright 2019, University of Colorado Boulder

/**
 * This scene shows a the iconic "waving girl" aperture shape.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DiffractionScene = require( 'WAVE_INTERFERENCE/diffraction/model/DiffractionScene' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  const wavingGirl256Image = require( 'image!WAVE_INTERFERENCE/waving_girl_256.png' );

  class WavingGirlScene extends DiffractionScene {

    constructor() {
      super();

      // @public {NumberProperty}
      this.heightProperty = new NumberProperty( 1000, {
        range: new Range( 0, 1000 )
      } );

      // @public {NumberProperty}
      this.rotationProperty = new NumberProperty( 0, {
        range: new Range( 0, Math.PI * 2 )
      } );

      this.properties = [ this.heightProperty, this.rotationProperty ];
    }

    // TODO: should this be a function passed to super()?
    renderToContext() {
      this.context.translate( 0, -wavingGirl256Image.height * 0.2 );
      this.context.translate( wavingGirl256Image.width / 2, wavingGirl256Image.height / 2 );
      this.context.rotate( this.rotationProperty.value );
      this.context.scale( 0.3, 0.3 * this.heightProperty.value / 1000 );
      this.context.translate( -wavingGirl256Image.width / 2, -wavingGirl256Image.height / 2 );
      this.context.drawImage( wavingGirl256Image, 0, 0 );
    }
  }

  return waveInterference.register( 'WavingGirlScene', WavingGirlScene );
} );