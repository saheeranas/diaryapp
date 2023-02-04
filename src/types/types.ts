/**
 * Header
 */

export interface HeaderType {
  hideBack: boolean;
  navigation: any;
  title?: string;
  style?: any;
  accessoryRight?: () => JSX.Element;
}
