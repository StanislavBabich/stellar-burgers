import { FC } from 'react';

type TFormattedDateEnProps = {
  date: Date;
  className?: string;
};

const pad = (value: number) => String(value).padStart(2, '0');

const getTime = (date: Date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

const getDiffDays = (date: Date) =>
  Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

export const FormattedDateEn: FC<TFormattedDateEnProps> = ({
  date,
  className
}) => {
  const diffDays = getDiffDays(date);
  let text: string;

  if (diffDays === 0) {
    text = `Today, ${getTime(date)}`;
  } else if (diffDays === 1) {
    text = `Yesterday, ${getTime(date)}`;
  } else {
    text = `${diffDays} days ago, ${getTime(date)}`;
  }

  return <span className={className}>{text}</span>;
};
