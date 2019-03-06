import * as React from 'react';
export interface IStackBarProps {
  title: React.ReactNode;
  color?: string;
  hasLegend?: boolean;
  padding?: [number, number, number, number];
  height: number;
  data: Array<{
    group: string,
    x: string;
    y: number;
  }>;
  autoLabel?: boolean;
  style?: React.CSSProperties;
}

export default class Bar extends React.Component<IStackBarProps, any> {}
