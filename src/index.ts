/**
 * SRCL library barrel: re-export commonly used components as named exports.
 * This allows consumers to do:
 *
 *   import { Button, Grid, Row, Text } from 'srcl';
 *
 * Subpath imports (e.g. 'srcl/components/Button') are also supported via package.json exports.
 */

/* Layout and structure */
export { default as Grid } from '../components/Grid';
export { default as Row } from '../components/Row';
export { default as RowEllipsis } from '../components/RowEllipsis';
export { default as RowSpaceBetween } from '../components/RowSpaceBetween';
export { default as ContentFluid } from '../components/ContentFluid';
export { default as SidebarLayout } from '../components/SidebarLayout';
export { default as Indent } from '../components/Indent';
export { default as Block } from '../components/Block';

/* Navigation and shell */
export { default as Navigation } from '../components/Navigation';
export { default as Providers } from '../components/Providers';
export { default as DefaultMetaTags } from '../components/DefaultMetaTags';
export { default as BreadCrumbs } from '../components/BreadCrumbs';

/* Core UI */
export { default as Button } from '../components/Button';
export { default as ButtonGroup } from '../components/ButtonGroup';
export { default as Card } from '../components/Card';
export { default as CardDouble } from '../components/CardDouble';
export { default as Text } from '../components/Text';
export { default as Divider } from '../components/Divider';
export { default as Avatar } from '../components/Avatar';
export { default as Badge } from '../components/Badge';
export { default as ListItem } from '../components/ListItem';
export { default as AlertBanner } from '../components/AlertBanner';
export { default as Message } from '../components/Message';
export { default as MessageViewer } from '../components/MessageViewer';

/* Inputs and forms */
export { default as Input } from '../components/Input';
export { default as TextArea } from '../components/TextArea';
export { default as Checkbox } from '../components/Checkbox';
export { default as Select } from '../components/Select';
export { default as ComboBox } from '../components/ComboBox';
export { default as RadioButton } from '../components/RadioButton';
export { default as RadioButtonGroup } from '../components/RadioButtonGroup';
export { default as NumberRangeSlider } from '../components/NumberRangeSlider';
export { default as DatePicker } from '../components/DatePicker';

/* Tables and data display */
export { default as Table } from '../components/Table';
export { default as TableRow } from '../components/TableRow';
export { default as TableColumn } from '../components/TableColumn';
export { default as DataTable } from '../components/DataTable';

/* Feedback and loaders */
export { default as BarLoader } from '../components/BarLoader';
export { default as BarProgress } from '../components/BarProgress';
export { default as BlockLoader } from '../components/BlockLoader';
export { default as MatrixLoader } from '../components/MatrixLoader';

/* Overlays and popovers */
export { default as Tooltip } from '../components/Tooltip';
export { default as Popover } from '../components/Popover';
export { default as Dialog } from '../components/Dialog';
export { default as Drawer } from '../components/Drawer';
export { default as ModalStack } from '../components/ModalStack';
export { default as ModalTrigger } from '../components/ModalTrigger';
export { default as DropdownMenu } from '../components/DropdownMenu';
export { default as DropdownMenuTrigger } from '../components/DropdownMenuTrigger';
export { default as HoverComponentTrigger } from '../components/HoverComponentTrigger';

/* Utilities and misc */
export { default as CodeBlock } from '../components/CodeBlock';
export { default as Accordion } from '../components/Accordion';
export { default as DebugGrid } from '../components/DebugGrid';
export { default as Dither } from '../components/dither';

/* Fun demos (optional for consumers) */
export { default as CanvasPlatformer } from '../components/CanvasPlatformer';
export { default as CanvasSnake } from '../components/CanvasSnake';
export { default as DOMSnake } from '../components/DOMSnake';
export { default as Chessboard } from '../components/Chessboard';
export { default as TreeView } from '../components/TreeView';
