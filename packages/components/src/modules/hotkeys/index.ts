// NOTE(jimmylee)
// Vendored from
// https://github.com/JohannesKlauss/react-hotkeys-hook/blob/main/src/index.ts

import { useHotkeys } from "@srcl/ui/hooks";
import type {
  Options,
  Keys,
  HotkeyCallback,
} from "@srcl/ui/modules/hotkeys/types";
import {
  HotkeysProvider,
  useHotkeysContext,
} from "@srcl/ui/modules/hotkeys/hotkeys-provider";
import { isHotkeyPressed } from "@srcl/ui/modules/hotkeys/is-hotkey-pressed";
import useRecordHotkeys from "@srcl/ui/modules/hotkeys/use-record-hotkeys";

export {
  useHotkeys,
  useRecordHotkeys,
  useHotkeysContext,
  isHotkeyPressed,
  HotkeysProvider,
  Options,
  Keys,
  HotkeyCallback,
};
