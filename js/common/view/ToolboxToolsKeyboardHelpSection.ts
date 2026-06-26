// Copyright 2026, University of Colorado Boulder

/**
 * ToolboxToolsKeyboardHelpSection is the keyboard-help section that describes how to remove the measuring tape,
 * stopwatch and wave meter from the toolbox and return them to it.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import ToolboxPanel from './ToolboxPanel.js';

export default class ToolboxToolsKeyboardHelpSection extends KeyboardHelpSection {

  public constructor() {

    const rows = [
      KeyboardHelpSectionRow.fromHotkeyData( ToolboxPanel.REMOVE_FROM_TOOLBOX_HOTKEY_DATA ),
      KeyboardHelpSectionRow.fromHotkeyData( ToolboxPanel.RETURN_TO_TOOLBOX_HOTKEY_DATA )
    ];

    super( WaveInterferenceStrings.keyboardHelpDialog.toolControlsStringProperty, rows, {
      isDisposable: false
    } );
  }
}
