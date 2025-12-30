import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {

  if (Platform.OS === "web") {
    console.log("Push notifications not supported on web");
    return;
  }

  if (!Device.isDevice) {
    alert("Must use a physical device for Push Notifications");
    return;
  }

  // Ask permission
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') {
    alert('Permission not given');
    return;
  }

  // Get token
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("PUSH TOKEN:", token);

  // Android setup
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}
