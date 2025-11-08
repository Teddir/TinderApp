import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppProviders from './providers/AppProviders';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import MatchesScreen from './screens/MatchesScreen';
import colors from './theme/colors';
import NavigationBar from './components/organisms/NavigationBar';
import spacing from './theme/spacing';

const App: React.FC = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'matches'>('home');

  useEffect(() => {
    const timeout = setTimeout(() => setSplashVisible(false), 1200);
    return () => clearTimeout(timeout);
  }, []);

  const renderContent = () =>
    activeTab === 'matches' ? <MatchesScreen /> : <HomeScreen />;

  return (
    <AppProviders>
      <StatusBar barStyle="light-content" />
      <View style={styles.root}>
        {isSplashVisible ? (
          <SplashScreen />
        ) : (
          <>
            <SafeAreaView edges={['top']} style={styles.contentWrapper}>
              <View style={styles.content}>{renderContent()}</View>
            </SafeAreaView>
            <SafeAreaView edges={['bottom']} style={styles.navigationWrapper}>
              <NavigationBar activeTab={activeTab} onChange={setActiveTab} />
            </SafeAreaView>
          </>
        )}
      </View>
    </AppProviders>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentWrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  navigationWrapper: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});

export default App;

