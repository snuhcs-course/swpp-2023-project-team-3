import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RefinedQuery from './RefinedQuery';
import BlackBasicButton from './BlackBasicButton';
import {Modal, Portal} from 'react-native-paper';
import {fontSize, vw} from '../constants/design';

interface QueryRefineModalProps {
  refineModalVisible: boolean;
  hideRefineModal: () => void;
  targetIndex: boolean[];
  setTargetIndex: (targetIndex: boolean[]) => void;
  refinedQueries: string[]; // Original + refined queries (length of 6)
  onSearch: () => void;
}

function QueryRefineModal({
  refineModalVisible,
  hideRefineModal,
  onSearch,
  targetIndex,
  setTargetIndex,
  refinedQueries,
}: QueryRefineModalProps) {
  const handleToggleSwitch = (index: number) => {
    const updatedTargetIndex = [...targetIndex];
    updatedTargetIndex[index + 1] = !updatedTargetIndex[index + 1];
    setTargetIndex(updatedTargetIndex);
  };

  const handleSearch = () => {
    onSearch();
    hideRefineModal();
  };

  return (
    <Portal>
      <Modal
        visible={refineModalVisible}
        onDismiss={hideRefineModal}
        contentContainerStyle={styles.modalContainerStyle}>
        <View style={styles.inputContainerStyle}>
          <Text style={styles.headerText}>Query Refinement</Text>
          <Text style={styles.middleHeaderText}>Original Query</Text>
          <Text
            style={[
              styles.middleHeaderText,
              {fontSize: fontSize.small, fontWeight: 'normal'},
            ]}>
            {refinedQueries[0]}
          </Text>
          <Text style={styles.middleHeaderText}>GPT Refined Query</Text>
          <View style={styles.refinedQueriesContainer}>
            {refinedQueries.slice(1).map((query, index) => (
              <RefinedQuery
                key={index}
                query={query}
                isSwitchOn={targetIndex[index + 1]}
                handleToggleSwitch={handleToggleSwitch}
                gptIndex={index}
              />
            ))}
          </View>
          <BlackBasicButton
            buttonText={'Regenerate Search'}
            isButtonActive={true}
            title={'Regenerate Search'}
            onClick={handleSearch}
          />
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    width: 90 * vw,
    alignSelf: 'center',
    padding: 4 * vw,
  },

  inputContainerStyle: {
    backgroundColor: 'white',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    width: '100%',
  },

  refinedQueriesContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingBottom: '5%',
  },
  headerText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: fontSize.large,
    marginBottom: 5 * vw,
  },
  middleHeaderText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: fontSize.middle,
    marginBottom: 2 * vw,
  },
});

export default QueryRefineModal;
