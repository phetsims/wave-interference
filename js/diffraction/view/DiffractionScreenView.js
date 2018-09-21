// Copyright 2017-2018, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const Panel = require( 'SUN/Panel' );
  const Property = require( 'AXON/Property' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // constants
  const width = 256;
  const height = width;
  const NUMBER_CONTROL_OPTIONS = WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS;
  const PANEL_OPTIONS = {
    xMargin: 10,
    yMargin: 10,
    cornerRadius: 5
  };
  const BOX_SPACING = 15;

  /**
   * @param {number} x0
   * @param {number} y0
   * @param {number} sigmaX
   * @param {number} sigmaY
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  function gaussian( x0, y0, sigmaX, sigmaY, x, y ) {
    const dx = x - x0;
    const dy = y - y0;
    const a = dx * dx / sigmaX / sigmaX;
    const b = dy * dy / sigmaY / sigmaY;
    return Math.pow( Math.E, -( a + b ) / 2 );
  }

  class DiffractionScreenView extends ScreenView {

    /**
     * @param {WaveInterferenceModel} diffractionModel
     */
    constructor( diffractionModel ) {

      super();

      this.onProperty = new Property( true );
      const laserPointerNode = new LaserPointerNode( this.onProperty, {
        left: 10,
        centerY: 50,
        bodySize: new Dimension2( 110 * 0.8, 78 * 0.8 ),
        nozzleSize: new Dimension2( 20 * 0.8, 60 * 0.8 )
      } );

      // Reset All button
      const resetAllButton = new ResetAllButton( {
        listener: () => diffractionModel.reset(),
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10
      } );
      this.addChild( resetAllButton );

      this.squareWidthProperty = new Property( 10 );
      this.squareHeightProperty = new Property( 10 );

      this.numberOfLinesProperty = new Property( 10 );
      this.angleProperty = new Property( 0 );

      this.sigmaXProperty = new Property( 10 );
      this.sigmaYProperty = new Property( 10 );
      this.gaussianMagnitudeProperty = new Property( 400 );

      this.sceneProperty = new Property( 'rectangle' );
      const toggleButtonsContent = [ {
        value: 'rectangle',
        node: new Rectangle( 0, 0, 20, 20, { fill: 'black' } )
      }, {
        value: 'circle',
        node: new Circle( 10, { fill: 'black' } )
      } ];
      const radioButtonGroup = new RadioButtonGroup( this.sceneProperty, toggleButtonsContent, {
        left: 10,
        bottom: this.layoutBounds.bottom - 10
      } );

      this.placeholderImage = document.createElement( 'canvas' );
      this.placeholderImage.width = width;
      this.placeholderImage.height = height;

      const context = this.placeholderImage.getContext( '2d' );
      context.fillStyle = 'black';
      context.fillRect( 0, 0, width, height );

      const imageScale = 1.5;
      this.apertureImage = new Image( this.placeholderImage, { scale: imageScale, top: 100, left: 140 } );
      this.addChild( this.apertureImage );


      this.diffractionImage = new Image( this.placeholderImage, {
        right: this.layoutBounds.right - 10,
        scale: imageScale,
        top: 100
      } );
      this.addChild( this.diffractionImage );

      const ICON_SCALE = 0.2;
      this.apertureIcon = new Image( this.placeholderImage, {
        scale: ICON_SCALE,
        centerY: laserPointerNode.centerY,
        centerX: this.apertureImage.centerX,
        matrix: Matrix3.affine( 1, 0, 0, 0.25, 1, 0 )
      } );

      this.diffractionIcon = new Image( this.placeholderImage, {
        scale: ICON_SCALE,
        centerY: laserPointerNode.centerY,
        centerX: this.diffractionImage.centerX,
        matrix: Matrix3.affine( 1, 0, 0, 0.25, 1, 0 )
      } );
      this.addChild( this.diffractionIcon );

      const updateCanvases = this.updateCanvases.bind( this );

      this.sceneProperty.lazyLink( updateCanvases );

      this.addChild( radioButtonGroup );

      this.squareWidthProperty.lazyLink( updateCanvases );
      this.squareHeightProperty.lazyLink( updateCanvases );
      this.sigmaXProperty.lazyLink( updateCanvases );
      this.sigmaYProperty.lazyLink( updateCanvases );
      this.onProperty.lazyLink( updateCanvases );
      this.numberOfLinesProperty.lazyLink( updateCanvases );
      this.angleProperty.lazyLink( updateCanvases );
      this.gaussianMagnitudeProperty.lazyLink( updateCanvases );
      this.squareControlPanel = new Panel( new VBox( {
        spacing: BOX_SPACING,
        children: [
          new NumberControl( 'width', this.squareWidthProperty, new Range( 2, 100 ), _.extend( {
            delta: 2 // avoid odd/even artifacts
          }, NUMBER_CONTROL_OPTIONS ) ),
          new NumberControl( 'height', this.squareHeightProperty, new Range( 2, 100 ), _.extend( {
            delta: 2 // avoid odd/even artifacts
          }, NUMBER_CONTROL_OPTIONS ) ) ]
      } ), _.extend( {
        leftTop: this.apertureImage.leftBottom.plusXY( 0, 5 )
      }, PANEL_OPTIONS ) );
      this.addChild( this.squareControlPanel );

      this.gaussianControlPanel = new Panel( new VBox( {
        spacing: BOX_SPACING,
        children: [
          new NumberControl( 'sigmaX', this.sigmaXProperty, new Range( 2, 40 ), NUMBER_CONTROL_OPTIONS ),
          new NumberControl( 'sigmaY', this.sigmaYProperty, new Range( 2, 40 ), NUMBER_CONTROL_OPTIONS )
        ]
      } ), _.extend( {
        leftTop: this.apertureImage.leftBottom.plusXY( 0, 5 )
      }, PANEL_OPTIONS ) );
      this.addChild( this.gaussianControlPanel );

      this.slitsControlPanel = new Panel( new VBox( {
        spacing: BOX_SPACING,
        children: [
          new NumberControl( 'number of lines', this.numberOfLinesProperty, new Range( 2, 200 ), NUMBER_CONTROL_OPTIONS ),
          new NumberControl( 'angle', this.angleProperty, new Range( 0, Math.PI * 2 ), _.extend( {
            delta: 0.01
          }, NUMBER_CONTROL_OPTIONS ) )
        ]
      } ), _.extend( {
        leftTop: this.apertureImage.leftBottom.plusXY( 0, 5 )
      }, PANEL_OPTIONS ) );
      this.addChild( this.slitsControlPanel );

      this.sceneProperty.link( scene => {
        this.squareControlPanel.visible = scene === 'rectangle';
        this.gaussianControlPanel.visible = scene === 'circle';
        this.slitsControlPanel.visible = scene === 'slits';
      } );

      const beamWidth = 40;
      const incidentBeam = new Rectangle( laserPointerNode.right, laserPointerNode.centerY - beamWidth / 2, this.apertureIcon.centerX - laserPointerNode.right, beamWidth, {
        fill: 'gray',
        opacity: 0.7
      } );

      const transmittedBeam = new Rectangle( this.apertureIcon.centerX, laserPointerNode.centerY - beamWidth / 2, this.diffractionIcon.centerX - this.apertureIcon.centerX, beamWidth, {
        fill: 'gray',
        opacity: 0.7
      } );

      this.onProperty.linkAttribute( incidentBeam, 'visible' );
      this.onProperty.linkAttribute( transmittedBeam, 'visible' );

      this.addChild( transmittedBeam );
      this.addChild( this.apertureIcon );
      this.addChild( incidentBeam );
      this.addChild( laserPointerNode );

      updateCanvases();
    }

    updateCanvases() {

      // Usage code from JS-Fourier-Image-Analysis/js/main.js
      const dims = [ width, height ]; // will be set later
      const cc = 9e-3; // contrast constant

      let start = +new Date();
      // make each canvas the image's exact size
      const syntheticApertureCanvas = document.createElement( 'canvas' );
      syntheticApertureCanvas.width = dims[ 0 ];
      syntheticApertureCanvas.height = dims[ 1 ];
      const syntheticApertureContext = syntheticApertureCanvas.getContext( '2d' );

      const displayedApertureCanvas = document.createElement( 'canvas' );
      displayedApertureCanvas.width = dims[ 0 ];
      displayedApertureCanvas.height = dims[ 1 ];
      const displayedApertureContext = displayedApertureCanvas.getContext( '2d' );

      const diffractionCanvas = document.createElement( 'canvas' );
      diffractionCanvas.width = dims[ 0 ];
      diffractionCanvas.height = dims[ 1 ];
      const diffractionContext = diffractionCanvas.getContext( '2d' );

      syntheticApertureContext.fillStyle = 'black';
      syntheticApertureContext.fillRect( 0, 0, width, height );
      syntheticApertureContext.fillStyle = 'white';

      displayedApertureContext.fillStyle = 'black';
      displayedApertureContext.fillRect( 0, 0, width, height );
      displayedApertureContext.fillStyle = 'white';

      let i;

      if ( this.sceneProperty.value === 'rectangle' ) {
        const rectWidth = this.squareWidthProperty.value;
        const rectHeight = this.squareHeightProperty.value;
        syntheticApertureContext.fillRect( width / 2 - rectWidth / 2, width / 2 - rectHeight / 2, rectWidth, rectHeight );
        displayedApertureContext.fillRect( width / 2 - rectWidth / 2, width / 2 - rectHeight / 2, rectWidth, rectHeight );
      }
      else if ( this.sceneProperty.value === 'circle' ) {
        for ( i = 0; i < width; i++ ) {
          for ( let k = 0; k < height; k++ ) {
            const v = Util.clamp( Math.floor( gaussian( width / 2, height / 2, this.sigmaXProperty.value, this.sigmaYProperty.value, i, k ) * this.gaussianMagnitudeProperty.value ), 0, 255 );
            const v2 = v > 128 ? 255 : 0;
            syntheticApertureContext.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
            displayedApertureContext.fillStyle = 'rgb(' + v2 + ',' + v2 + ',' + v2 + ')';
            syntheticApertureContext.fillRect( i, k, 1, 1 );
            displayedApertureContext.fillRect( i, k, 1, 1 );
          }
        }
      }
      else if ( this.sceneProperty.value === 'slits' ) {

        syntheticApertureContext.rotate( this.angleProperty.value );
        displayedApertureContext.rotate( this.angleProperty.value );
        const slitWidth = 1;
        const numberOfLines = this.numberOfLinesProperty.value;
        const lineSpacing = width / ( numberOfLines + 1 );

        // Even number of lines
        if ( numberOfLines % 2 === 0 ) {

          for ( i = 0; i < numberOfLines / 2; i++ ) {
            syntheticApertureContext.fillRect( width / 2 + i * lineSpacing + lineSpacing / 2, -1000, slitWidth, 2000 );
            displayedApertureContext.fillRect( width / 2 + i * lineSpacing + lineSpacing / 2, -1000, slitWidth, 2000 );
            syntheticApertureContext.fillRect( width / 2 - i * lineSpacing - lineSpacing / 2, -1000, slitWidth, 2000 );
            displayedApertureContext.fillRect( width / 2 - i * lineSpacing - lineSpacing / 2, -1000, slitWidth, 2000 );
          }
        }
        else {

          // odd number of lines
          for ( i = 0; i < numberOfLines / 2; i++ ) {
            syntheticApertureContext.fillRect( width / 2 + i * lineSpacing, -1000, slitWidth, 2000 );
            displayedApertureContext.fillRect( width / 2 + i * lineSpacing, -1000, slitWidth, 2000 );
            if ( i !== 0 ) { // only draw central line once
              syntheticApertureContext.fillRect( width / 2 - i * lineSpacing, -1000, slitWidth, 2000 );
              displayedApertureContext.fillRect( width / 2 - i * lineSpacing, -1000, slitWidth, 2000 );
            }
          }
        }
      }

      // grab the pixels
      const imageData = syntheticApertureContext.getImageData( 0, 0, dims[ 0 ], dims[ 1 ] );
      const h_es = []; // the h values
      for ( let ai = 0; ai < imageData.data.length; ai += 4 ) {

        // greyscale, so you only need every 4th value
        h_es.push( imageData.data[ ai ] );
      }

      // initialize the h values
      const h = function( n, m ) {
        if ( arguments.length === 0 ) {
          return h_es;
        }

        const idx = n * dims[ 0 ] + m;
        return h_es[ idx ];
      }; // make it a function so the code matches the math

      let duration = +new Date() - start;
      console.log( 'It took ' + duration + 'ms to draw the image.' );

      start = +new Date();

      // compute the h hat values
      let h_hats = [];
      Fourier.transform( h(), h_hats );
      h_hats = Fourier.shift( h_hats, dims );

      // get the largest magnitude
      let maxMagnitude = 0;
      for ( let ai = 0; ai < h_hats.length; ai++ ) {
        const mag = h_hats[ ai ].magnitude();
        if ( mag > maxMagnitude ) {
          maxMagnitude = mag;
        }
      }

      Fourier.filter( h_hats, dims, NaN, NaN );

      // store them in a nice function to match the math
      const $h = function( k, l ) {
        if ( arguments.length === 0 ) {
          return h_hats;
        }

        const idx = k * dims[ 0 ] + l;
        return h_hats[ idx ];
      };

      // draw the pixels
      const currImageData = diffractionContext.getImageData( 0, 0, dims[ 0 ], dims[ 1 ] );
      const logOfMaxMag = Math.log( cc * maxMagnitude + 1 );
      for ( let k = 0; k < dims[ 1 ]; k++ ) {
        for ( let l = 0; l < dims[ 0 ]; l++ ) {
          const idxInPixels = 4 * ( dims[ 0 ] * k + l );
          currImageData.data[ idxInPixels + 3 ] = 255; // full alpha
          let color = Math.log( cc * $h( l, k ).magnitude() + 1 );
          color = Math.round( 255 * ( color / logOfMaxMag ) );
          // RGB are the same -> gray
          for ( let c = 0; c < 3; c++ ) { // lol c++
            currImageData.data[ idxInPixels + c ] = color;
          }
        }
      }
      diffractionContext.putImageData( currImageData, 0, 0 );

      this.apertureImage.image = displayedApertureCanvas;
      this.diffractionImage.image = this.onProperty.value ? diffractionCanvas : this.placeholderImage;

      this.apertureIcon.image = displayedApertureCanvas;
      this.diffractionIcon.image = this.onProperty.value ? diffractionCanvas : this.placeholderImage;

      duration = +new Date() - start;
      console.log( 'It took ' + duration + 'ms to compute the FT.' );
    }
  }

  return waveInterference.register( 'DiffractionScreenView', DiffractionScreenView );
} );