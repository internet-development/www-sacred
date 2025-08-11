'use client';

import styles from '@components/TreeView.module.scss';

import * as React from 'react';

interface TreeViewProps {
  children?: React.ReactNode;
  defaultValue?: boolean;
  depth?: number;
  isFile?: boolean;
  isLastChild?: boolean;
  isRoot?: boolean;
  parentLines?: boolean[];
  style?: any;
  title: string;
}

const TreeView: React.FC<TreeViewProps> = ({ defaultValue = false, title, children, depth = 0, isFile = false, isRoot = false, isLastChild = false, style, parentLines = [] }) => {
  const [show, setShow] = React.useState<boolean>(defaultValue);

  const onToggleShow = (): void => {
    if (!isFile) setShow((prevShow) => !prevShow);
  };

  const hasChildren = React.Children.count(children) > 0;
  const isEmptyFolder = !isFile && !hasChildren;

  const spacing = parentLines.map((line) => (line ? '│ . ' : '. . ')).join('');
  const endPrefix = isLastChild ? '└───' : '├───';
  const prefix = `${spacing}${endPrefix}`;
  const icon = isFile ? ' ' : show ? '╦ ' : '╤ ';

  const updatedParentLines = [...parentLines, !isLastChild];

  return (
    <div className={styles.root} style={style}>
      <div tabIndex={0} role="button" onClick={onToggleShow} className={styles.item} aria-expanded={show}>
        {prefix}
        {icon}
        {title}
      </div>
      {show && hasChildren && (
        <div>
          {React.Children.map(children, (child, index) =>
            React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<TreeViewProps>, {
                  depth: depth + 1,
                  isLastChild: index === React.Children.count(children) - 1,
                  parentLines: updatedParentLines,
                })
              : child
          )}
        </div>
      )}
    </div>
  );
};

export default TreeView;
