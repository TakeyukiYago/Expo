// React Nativeに必要なコンポーネントをインポート
import React, { useRef, useState } from "react";
import {
	Animated,
	SafeAreaView, // ステータスバーやノッチ領域を避けるためのセーフエリア
	StyleSheet, // スタイルシートを作成するためのユーティリティ
	Text, // テキスト表示用コンポーネント
	TouchableOpacity, // タッチ可能なボタンコンポーネント
	View, // レイアウト用のコンテナコンポーネント
	useColorScheme, // ダークモード/ライトモード検出用
} from "react-native";

// メインのカウンターアプリケーションコンポーネント
const CounterApp = () => {
	// カウントの状態を管理するstate（初期値は0）
	const [count, setCount] = useState(0);

	// 現在のカラースキーム（ダークモード/ライトモード）を取得
	const colorScheme = useColorScheme();
	const isDarkMode = colorScheme === "dark";

	// ボタンを押した時のグローエフェクトのアニメーション値
	const glowAnimation = useRef(new Animated.Value(0)).current;

	// ボタンを押した時のグローエフェクト関数
	const triggerGlowEffect = () => {
		// グローエフェクトを開始
		Animated.sequence([
			// 薄黄色に光らせる（500ms）
			Animated.timing(glowAnimation, {
				toValue: 1,
				duration: 200,
				useNativeDriver: false, // background colorの変更のためfalse
			}),
			// 元の状態に戻す（300ms）
			Animated.timing(glowAnimation, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false,
			}),
		]).start();
	};

	// アニメーション値に基づいて背景色を計算（ダークモード対応）
	const animatedBackgroundColor = glowAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [
			"rgba(255, 255, 255, 0)", // 透明
			isDarkMode
				? "rgba(255, 255, 0, 0.7)" // ダークモード: より強い黄色エフェクト
				: "rgba(255, 255, 100, 0.5)", // ライトモード: 薄い黄色エフェクト
		],
	});

	return (
		<SafeAreaView
			style={[
				styles.container,
				{ backgroundColor: isDarkMode ? "#000000" : "#ffffff" },
			]}
		>
			{/* 右上に配置されたリセットボタン */}
			<TouchableOpacity
				style={styles.resetButton}
				onPress={() => setCount(0)} // タップでカウントを0にリセット
			>
				<Text style={styles.resetButtonText}>リセット</Text>
			</TouchableOpacity>

			{/* メインコンテンツエリア */}
			<View style={styles.content}>
				{/* ボタンとグローエフェクトのコンテナ */}
				<View style={styles.buttonContainer}>
					{/* グローエフェクト用のアニメーション背景（ボタン周囲のみ） */}
					<Animated.View
						style={[
							styles.glowBackground,
							{ backgroundColor: animatedBackgroundColor },
						]}
					/>

					{/* ボタンと白いコンテナを縦に並べるコンテナ */}
					<View style={styles.verticalContainer}>
						{/* カウントアップボタン（上半分の半円、赤色） */}
						<TouchableOpacity
							style={styles.button}
							onPress={() => {
								// カウントアップ処理
								setCount((currentCount) =>
									// カウントが20未満なら+1、20以上なら20で固定
									currentCount < 20 ? currentCount + 1 : 20
								);
								// グローエフェクトを発動
								triggerGlowEffect();
							}}
						></TouchableOpacity>

						{/* 白いコンテナ（ボタンの真下に配置） */}
						<View
							style={[
								styles.whiteContainer,
								{
									backgroundColor: "white",
								},
							]}
						></View>
					</View>
				</View>
			</View>

			{/* カウント数とへぇ～を表示 */}
			<Text
				style={{
					marginTop: 20,
					fontSize: 24,
					color: isDarkMode ? "#cccccc" : "gray",
				}}
			>
				{count}へぇ～
			</Text>

			{/* 完了メッセージエリア（高さを固定してレイアウトのズレを防ぐ） */}
			<View style={styles.messageArea}>
				{count === 20 && (
					<Text style={styles.congratsText}>
						満へぇ～いただきました
					</Text>
				)}
			</View>
		</SafeAreaView>
	);
};

// スタイルシート定義
const styles = StyleSheet.create({
	// アプリ全体のコンテナスタイル
	container: {
		flex: 1, // 画面全体を占有
		justifyContent: "center", // 垂直方向に中央寄せ
		alignItems: "center", // 水平方向に中央寄せ
		// 背景色は動的に設定（ダークモード対応）
	},
	// メインコンテンツエリアのスタイル
	content: {
		alignItems: "center", // 子要素を水平方向に中央寄せ
	},
	// ボタンとグローエフェクトのコンテナスタイル
	buttonContainer: {
		position: "relative", // 子要素の絶対位置の基準点
		width: 250, // ボタン(150px) + 周囲50px × 2
		height: 250, // ボタン(150px) + 周囲50px × 2
		justifyContent: "center",
		alignItems: "center",
	},
	// ボタンと白いコンテナを縦に並べるコンテナ
	verticalContainer: {
		alignItems: "center",
		justifyContent: "flex-start",
		zIndex: 10, // グローエフェクトより前面に
	},
	// 白いコンテナスタイル
	whiteContainer: {
		width: 170, // ボタンwidth(150px)より少し大きく
		height: 120, // コンテナの高さ
		borderRadius: 10,
		marginTop: -5, // ボタンとの間隔を調整（重複を軽減）
		// 影を追加してコンテナを際立たせる
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	// グローエフェクト用の背景スタイル（ボタン周囲のみ）
	glowBackground: {
		position: "absolute", // ボタンコンテナ内での絶対位置
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		borderRadius: 125, // 円形エフェクト（250px/2）
		pointerEvents: "none", // タッチイベントを通すため
	},
	// カウント表示テキストのスタイル
	countText: {
		fontSize: 48, // 大きなフォントサイズ
		fontWeight: "bold", // 太字
		marginBottom: 20, // 下に20pxの余白
	},
	// メインボタン（上半分の半円、赤色）のスタイル
	button: {
		backgroundColor: "red", // 赤色の背景
		width: 150, // 幅150px
		height: 75, // 高さ75px（半円の高さ）
		justifyContent: "center", // 垂直方向に中央寄せ
		alignItems: "center", // 水平方向に中央寄せ
		borderTopLeftRadius: 75, // 左上の角を75px丸める（半円）
		borderTopRightRadius: 75, // 右上の角を75px丸める（半円）
		borderBottomLeftRadius: 0, // 左下の角は丸めない
		borderBottomRightRadius: 0, // 右下の角は丸めない
		overflow: "hidden", // はみ出た部分をクリップ
	},
	// リセットボタンのスタイル
	resetButton: {
		position: "absolute", // 絶対位置配置
		top: 50, // 上から50pxの位置
		right: 20, // 右から20pxの位置
		backgroundColor: "#00ffff8e", // 半透明のシアン色
		width: 80, // 幅80px
		height: 40, // 高さ40px（長方形）
		justifyContent: "center", // 垂直方向に中央寄せ
		alignItems: "center", // 水平方向に中央寄せ
		borderRadius: 8, // 角を8px丸める
	},
	// メインボタンのテキストスタイル
	buttonText: {
		color: "white", // 白色のテキスト
		fontSize: 24, // フォントサイズ24px
		fontWeight: "bold", // 太字
		textAlign: "center", // 中央寄せ
	},
	// リセットボタンのテキストスタイル
	resetButtonText: {
		color: "white", // 白色のテキスト
		fontSize: 14, // フォントサイズ14px（メインより小さめ）
		fontWeight: "bold", // 太字
		textAlign: "center", // 中央寄せ
	},
	// 完了メッセージエリアのスタイル（高さを固定してレイアウトのズレを防ぐ）
	messageArea: {
		height: 80, // 固定の高さを確保
		width: "100%",
		justifyContent: "center", // 垂直方向に中央寄せ
		alignItems: "center", // 水平方向に中央寄せ
		marginTop: 15, // 上に15pxの余白
	},
	// 完了メッセージのスタイル
	congratsText: {
		fontSize: 20, // フォントサイズ20px
		fontWeight: "bold", // 太字
		color: "gold", // 金色のテキスト
		textAlign: "center", // 中央寄せ
	},
});

// コンポーネントをエクスポート（他のファイルから使用可能にする）
export default CounterApp;
