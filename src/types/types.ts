import React from 'react';
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
