import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Input, Button, Icon} from '@ui-kitten/components';

interface SearchProps {
  onToggle: (arg0: boolean) => void;
  onChangeText?: (arg0: string) => void;
}

const SEARCH_HEIGHT = 40;

const SearchIcon = props => <Icon {...props} name="search-outline" />;
const CloseIcon = props => <Icon {...props} name="close-outline" />;

const Search: React.FC<SearchProps> = ({onToggle, onChangeText}) => {
  const [isInputShown, showinput] = React.useState(true);

  const toggleSearchInput = () => {
    showinput(prev => !prev);
  };

  React.useEffect(() => {
    onToggle(isInputShown);
  }, [isInputShown]);

  return (
    <View style={styles.demo}>
      <View style={styles.search}>
        {isInputShown && (
          <Input
            style={styles.input}
            placeholder="Search.."
            onChangeText={onChangeText}
          />
        )}
        <Button
          style={styles.button}
          appearance="ghost"
          status="basic"
          accessoryLeft={isInputShown ? CloseIcon : SearchIcon}
          onPress={toggleSearchInput}
        />
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  demo: {
    width: '100%',
    // backgroundColor: 'cyan',
    alignItems: 'flex-end',
  },
  search: {
    // paddingHorizontal: 16,
    // paddingVertical: 10,
    // backgroundColor: 'red',
    width: 50,
    height: SEARCH_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  input: {
    width: 250,
    height: SEARCH_HEIGHT,
    marginBottom: 0,
    position: 'absolute',
    right: 60,
    zIndex: 0,
    elevation: 0,
  },
  button: {
    height: SEARCH_HEIGHT - 24,
  },
});
