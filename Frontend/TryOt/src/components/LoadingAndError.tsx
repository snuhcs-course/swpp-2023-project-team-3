import React from 'react';
import {Alert} from 'react-native';

type LoadingAndErrorProps = {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  loadingComponent: JSX.Element;
  children: JSX.Element;
};

export function LoadingAndError({
  isLoading,
  isError,
  errorMessage,
  loadingComponent,
  children,
}: LoadingAndErrorProps) {
  if (isError) {
    Alert.alert(errorMessage);
    return loadingComponent;
  }
  if (isLoading) {
    return loadingComponent;
  } else {
    return children;
  }
}
