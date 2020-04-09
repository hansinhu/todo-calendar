import React from 'react';
import classNames from 'classnames';
import { formateDate } from '@todo-calendar/core'

export interface FooterProps {
  prefixCls?: string;
  bottom?: React.ReactNode;
  maxColumnsPerRow?: number;
  theme?: 'dark' | 'light';
  className?: string;
  style?: React.CSSProperties;
  backgroundColor?: string;
  columnLayout?: 'space-around' | 'space-between';
}

const TodoCalenderReact: React.FC<FooterProps> = ({
  prefixCls = 'rc-footer',
  className,
  style,
  bottom,
  maxColumnsPerRow,
  backgroundColor,
  columnLayout,
  theme = 'light',
  ...restProps
}) => {
  const footerClassName = classNames(`${prefixCls}`, className, {
    [`${prefixCls}-${theme}`]: !!theme,
  });
  return (
    <footer
      {...restProps}
      className={footerClassName}
      style={{
        ...style,
        backgroundColor,
      }}
    >
      { formateDate('ddddddd') }
    </footer>
  );
};

export default TodoCalenderReact;
