import React from 'react';
import {View} from 'react-native';
import {
  Icon,
  TopNavigation,
  TopNavigationAction,
  Text,
} from '@ui-kitten/components';

import {HeaderType} from '../types/types';

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;
const Blank = () => <View />;

const Header: React.FC<HeaderType> = ({
  title = 'Diary',
  navigation,
  hideBack = false,
  style,
  accessoryRight,
}) => {
  // eslint-disable-next-line react/no-unstable-nested-components
  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
  );

  // eslint-disable-next-line react/no-unstable-nested-components
  const Title = () => <Text category="h6">{title}</Text>;

  return (
    <TopNavigation
      accessoryLeft={hideBack ? Blank : BackAction}
      // @ts-ignore
      accessoryRight={accessoryRight}
      title={Title}
      alignment="center"
      style={[style, { backgroundColor: "magenta", paddingTop: 0 }]}
    />
  );
  // return (
  //   <View style={[style, { backgroundColor: "cyan" }]}>
  //     <Text>Screen Title</Text>
  //   </View>
  // )
};

export default Header;
