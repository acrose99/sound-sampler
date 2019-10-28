import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";

import Animated, { Easing } from "react-native-reanimated";
import { bInterpolate, useTransition } from "react-native-redash";

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  KEYBOARD_HEIGHT
} from "../../constants/Sizes";

/*
	Props to provide:
	@boolean isVisisble: If the modal should be visible or not
	@func onDismiss: The function the modal should call when isVisible becomes false
	@ui children: The UI elements to place inside of the modal
*/

const Modal = props => {
  const { isVisible, dismiss, children } = props;
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);

  const [keyboardDidShowListener, setKeyboardDidShowListener] = useState(null);
  const [keyboardDidHideListener, setKeyboardDidHideListener] = useState(null);

  const [isAnimating, setIsAnimating] = useState(false);

  const keyboardTransition = useTransition(
    isKeyboardShown,
    isKeyboardShown ? 0 : 1,
    isKeyboardShown ? 1 : 0,
    150,
    Easing.inOut(Easing.linear)
  );
  const marginBottom = bInterpolate(keyboardTransition, KEYBOARD_HEIGHT, 0);
  const modalTransitionStyle = {
    marginBottom
  };

  const visibleTransition = useTransition(
    isVisible,
    isVisible ? 0 : 1,
    isVisible ? 1 : 0,
    150,
    Easing.inOut(Easing.ease)
  );
  const opacity = bInterpolate(visibleTransition, 0.25, 0);
  const backgroundTransitionStyle = {
    opacity
  };

  const bottom = bInterpolate(visibleTransition, 0, -300);
  const bottomTransitionStyle = {
    bottom
  };

  const onKeyboardShow = () => {
    // keyboardHeight = e.endCoordinates.height;
    setIsKeyboardShown(true);
  };
  const onKeyboardHide = () => {
    setIsKeyboardShown(false);
  };

  const onBackgroundTap = () => {
    if (!isKeyboardShown) dismiss(null);
    else Keyboard.dismiss();
  };

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      setKeyboardDidShowListener(
        Keyboard.addListener("keyboardWillShow", onKeyboardShow)
      );
      setKeyboardDidHideListener(
        Keyboard.addListener("keyboardWillHide", onKeyboardHide)
      );
      // alert('Keyboard listeners created.');
    }
    if (!isVisible && keyboardDidShowListener && keyboardDidHideListener) {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      // alert('Keyboard listeners removed.');
      setTimeout(() => {
        setIsAnimating(false);
        setIsKeyboardShown(false);
      }, 150);
    }
  }, [isVisible]);

  if (isAnimating || isVisible) {
    return (
      <TouchableWithoutFeedback onPress={onBackgroundTap}>
        <View style={styles.fullScreen}>
          <Animated.View
            style={[styles.background, backgroundTransitionStyle]}
          />
          <Animated.View
            style={[
              styles.container,
              modalTransitionStyle,
              bottomTransitionStyle
            ]}
          >
            {children}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  return <></>;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
    paddingTop: 30,
    width: SCREEN_WIDTH,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,

    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    shadowOpacity: 0.26,
    elevation: 5
  },

  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },

  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "black",
    opacity: 0.25
  },

  inputTitle: {
    fontSize: 24,
    color: "gray",
    marginBottom: 20
    // alignSelf: 'flex-start',
    // marginLeft: 10
  },

  input: {
    width: SCREEN_WIDTH / 1.5,
    height: 40,
    borderColor: "gray",
    borderBottomWidth: 3,
    borderRadius: 10,
    color: "#333",
    fontSize: 20,
    textAlign: "center"
  }
});

export default Modal;