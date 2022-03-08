import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, Icon, Divider} from '@ui-kitten/components';

interface SettingsItemProps {
  label: string;
  onPress?: () => void;
  icon?: string;
}

export const SettingsMenuItem: React.FC<SettingsItemProps> = ({
  label = '',
  onPress,
  icon,
  children,
}) => {
  const [toggle, setToggle] = React.useState(false);

  let rightIcon = children ? 'chevron-right-outline' : icon ? icon : null;

  const onPressHandler = () => {
    if (children) {
      setToggle(prev => !prev);
    } else {
      onPress?.();
    }
  };

  return (
    <>
      <TouchableOpacity onPress={onPressHandler}>
        <View style={styles.menuItem}>
          <Text>{label}</Text>
          {rightIcon && (
            <Icon style={styles.icon} fill="#8F9BB3" name={rightIcon} />
          )}
        </View>
        <Divider />
      </TouchableOpacity>
      {children && toggle && <View style={styles.childrenWrp}>{children}</View>}
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: 'cyan',
  },
  menuItem: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
  },
  icon: {
    width: 24,
    height: 24,
  },
  childrenWrp: {
    paddingLeft: 10,
  },
});
