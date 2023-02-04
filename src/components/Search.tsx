import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';

import {Input, Button, Icon} from '@ui-kitten/components';

interface SearchProps {
  onToggle: (arg0: boolean) => void;
  onChangeText?: (arg0: string) => void;
}

const SEARCH_HEIGHT = 40;

const SearchIcon = props => <Icon {...props} name="search-outline" />;
const CloseIcon = props => <Icon {...props} name="close-outline" />;

const Search: React.FC<SearchProps> = ({onToggle, onChangeText}) => {
  const {width} = useWindowDimensions();
  const inputRef = React.useRef<Input>(null);
  const [isInputShown, showinput] = React.useState(false);

  const toggleSearchInput = () => {
    showinput(prev => !prev);
  };

  React.useEffect(() => {
    onToggle(isInputShown);

    if (!isInputShown) {
      inputRef.current?.clear();
    }
  }, [isInputShown]);

  return (
    <View style={styles.search}>
      {isInputShown && (
        <Input
          ref={inputRef}
          style={[styles.input, {width: width / 1.5}]}
          placeholder="Search.."
          onChangeText={onChangeText}
          autoFocus
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
  );
};

export default Search;

const styles = StyleSheet.create({
  search: {
    width: 50,
    height: SEARCH_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  input: {
    width: 200,
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
