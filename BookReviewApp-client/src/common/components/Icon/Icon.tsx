import React from 'react';
import './Icon.scss';

type Props = {
  href: string;
  target?: string;
  className: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

export const Icon: React.FC<Props> = React.memo(
  ({
    href,
    target = '_self',
    className,
    children = <></>,
    onClick = () => {},
  }) => {
    return (
      <a
        href={href}
        target={target}
        className={`icon ${className}`}
        aria-label={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  },
);
