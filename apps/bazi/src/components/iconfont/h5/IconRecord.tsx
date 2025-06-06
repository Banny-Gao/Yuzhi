/* tslint:disable */
/* eslint-disable */

import React, { CSSProperties, SVGAttributes, FunctionComponent } from 'react';
import { getIconColor } from './helper';

interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  size?: number;
  color?: string | string[];
}

const DEFAULT_STYLE: CSSProperties = {
  display: 'block',
};

const IconRecord: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'rem'} height={size + 'rem'} style={style} {...rest}>
      <path
        d="M96 128v768c0 70.7 57.3 128 128 128h576c70.7 0 128-57.3 128-128V128C928 57.3 870.7 0 800 0H224C153.3 0 96 57.3 96 128z m704 832H224c-35.3 0-64-28.7-64-64V352.8c0-5.9 6.1-9.7 11.4-7.2 60.5 28.6 131.5 49.7 209.2 61.1 3.3 0.5 5.9 3 6.7 6.2 13.1 56.8 64 99.2 124.7 99.2s111.7-42.4 124.7-99.2c0.7-3.3 3.4-5.7 6.7-6.2 77.7-11.3 148.7-32.5 209.2-61.1 5.3-2.5 11.4 1.4 11.4 7.2V896c0 35.3-28.7 64-64 64zM448 384c0-12.4 3.5-23.9 9.6-33.7 11.3-18.2 31.5-30.3 54.4-30.3s43.1 12.1 54.4 30.3c6.1 9.8 9.6 21.3 9.6 33.7 0 11-2.8 21.3-7.7 30.3-10.8 20-32 33.7-56.3 33.7s-45.5-13.7-56.3-33.7c-4.9-9-7.7-19.3-7.7-30.3z m416-126c0 5.8-3.1 11.1-8.1 13.9-42.8 24-92.4 43.1-147.6 56.8-22.3 5.5-45.1 10.1-68.4 13.7-3.7 0.6-7.3-1.5-8.6-5-18.6-47.7-65-81.5-119.3-81.5s-100.7 33.8-119.3 81.5c-1.4 3.5-4.9 5.5-8.6 5-23.3-3.6-46.1-8.1-68.4-13.7-55.2-13.7-104.8-32.8-147.6-56.8-5-2.8-8.1-8.2-8.1-13.9V128c0-35.3 28.7-64 64-64h576c35.3 0 64 28.7 64 64v130z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M256 580v56c0 2.2 1.8 4 4 4h440c2.2 0 4-1.8 4-4v-56c0-2.2-1.8-4-4-4H260c-2.2 0-4 1.8-4 4zM256 708v56c0 2.2 1.8 4 4 4h280c2.2 0 4-1.8 4-4v-56c0-2.2-1.8-4-4-4H260c-2.2 0-4 1.8-4 4zM256 836v56c0 2.2 1.8 4 4 4h280c2.2 0 4-1.8 4-4v-56c0-2.2-1.8-4-4-4H260c-2.2 0-4 1.8-4 4z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </svg>
  );
};

IconRecord.defaultProps = {
  size: 20,
};

export default IconRecord;
