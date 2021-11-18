import React from 'react';
import {Icon, TopNavigation, TopNavigationAction} from '@ui-kitten/components';

import {HeaderType} from '../types/types';

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

const Header: React.FC<HeaderType> = ({
  title = 'Diary',
  navigation,
  hideBack = false,
  style,
}) => {
  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
  );
  return (
    <TopNavigation
      accessoryLeft={hideBack ? null : BackAction}
      title={title}
      alignment="center"
      style={style}
    />
  );
};

export default Header;
