import React from 'react';
import {View, Text, StyleSheet, Pressable, Dimensions} from 'react-native';
import RefinedQuery from "./RefinedQuery";
import SlidingUpPanel from "rn-sliding-up-panel";
import BlackBasicButton from "./BlackBasicButton";

interface QueryRefineModalProps {
    onLayout: () => void;
    bottomSheetModalRef: any;
    refinedQueries: string[]; // Original + refined queries (length of 6)
    onSearch?: (targetIndex: string[]) => void;
    onClose?: () => void;
}

function QueryRefineModal({onLayout, bottomSheetModalRef, refinedQueries}: QueryRefineModalProps) {
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
                        <RefinedQuery key={index} query={query} />
                    ))}
                </View>
                <BlackBasicButton buttonText={"Regenerate Search"} isButtonActive={true} title={"Regenerate Search"} />
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
