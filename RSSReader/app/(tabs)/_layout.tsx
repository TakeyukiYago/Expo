import { Tabs } from "expo-router";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: { display: "none" }, // タブバーを非表示に
			}}
		>
			<Tabs.Screen name="index" />
		</Tabs>
	);
}
