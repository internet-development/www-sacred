// NOTE(jimmylee)
// Vendored from
// https://github.com/JohannesKlauss/react-hotkeys-hook/blob/main/src/index.ts

import useHotkeysDefault from '@modules/hotkeys/use-hotkeys'
import type { Options, Keys, HotkeyCallback } from '@modules/hotkeys/types'
import { HotkeysProvider, useHotkeysContext } from '@modules/hotkeys/hotkeys-provider'
import { isHotkeyPressed } from '@modules/hotkeys/is-hotkey-pressed'
import useRecordHotkeysDefault from '@modules/hotkeys/use-record-hotkeys'

export {
  useHotkeysDefault as useHotkeys,
  useRecordHotkeysDefault as useRecordHotkeys,
  useHotkeysContext,
  isHotkeyPressed,
  HotkeysProvider,
  Options,
  Keys,
  HotkeyCallback,
}
