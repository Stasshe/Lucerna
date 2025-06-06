# 高校物理教育用シミュレーションサイト開発プロンプト

詳細な開発要項を作成しました。このプロンプトは、NextJS/TypeScriptベースの高校物理シミュレーションサイト開発のためのAI向け説明書として活用できます。

## プロジェクト概要

高校物理の授業で活用できる対話型シミュレーションサイトを開発します。力学、熱力学、波動、電磁場・原子の4つの主要単元をカバーし、各単元内で複数のトピックとシミュレーションを提供します。

## 技術スタック

- フレームワーク: NextJS (App Router)
- 言語: TypeScript
- レンダリング: React + WebGL (Three.js/react-three-fiber)
- 状態管理: React Context/Redux Toolkit
- UI: Tailwind CSS + shadcn/ui
- 物理エンジン: matter.js (2D物理エンジン)もしくはrapier.js

## 機能要件

1. **ナビゲーション構造**
   - 単元 > トピック > シミュレーションの階層構造
   - サイドバーでの簡単なナビゲーション
   - シミュレーション履歴と良く使うものをブックマーク可能

2. **シミュレーション共通機能**
   - 再生/一時停止/リセットコントロール
   - 速度調整（0.25x, 0.5x, 1x, 2x, 4x）
   - パラメータ調整用スライダー/入力フィールド
   - グラフ表示機能（時間経過/変数関係）
   - データ値のリアルタイム表示
   - スクリーンショット/録画機能

3. **教師用ツール**
   - シミュレーション設定の保存/共有機能
   - 授業プラン統合機能
   - 生徒の理解度確認クイズ作成機能

4. **レスポンシブデザイン**
   - PC/タブレット/スマートフォン対応

## 単元別シミュレーション要件

### 1. 力学

#### 1.1 運動学
- **等速直線運動・等加速度運動**
  - 位置-時間、速度-時間、加速度-時間グラフの同時表示
  - 初速度、加速度の調整
  
- **投射運動**
  - 発射角度、初速度、重力の調整
  - 放物線軌道と最高点、到達距離の表示

#### 1.2 力学的エネルギー
- **斜面上の物体運動**
  - 斜面の角度、摩擦係数、質量の調整
  - 位置エネルギー、運動エネルギー、全エネルギーのリアルタイム表示

- **バネ振動**
  - バネ定数、質量、初期変位の調整
  - バネの自然な伸縮表現（コイル間隔の変化）
  - エネルギー変換の可視化

#### 1.3 円運動と単振動
- **単振り子**
  - 振り子の長さ、質量、初期角度の調整
  - 周期と振動数の計測
  
- **円運動**
  - 角速度、半径の調整
  - 向心力、遠心力の表示

### 2. 熱力学

#### 2.1 気体分子運動
- **気体分子運動シミュレーション**
  - 温度、圧力、体積の調整
  - 分子の平均運動エネルギー表示
  - マクスウェル-ボルツマン分布の可視化

#### 2.2 熱力学過程
- **等温・等圧・等積・断熱過程**
  - P-V図、P-T図、V-T図の表示
  - 各過程での熱の出入りの可視化
  - 熱効率の計算

#### 2.3 熱伝導・対流・放射
- **熱伝導シミュレーション**
  - 異なる物質の熱伝導率比較
  - 温度分布の時間変化

### 3. 波動

#### 3.1 波の基本
- **横波・縦波シミュレーション**
  - 振幅、波長、周波数の調整
  - 波の伝播速度の視覚化

- **重ね合わせの原理**
  - 複数の波源からの波の干渉パターン
  - 定在波の形成

#### 3.2 音波
- **ドップラー効果**
  - 音源/観測者の速度調整
  - 周波数変化の視覚化と音声出力
  
- **楽器の振動と倍音**
  - 弦、管の振動モード表示
  - 基本振動と倍音の可視化

#### 3.3 光波
- **反射・屈折・回折・干渉**
  - レンズ、プリズムによる光の進路変化
  - ヤングの干渉実験シミュレーション
  - 回折格子による光のスペクトル表示

### 4. 電磁場・原子

#### 4.1 静電場
- **点電荷の電場・電位**
  - 複数の点電荷配置と電場線表示
  - 等電位線の描画
  - 電場中の荷電粒子の運動

#### 4.2 電流と磁場
- **電流による磁場**
  - 直線電流、円形電流、ソレノイドの磁場
  - 磁力線の3D表示
  
- **電磁誘導**
  - コイルと磁石の相対運動
  - 誘導起電力のグラフ表示

#### 4.3 原子物理
- **ボーア模型**
  - 電子のエネルギー準位遷移
  - スペクトル線の表示
  
- **光電効果**
  - 光の波長と光電子のエネルギー関係
  - 仕事関数の影響

## 技術的実装ポイント

### データ管理戦略
1. **シミュレーションステート管理**
   ```typescript
   // 各シミュレーションの状態インターフェース
   interface SimulationState {
     id: string;
     unitId: string;
     topicId: string;
     name: string;
     parameters: Record<string, SimParameter>;
     timeStep: number;
     isRunning: boolean;
     currentTime: number;
     // シミュレーション固有のデータ
     simulationData: any;
   }

   interface SimParameter {
     name: string;
     value: number;
     min: number;
     max: number;
     step: number;
     unit: string;
     label: string;
   }
   ```

2. **シミュレーションファクトリー**
   - 各シミュレーションタイプに応じたファクトリー関数
   - パラメータ更新時の適切な状態管理

### レンダリング最適化
1. **WebGLレンダリング**
   - Three.jsを使った効率的な描画
   - react-three-fiberによるReactとの統合

2. **パフォーマンス考慮事項**
   - requestAnimationFrameの適切な使用
   - 物理計算とレンダリングの分離
   - WebWorkerでの物理計算（複雑なシミュレーション用）

### UI/UXデザイン
1. **直感的なコントロール**
   - スライダーのリアルタイム反映
   - オブジェクト・オブジェクトの名前ラベル　の表示・非表示切り替え

2. **教育的フィードバック**
   - 物理法則の数式表示と実際のシミュレーション結果の関連付け
   - 「何が起きているか」の説明パネル

## プロジェクト構成例

```
src/
├── app/
│   ├── [unit]/
│   │   ├── [topic]/
│   │   │   └── [simulation]/
│   │   │       └── page.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Slider.tsx
│   │   └── ...
│   ├── simulation/
│   │   ├── controls/
│   │   │   ├── PlaybackControls.tsx
│   │   │   ├── ParameterSlider.tsx
│   │   │   └── ...
│   │   ├── visualizations/
│   │   │   ├── Graph.tsx
│   │   │   ├── VectorField.tsx
│   │   │   └── ...
│   │   └── SimulationCanvas.tsx
│   └── layout/
│       ├── Navbar.tsx
│       ├── Sidebar.tsx
│       └── ...
├── lib/
│   ├── simulations/
│   │   ├── mechanics/
│   │   ├── thermodynamics/
│   │   ├── waves/
│   │   └── electromagnetism/
│   ├── physics/
│   │   ├── constants.ts
│   │   ├── formulas.ts
│   │   └── utils.ts
│   └── hooks/
│       ├── useSimulation.ts
│       ├── usePhysicsEngine.ts
│       └── ...
└── types/
    └── index.ts
```
