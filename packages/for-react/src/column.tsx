import React from 'react';
import classNames from 'classnames';

export interface FooterColumnItem {
  title: React.ReactNode;
  url?: string;
  openExternal?: boolean;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  LinkComponent?: React.ReactType;
}

export interface FooterColumn {
  prefixCls?: string;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  items?: FooterColumnItem[];
  className?: string;
  style?: React.CSSProperties;
}

const Column: React.FC<FooterColumn> = ({
  prefixCls,
  items = [],
  style,
  className,
}) => (
  <div className={classNames(`${prefixCls}-column`, className)} style={style}>
    {items.map((item, i) => <span>sss</span>)}
  </div>
);

export default Column;
