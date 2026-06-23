import { Redirect } from 'expo-router';
import { useTrackrStore } from '../src/store/trackrStore';

export default function Index() {
  const user = useTrackrStore(state => state.user);

  if (user && user.name) {
    return <Redirect href={'/(tabs)/dashboard' as any} />;
  }

  return <Redirect href={'/onboarding' as any} />;
}
