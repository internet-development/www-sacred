'use client';

import styles from '@components/Chessboard.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

const FILE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const RANK = [8, 7, 6, 5, 4, 3, 2, 1];

const getPieceSymbol = (piece: string) => {
  const mapping: Record<string, string> = {
    K: '♔',
    Q: '♕',
    R: '♖',
    B: '♗',
    N: '♘',
    P: '♙',
    k: '♚',
    q: '♛',
    r: '♜',
    b: '♝',
    n: '♞',
    p: '♟',
  };
  return mapping[piece] || '';
};

interface ChessboardProps {
  board: string[][];
}

const Chessboard: React.FC<ChessboardProps> = ({ board }) => {
  return (
    <table className={styles.board}>
      <tbody>
        <tr>
          <td className={styles.corner}></td>
          {FILE.map((file) => (
            <td key={file} className={styles.cell}>
              {file}
            </td>
          ))}
        </tr>
        {RANK.map((rank, rowIndex) => (
          <tr key={rank}>
            <td className={styles.cell}>{rank}</td>
            {FILE.map((_, colIndex) => {
              const isDark = (rowIndex + colIndex) % 2 === 0;
              const squareClass = isDark ? styles.dark : styles.light;
              return (
                <td key={colIndex} className={Utilities.classNames(styles.square, squareClass)}>
                  <span className={styles.symbol}>{getPieceSymbol(board[rowIndex][colIndex])}</span>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Chessboard;
