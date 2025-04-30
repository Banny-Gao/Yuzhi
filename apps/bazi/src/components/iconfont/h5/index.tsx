/* tslint:disable */
/* eslint-disable */

import React, { SVGAttributes, FunctionComponent } from 'react';
import IconShezhi from './IconShezhi';
import IconRecord from './IconRecord';
import IconBagua from './IconBagua';
import IconWode from './IconWode';
export { default as IconShezhi } from './IconShezhi';
export { default as IconRecord } from './IconRecord';
export { default as IconBagua } from './IconBagua';
export { default as IconWode } from './IconWode';

export type IconNames = 'icon-shezhi' | 'icon-record' | 'icon-bagua' | 'icon-wode';

interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

const IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
    case 'icon-shezhi':
      return <IconShezhi {...rest} />;
    case 'icon-record':
      return <IconRecord {...rest} />;
    case 'icon-bagua':
      return <IconBagua {...rest} />;
    case 'icon-wode':
      return <IconWode {...rest} />;

  }

  return null;
};

export default IconFont;
