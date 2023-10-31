import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Dimensions, LayoutChangeEvent, Button} from 'react-native';
import RefinedQuery from "./RefinedQuery";
import SlidingUpPanel from "rn-sliding-up-panel";
import BlackBasicButton from "./BlackBasicButton";
import {searchItems} from "../api/searchItemsApi";
import {fetchFashionItemDetails} from "../api/itemDetailApi";
import BasicTextInput from "./BasicTextInput";

interface QueryRefineModalProps {
    targetIndex: number[],
    setTargetIndex: (targetIndex: number[]) => void,
    onLayout: (event: LayoutChangeEvent) => void;
    bottomSheetModalRef: any;
    refinedQueries: string[]; // Original + refined queries (length of 6)
    onSearch: () => void;
    onClose?: () => void;
   setGPTUsable: (gpt_usable: number) => void;
}

function QueryRefineModal({onSearch, targetIndex, setTargetIndex, onLayout, bottomSheetModalRef, refinedQueries, setGPTUsable}: QueryRefineModalProps) {
    const handleToggleSwitch = (index: number) => {
        const updatedTargetIndex = [...targetIndex];
        updatedTargetIndex[index+1] = updatedTargetIndex[index+1] === 1 ? 0 : 1;
        setTargetIndex(updatedTargetIndex);
        console.log(updatedTargetIndex);
    };

    const handleSearch = () => {
        onSearch();
        bottomSheetModalRef.current?.hide();
    }

    return (
        <SlidingUpPanel ref={bottomSheetModalRef}>
            <View style={styles.slidingPanel} onLayout={onLayout}>
                <Pressable
                    style={[
                        styles.grayBar,
                        {width: 50, marginVertical: 10, borderRadius: 10},
                    ]}
                    onPress={() => {
                        bottomSheetModalRef.current?.hide();
                    }}
                />
                <View style={{alignSelf: 'flex-start', paddingLeft: '5%'}}>
                    <Text
                        style={[
                            styles.slidingPanelText,
                            {fontSize: 20, marginVertical: '5%'},
                        ]}>
                        Query Refinement
                    </Text>
                    <Text style={[styles.slidingPanelText, {fontSize: 18}]}>
                        Original Query
                    </Text>
                    <Button title={"Turn on GPT"} onPress={() => {
                        setGPTUsable(1);
                    }}
                    />
                    <Text
                        style={[
                            styles.slidingPanelText,
                            {fontSize: 15, fontWeight: 'normal'},
                        ]}>
                        {refinedQueries[0]}
                    </Text>
                    <Text
                        style={[
                            styles.slidingPanelText,
                            {fontSize: 18, marginTop: '5%'},
                        ]}>
                        GPT Refined Query
                    </Text>
                    {refinedQueries.slice(1).map((query, index) => (
                        <RefinedQuery key={index} query={query} handleToggleSwitch={handleToggleSwitch} index={index} />
                    ))}
                </View>
                <BlackBasicButton buttonText={"Regenerate Search"} isButtonActive={true} title={"Regenerate Search"} onClick={handleSearch}/>
            </View>
        </SlidingUpPanel>
    );
}

const styles = StyleSheet.create({
    grayBar: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.01,
        backgroundColor: '#eee',
    },
    slidingPanel: {
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '10%',
    },
    slidingPanelText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 20,
        zIndex: 1.
    },
    searchButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default QueryRefineModal;
