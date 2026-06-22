import Constants, { ExecutionEnvironment } from 'expo-constants';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (isExpoGo) {
    console.log('Notifications are not supported in Expo Go.');
    return false;
  }
  try {
    const Notifications = require('expo-notifications');
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (e) {
    console.warn(e);
    return false;
  }
};

export const scheduleReminder = async (time: string, enabled: boolean) => {
  if (isExpoGo) return;
  
  try {
    const Notifications = require('expo-notifications');
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!enabled) return;

    const [hours, minutes] = time.split(':').map(Number);
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'P23TRACK 🔥',
        body: "Don't break your streak! Log today's progress.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      } as any,
    });
  } catch (e) {
    console.warn('Failed to schedule notification:', e);
  }
};
