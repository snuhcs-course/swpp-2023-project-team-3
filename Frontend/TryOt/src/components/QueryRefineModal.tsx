import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Dimensions, LayoutChangeEvent, Button, TouchableOpacity} from 'react-native';
import RefinedQuery from "./RefinedQuery";
import SlidingUpPanel from "rn-sliding-up-panel";
import BlackBasicButton from "./BlackBasicButton";
import {searchItems} from "../api/searchItemsApi";
import {fetchFashionItemDetails} from "../api/itemDetailApi";
import BasicTextInput from "./BasicTextInput";
import userSlice from "../slices/user";
import {useSelector} from "react-redux";
import {RootState} from "../store/reducer";
import {Modal, Portal} from "react-native-paper";
import {fontSize, vw} from "../constants/design";

interface QueryRefineModalProps {
    refineModalVisible: boolean;
    hideRefineModal: () => void;
    targetIndex: number[],
    setTargetIndex: (targetIndex: number[]) => void,
    refinedQueries: string[]; // Original + refined queries (length of 6)
    onSearch: () => void;
}

function QueryRefineModal({refineModalVisible, hideRefineModal, onSearch, targetIndex, setTargetIndex, refinedQueries}: QueryRefineModalProps) {
    const {gptUsable} = useSelector((state: RootState) => state.user);

    const handleToggleSwitch = (index: number) => {
        const updatedTargetIndex = [...targetIndex];
        updatedTargetIndex[index+1] = updatedTargetIndex[index+1] === 1 ? 0 : 1;
        setTargetIndex(updatedTargetIndex);
    };

    const handleSearch = () => {
        onSearch();
        hideRefineModal();
    }

    return (
        <Portal>
            <Modal visible={refineModalVisible} onDismiss={hideRefineModal} contentContainerStyle={styles.modalContainerStyle}>
                <View style={styles.inputContainerStyle}>
                    <Text style={styles.headerText}>Query Refinement</Text>
                    <Text style={styles.middleHeaderText}>Original Query</Text>
                    <Text style={[styles.middleHeaderText, {fontSize: fontSize.small, fontWeight: 'normal'}]}>{refinedQueries[0]}</Text>
                    <Text style={styles.middleHeaderText}>GPT Refined Query</Text>
                    <View style={styles.refinedQueriesContainer}>
                        {refinedQueries.slice(1).map((query, index) => (
                            <RefinedQuery key={index} query={query} handleToggleSwitch={handleToggleSwitch} index={index} />
                        ))}
                    </View>
                    <BlackBasicButton buttonText={"Regenerate Search"} isButtonActive={true} title={"Regenerate Search"} onClick={handleSearch}/>
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
        width: 90* vw,
        alignSelf: 'center',
        padding: 4*vw,
    },

    inputContainerStyle: {
        backgroundColor: 'white',
        flexDirection: 'column',
        alignSelf: "flex-start",
        width: '100%'
    },

    refinedQueriesContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        paddingBottom: "5%"
    },
    headerText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: fontSize.large,
        marginBottom: 5*vw,
    },
    middleHeaderText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: fontSize.middle,
        marginBottom: 2 * vw,
    },
});

export default QueryRefineModal;
