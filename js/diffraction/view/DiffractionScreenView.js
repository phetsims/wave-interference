// Copyright 2017-2019, University of Colorado Boulder

/**
 * Shows the Diffraction Screen
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DiffractionModel = require( 'WAVE_INTERFERENCE/diffraction/model/DiffractionModel' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const MatrixCanvasNode = require( 'WAVE_INTERFERENCE/diffraction/view/MatrixCanvasNode' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const Panel = require( 'SUN/Panel' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  // constants
  const ICON_SCALE = 0.2;
  const NUMBER_CONTROL_OPTIONS = WaveInterferenceConstants.NUMBER_CONTROL_OPTIONS;
  const PANEL_OPTIONS = {
    xMargin: 10,
    yMargin: 10,
    cornerRadius: 5
  };
  const BOX_SPACING = 15;

  class DiffractionScreenView extends ScreenView {

    /**
     * @param {DiffractionModel} model
     */
    constructor( model ) {
      super();

      // @private
      this.model = model;

      const laserPointerNode = new LaserPointerNode( model.onProperty, {
        left: 10,
        centerY: 50,
        bodySize: new Dimension2( 110 * 0.8, 78 * 0.8 ),
        nozzleSize: new Dimension2( 20 * 0.8, 60 * 0.8 )
      } );

      // Reset All button
      const resetAllButton = new ResetAllButton( {
        listener: () => model.reset(),
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10
      } );
      this.addChild( resetAllButton );

      const toggleButtonsContent = [ {
        value: model.ellipseScene,
        node: new Circle( 10, { fill: 'black' } )
      }, {
        value: model.rectangleScene,
        node: new Rectangle( 0, 0, 20, 20, { fill: 'black' } )
      } ];

      const radioButtonGroup = new RadioButtonGroup( model.sceneProperty, toggleButtonsContent, {
        left: 10,
        bottom: this.layoutBounds.bottom - 10
      } );

      this.apertureCanvas = new MatrixCanvasNode( model.apertureMatrix );
      this.apertureCanvas.setTranslation( 200, 200 );
      this.addChild( this.apertureCanvas );

      this.diffractionCanvas = new MatrixCanvasNode( model.diffractionMatrix );
      this.diffractionCanvas.left = this.apertureCanvas.right + 100;
      this.diffractionCanvas.top = this.apertureCanvas.top;
      this.addChild( this.diffractionCanvas );

      this.miniApertureCanvas = new MatrixCanvasNode( model.apertureMatrix, {
        scale: ICON_SCALE,
        centerY: laserPointerNode.centerY,
        centerX: this.apertureCanvas.centerX,
        matrix: Matrix3.affine( 1, 0, 0, 0.25, 1, 0 )
      } );

      this.miniDiffractionCanvas = new MatrixCanvasNode( model.diffractionMatrix, {
        scale: ICON_SCALE,
        centerY: laserPointerNode.centerY,
        centerX: this.diffractionCanvas.centerX,
        matrix: Matrix3.affine( 1, 0, 0, 0.25, 1, 0 )
      } );

      const updateCanvases = this.updateCanvases.bind( this );

      model.sceneProperty.lazyLink( updateCanvases );

      this.addChild( radioButtonGroup );
      model.scenes.forEach( scene => scene.link( updateCanvases ) );
      model.onProperty.lazyLink( updateCanvases );
      model.numberOfLinesProperty.lazyLink( updateCanvases );
      model.angleProperty.lazyLink( updateCanvases );
      this.rectangleSceneControlPanel = new Panel( new VBox( {
        spacing: BOX_SPACING,
        children: [
          new NumberControl( 'columnRadius', model.rectangleScene.columnRadiusProperty, model.rectangleScene.columnRadiusProperty.range, _.extend( {
            // delta: 2 // avoid odd/even artifacts
          }, NUMBER_CONTROL_OPTIONS ) ),
          new NumberControl( 'rowRadius', model.rectangleScene.rowRadiusProperty, model.rectangleScene.rowRadiusProperty.range, _.extend( {
            // delta: 2 // avoid odd/even artifacts
          }, NUMBER_CONTROL_OPTIONS ) ) ]
      } ), _.extend( {
        leftTop: this.apertureCanvas.leftBottom.plusXY( 0, 5 )
      }, PANEL_OPTIONS ) );
      this.addChild( this.rectangleSceneControlPanel );

      this.gaussianControlPanel = new Panel( new VBox( {
        spacing: BOX_SPACING,
        children: [
          new NumberControl( 'Diameter', model.ellipseScene.diameterProperty, model.ellipseScene.diameterProperty.range, NUMBER_CONTROL_OPTIONS ),
          new NumberControl( 'Eccentricity', model.ellipseScene.eccentricityProperty, model.ellipseScene.eccentricityProperty.range, _.extend( {
            delta: 0.01
          }, NUMBER_CONTROL_OPTIONS ) )
        ]
      } ), _.extend( {
        leftTop: this.apertureCanvas.leftBottom.plusXY( 0, 5 )
      }, PANEL_OPTIONS ) );
      this.addChild( this.gaussianControlPanel );

      this.slitsControlPanel = new Panel( new VBox( {
        spacing: BOX_SPACING,
        children: [
          new NumberControl( 'number lines', model.numberOfLinesProperty, model.numberOfLinesProperty.range, NUMBER_CONTROL_OPTIONS ),
          new NumberControl( 'angle', model.angleProperty, model.angleProperty.range, _.extend( {
            delta: 0.01
          }, NUMBER_CONTROL_OPTIONS ) )
        ]
      } ), _.extend( {
        leftTop: this.apertureCanvas.leftBottom.plusXY( 0, 5 )
      }, PANEL_OPTIONS ) );
      this.addChild( this.slitsControlPanel );


      // TODO: Use togglenode?
      model.sceneProperty.link( scene => {
        this.rectangleSceneControlPanel.visible = scene === model.rectangleScene;
        this.gaussianControlPanel.visible = scene === model.ellipseScene;
        this.slitsControlPanel.visible = scene === DiffractionModel.ApertureType.SLITS;
      } );

      const beamWidth = 40;
      const incidentBeam = new Rectangle(
        laserPointerNode.right, laserPointerNode.centerY - beamWidth / 2,
        this.miniApertureCanvas.centerX - laserPointerNode.right, beamWidth, {
          fill: 'gray',
          opacity: 0.7
        } );

      // support for larger canvas for generating rasters
      const transmittedBeam = new Rectangle(
        this.miniApertureCanvas.centerX,
        laserPointerNode.centerY - beamWidth / 2,
        Math.max( this.miniDiffractionCanvas.centerX - this.miniApertureCanvas.centerX, 0 ),
        beamWidth, {
          fill: 'gray',
          opacity: 0.7
        } );

      model.onProperty.linkAttribute( incidentBeam, 'visible' );
      model.onProperty.linkAttribute( transmittedBeam, 'visible' );

      this.addChild( transmittedBeam );
      this.addChild( this.miniApertureCanvas );
      this.addChild( incidentBeam );
      this.addChild( this.miniDiffractionCanvas );
      this.addChild( laserPointerNode );

      updateCanvases();
    }

    updateCanvases() {
      this.apertureCanvas.invalidatePaint();
      this.miniApertureCanvas.invalidatePaint();
      this.diffractionCanvas.invalidatePaint();
      this.miniDiffractionCanvas.invalidatePaint();
    }
  }

  return waveInterference.register( 'DiffractionScreenView', DiffractionScreenView );
} );