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
  const DiffractionNumberControl = require( 'WAVE_INTERFERENCE/diffraction/view/DiffractionNumberControl' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  const LengthScaleIndicatorNode = require( 'WAVE_INTERFERENCE/common/view/LengthScaleIndicatorNode' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const MatrixCanvasNode = require( 'WAVE_INTERFERENCE/diffraction/view/MatrixCanvasNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );

  // images
  const wavingGirl256Image = require( 'image!WAVE_INTERFERENCE/waving_girl_256.png' );

  // strings
  const widthString = require( 'string!WAVE_INTERFERENCE/width' );
  const heightString = require( 'string!WAVE_INTERFERENCE/height' );
  const rotationString = require( 'string!WAVE_INTERFERENCE/rotation' );
  const diameterString = require( 'string!WAVE_INTERFERENCE/diameter' );
  const eccentricityString = require( 'string!WAVE_INTERFERENCE/eccentricity' );
  const nmValueString = require( 'string!WAVE_INTERFERENCE/nmValue' );
  const wavelengthString = require( 'string!WAVE_INTERFERENCE/wavelength' );
  const circleDiameterString = require( 'string!WAVE_INTERFERENCE/circleDiameter' );
  const latticeSpacingString = require( 'string!WAVE_INTERFERENCE/latticeSpacing' );
  const diamondDiameterString = require( 'string!WAVE_INTERFERENCE/diamondDiameter' );
  const disorderString = require( 'string!WAVE_INTERFERENCE/disorder' );

  // constants
  const ICON_SCALE = 0.2;
  const BOX_SPACING = 40;
  const BOTTOM_MARGIN = 10;

  const PANEL_OPTIONS = {
    xMargin: 10,
    yMargin: 10,
    cornerRadius: 5,
    fill: '#e2e3e5'
  };

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
        bottom: this.layoutBounds.maxY - BOTTOM_MARGIN
      } );
      this.addChild( resetAllButton );

      const GRID_ICON_SPACING = 2.4;
      const circle = () => new Circle( 1.65, { fill: 'black' } );
      const row = () => new HBox( { spacing: GRID_ICON_SPACING, children: _.times( 4, circle ) } );

      const sceneRadioButtonContent = [ {
        value: model.ellipseScene,
        node: new Circle( 10, { fill: 'black' } )
      }, {
        value: model.rectangleScene,
        node: new Rectangle( 0, 0, 20, 20, { fill: 'black' } )
      }, {
        value: model.circleDiamondScene,
        node: new Node( {
          children: [
            new Circle( 5, { fill: 'black' } ),
            new Rectangle( 0, 0, 10, 10, { fill: 'black', rotation: Math.PI / 4, x: 10, y: 8 } )
          ]
        } )
      }, {
        value: model.disorderScene,
        node: new VBox( { spacing: GRID_ICON_SPACING, children: _.times( 4, row ) } )
      }, {
        value: model.wavingGirlScene,
        node: new Image( wavingGirl256Image, { maxHeight: 25 } )
      }
      ];

      const MATRIX_CANVAS_NODE_SCALE = 1.4;
      this.apertureNode = new MatrixCanvasNode( model.apertureMatrix, { scale: MATRIX_CANVAS_NODE_SCALE } );
      this.apertureNode.top = 120;
      this.addChild( this.apertureNode );

      this.diffractionNode = new MatrixCanvasNode( model.diffractionMatrix, { scale: MATRIX_CANVAS_NODE_SCALE } );
      this.diffractionNode.right = this.layoutBounds.right - 20;
      this.diffractionNode.top = this.apertureNode.top;
      model.wavelengthProperty.link( wavelength => this.diffractionNode.setBaseColor( VisibleColor.wavelengthToColor( wavelength ) ) );
      this.addChild( this.diffractionNode );

      this.apertureNode.right = this.diffractionNode.left - 50;

      // 1/10 of the way across the aperture is 1000nm.  Full aperture is 10,000nm
      const lengthScaleIndicatorNode = new LengthScaleIndicatorNode( this.apertureNode.width / 10, StringUtils.fillIn( nmValueString, { value: 1000 } ), {
        leftBottom: this.apertureNode.leftTop.plusXY( 0, -5 )
      } );
      this.addChild( lengthScaleIndicatorNode );

      const sceneRadioButtonGroup = new RadioButtonGroup( model.sceneProperty, sceneRadioButtonContent, {
        right: this.apertureNode.left - 20,
        bottom: this.apertureNode.bottom,

        baseColor: 'white',
        selectedStroke: '#419ac9',
        selectedLineWidth: 2
      } );

      this.miniApertureNode = new MatrixCanvasNode( model.apertureMatrix, {
        scale: ICON_SCALE,
        centerY: laserPointerNode.centerY,
        centerX: this.apertureNode.centerX,
        matrix: Matrix3.affine( 1, 0, 0, 0.25, 1, 0 )
      } );

      this.miniDiffractionNode = new MatrixCanvasNode( model.diffractionMatrix, {
        scale: ICON_SCALE,
        centerY: laserPointerNode.centerY,
        centerX: this.diffractionNode.centerX,
        matrix: Matrix3.affine( 1, 0, 0, 0.25, 1, 0 )
      } );
      model.wavelengthProperty.link( wavelength => this.miniDiffractionNode.setBaseColor( VisibleColor.wavelengthToColor( wavelength ) ) );

      const updateCanvases = this.updateCanvases.bind( this );

      model.sceneProperty.lazyLink( updateCanvases );

      this.addChild( sceneRadioButtonGroup );
      model.scenes.forEach( scene => scene.link( updateCanvases ) );
      model.onProperty.lazyLink( updateCanvases );

      this.ellipseSceneControlPanel = new Panel( new HBox( {
        spacing: BOX_SPACING,
        children: [
          new DiffractionNumberControl( diameterString,
            model.ellipseScene.diameterProperty.range.min,
            model.ellipseScene.diameterProperty.range.max, model.ellipseScene.diameterProperty, {
              numberDisplayOptions: {
                valuePattern: nmValueString
              }
            } ),
          new DiffractionNumberControl( eccentricityString,
            model.ellipseScene.eccentricityProperty.range.min,
            model.ellipseScene.eccentricityProperty.range.max, model.ellipseScene.eccentricityProperty, {
              delta: 0.01,
              numberDisplayOptions: {
                decimalPlaces: 2
              }
            } )
        ]
      } ), PANEL_OPTIONS );

      this.rectangleSceneControlPanel = new Panel( new HBox( {
        spacing: BOX_SPACING,
        children: [
          new DiffractionNumberControl( widthString,
            model.rectangleScene.widthProperty.range.min,
            model.rectangleScene.widthProperty.range.max,
            model.rectangleScene.widthProperty, {
              numberDisplayOptions: {
                valuePattern: nmValueString
              }
            } ),
          new DiffractionNumberControl( heightString,
            model.rectangleScene.heightProperty.range.min,
            model.rectangleScene.heightProperty.range.max,
            model.rectangleScene.heightProperty, {
              numberDisplayOptions: {
                valuePattern: nmValueString
              }
            } ) ]
      } ), PANEL_OPTIONS );

      this.circleDiamondSceneControlPanel = new Panel( new HBox( {
          spacing: BOX_SPACING,
          children: [
            new DiffractionNumberControl( circleDiameterString,
              model.circleDiamondScene.circleDiameterProperty.range.min,
              model.circleDiamondScene.circleDiameterProperty.range.max,
              model.circleDiamondScene.circleDiameterProperty, {
                numberDisplayOptions: {
                  valuePattern: nmValueString
                }
              } ),

            // TODO (design): Should this be "square diameter"
            new DiffractionNumberControl( diamondDiameterString,
              model.circleDiamondScene.diamondDiameterProperty.range.min,
              model.circleDiamondScene.diamondDiameterProperty.range.max,
              model.circleDiamondScene.diamondDiameterProperty, {
                delta: 0.01,
                numberDisplayOptions: {
                  valuePattern: nmValueString
                }
              } )
          ]
        } ),
        PANEL_OPTIONS
      );

      // TODO: Separate files for control panels
      this.disorderSceneControlPanel = new Panel( new HBox( {
        spacing: BOX_SPACING,
        children: [
          new DiffractionNumberControl( circleDiameterString,
            model.disorderScene.diameterProperty.range.min,
            model.disorderScene.diameterProperty.range.max,
            model.disorderScene.diameterProperty ),
          new DiffractionNumberControl( latticeSpacingString,
            model.disorderScene.latticeSpacingProperty.range.min,
            model.disorderScene.latticeSpacingProperty.range.max,
            model.disorderScene.latticeSpacingProperty, {
              delta: 0.01
            } ),
          new DiffractionNumberControl( disorderString,
            model.disorderScene.disorderProperty.range.min,
            model.disorderScene.disorderProperty.range.max,
            model.disorderScene.disorderProperty, {
              delta: 1,
              sliderOptions: {
                majorTicks: [ {
                  value: model.disorderScene.disorderProperty.range.min,
                  label: new WaveInterferenceText( 'None' )
                }, {
                  value: model.disorderScene.disorderProperty.range.max,
                  label: new WaveInterferenceText( 'Lots' )
                } ]
              }
            } )
        ]
      } ), PANEL_OPTIONS );

      this.wavingGirlSceneControlPanel = new Panel( new HBox( {
        spacing: BOX_SPACING,
        children: [
          new DiffractionNumberControl( heightString,
            model.wavingGirlScene.heightProperty.range.min,
            model.wavingGirlScene.heightProperty.range.max,
            model.wavingGirlScene.heightProperty ),
          new DiffractionNumberControl( rotationString,
            model.wavingGirlScene.rotationProperty.range.min,
            model.wavingGirlScene.rotationProperty.range.max,
            model.wavingGirlScene.rotationProperty, {
              delta: 0.01,
              sliderOptions: {
                majorTicks: [ {
                  value: model.wavingGirlScene.rotationProperty.range.min,
                  label: new WaveInterferenceText( model.wavingGirlScene.rotationProperty.range.min )
                }, {
                  value: model.wavingGirlScene.rotationProperty.range.max,
                  label: new WaveInterferenceText( '360˚' )
                } ]
              }
            } )
        ]
      } ), PANEL_OPTIONS );
      // TODO: separate file

      const controlPanelToggleNode = new ToggleNode( model.sceneProperty, [
        { value: model.rectangleScene, node: this.rectangleSceneControlPanel },
        { value: model.ellipseScene, node: this.ellipseSceneControlPanel },
        { value: model.wavingGirlScene, node: this.wavingGirlSceneControlPanel },
        { value: model.disorderScene, node: this.disorderSceneControlPanel },
        { value: model.circleDiamondScene, node: this.circleDiamondSceneControlPanel }
      ], {
        alignChildren: ToggleNode.CENTER_BOTTOM,
        centerX: this.apertureNode.centerX,
        bottom: this.layoutBounds.bottom - BOTTOM_MARGIN
      } );
      this.addChild( controlPanelToggleNode );

      const beamWidth = 40;
      const incidentBeam = new Rectangle(
        laserPointerNode.right, laserPointerNode.centerY - beamWidth / 2,
        this.miniApertureNode.centerX - laserPointerNode.right, beamWidth, {
          opacity: 0.7
        } );

      model.wavelengthProperty.link( wavelength => incidentBeam.setFill( VisibleColor.wavelengthToColor( wavelength ) ) );

      // support for larger canvas for generating rasters
      const transmittedBeam = new Rectangle(
        this.miniApertureNode.centerX,
        laserPointerNode.centerY - beamWidth / 2,
        Math.max( this.miniDiffractionNode.centerX - this.miniApertureNode.centerX, 0 ),
        beamWidth, {
          opacity: 0.7
        } );
      model.wavelengthProperty.link( wavelength => transmittedBeam.setFill( VisibleColor.wavelengthToColor( wavelength ) ) );

      model.onProperty.linkAttribute( incidentBeam, 'visible' );
      model.onProperty.linkAttribute( transmittedBeam, 'visible' );

      const wavelengthSlider = new Panel( new VBox( {
        children: [
          new WaveInterferenceText( wavelengthString ),
          new WavelengthSlider( model.wavelengthProperty, {
            trackWidth: 100,
            trackHeight: 30,

            // thumb
            thumbWidth: 25,
            thumbHeight: 25,

            valueFont: WaveInterferenceConstants.DEFAULT_FONT
          } )
        ]
      } ), _.extend( {
        left: 5,
        top: laserPointerNode.bottom + 10
      }, PANEL_OPTIONS ) );

      this.addChild( transmittedBeam );
      this.addChild( this.miniApertureNode );
      this.addChild( incidentBeam );
      this.addChild( this.miniDiffractionNode );
      this.addChild( laserPointerNode );
      this.addChild( wavelengthSlider );

      updateCanvases();
    }

    updateCanvases() {
      this.apertureNode.invalidatePaint();
      this.miniApertureNode.invalidatePaint();
      this.diffractionNode.invalidatePaint();
      this.miniDiffractionNode.invalidatePaint();
    }
  }

  return waveInterference.register( 'DiffractionScreenView', DiffractionScreenView );
} );