import {RenderProp} from '@ui-kitten/components/devsupport';
import React from 'react';
import {ImageProps} from 'react-native';
/**
 * Header
 */

export interface HeaderType {
  hideBack: boolean;
  navigation: any;
  title?: string;
  style?: any;
  accessoryRight?: (props?: any) => React.ReactNode;
}
