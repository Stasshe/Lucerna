/**
 * 物理シミュレーションで使用する各種計算式
 */
import { CONSTANTS, UNIT_CONVERSION } from './constants';

// 力学関連の計算式
export const mechanics = {
  /**
   * 等加速度運動における位置の計算
   * @param x0 初期位置 (m)
   * @param v0 初速度 (m/s)
   * @param a 加速度 (m/s^2)
   * @param t 時間 (s)
   * @returns 位置 (m)
   */
  position: (x0: number, v0: number, a: number, t: number): number => {
    return x0 + v0 * t + 0.5 * a * t * t;
  },

  /**
   * 等加速度運動における速度の計算
   * @param v0 初速度 (m/s)
   * @param a 加速度 (m/s^2)
   * @param t 時間 (s)
   * @returns 速度 (m/s)
   */
  velocity: (v0: number, a: number, t: number): number => {
    return v0 + a * t;
  },

  /**
   * 運動エネルギーの計算
   * @param m 質量 (kg)
   * @param v 速度 (m/s)
   * @returns 運動エネルギー (J)
   */
  kineticEnergy: (m: number, v: number): number => {
    return 0.5 * m * v * v;
  },

  /**
   * 位置エネルギー（重力場）の計算
   * @param m 質量 (kg)
   * @param h 高さ (m)
   * @param g 重力加速度 (m/s^2)（省略時はデフォルト値を使用）
   * @returns 位置エネルギー (J)
   */
  potentialEnergy: (m: number, h: number, g: number = CONSTANTS.GRAVITY): number => {
    return m * g * h;
  },

  /**
   * バネの弾性エネルギーの計算
   * @param k バネ定数 (N/m)
   * @param x 変位 (m)
   * @returns 弾性エネルギー (J)
   */
  springEnergy: (k: number, x: number): number => {
    return 0.5 * k * x * x;
  },

  /**
   * 単振動の角振動数の計算
   * @param k バネ定数 (N/m)
   * @param m 質量 (kg)
   * @returns 角振動数 (rad/s)
   */
  angularFrequency: (k: number, m: number): number => {
    return Math.sqrt(k / m);
  },

  /**
   * 単振り子の周期の計算
   * @param l 振り子の長さ (m)
   * @param g 重力加速度 (m/s^2)（省略時はデフォルト値を使用）
   * @returns 周期 (s)
   */
  pendulumPeriod: (l: number, g: number = CONSTANTS.GRAVITY): number => {
    return 2 * Math.PI * Math.sqrt(l / g);
  },
};

// 熱力学関連の計算式
export const thermodynamics = {
  /**
   * 理想気体の状態方程式
   * @param p 圧力 (Pa)
   * @param V 体積 (m^3)
   * @param n 物質量 (mol)
   * @param T 温度 (K)
   * @param R 気体定数 (J/(mol·K))（省略時はデフォルト値を使用）
   * @returns 計算された変数（呼び出し方に応じて異なる）
   */
  idealGasLaw: (p: number | null, V: number | null, n: number | null, T: number | null, R: number = 8.314): number => {
    if (p === null && V !== null && n !== null && T !== null) {
      return n * R * T / V; // 圧力を計算
    } else if (V === null && p !== null && n !== null && T !== null) {
      return n * R * T / p; // 体積を計算
    } else if (n === null && p !== null && V !== null && T !== null) {
      return p * V / (R * T); // 物質量を計算
    } else if (T === null && p !== null && V !== null && n !== null) {
      return p * V / (n * R); // 温度を計算
    }
    throw new Error('理想気体の状態方程式の計算に必要なパラメータが不足しています');
  },

  /**
   * ボルツマン分布の計算
   * @param E エネルギー (J)
   * @param T 温度 (K)
   * @param k ボルツマン定数 (J/K)（省略時はデフォルト値を使用）
   * @returns 確率密度
   */
  boltzmannDistribution: (E: number, T: number, k: number = CONSTANTS.BOLTZMANN_CONSTANT): number => {
    return Math.exp(-E / (k * T));
  },

  /**
   * 熱量の計算
   * @param m 質量 (kg)
   * @param c 比熱容量 (J/(kg·K))
   * @param deltaT 温度変化 (K)
   * @returns 熱量 (J)
   */
  heatEnergy: (m: number, c: number, deltaT: number): number => {
    return m * c * deltaT;
  },
};

// 波動関連の計算式
export const waves = {
  /**
   * 波の速度の計算
   * @param f 周波数 (Hz)
   * @param lambda 波長 (m)
   * @returns 波の速度 (m/s)
   */
  waveSpeed: (f: number, lambda: number): number => {
    return f * lambda;
  },

  /**
   * 弦の振動の基本周波数の計算
   * @param L 弦の長さ (m)
   * @param T 張力 (N)
   * @param mu 線密度 (kg/m)
   * @returns 基本周波数 (Hz)
   */
  stringFundamentalFrequency: (L: number, T: number, mu: number): number => {
    return (1 / (2 * L)) * Math.sqrt(T / mu);
  },

  /**
   * ドップラー効果（音源が動いている場合）の計算
   * @param f0 発信周波数 (Hz)
   * @param vs 音源の速度 (m/s)（観測者に向かう場合は正）
   * @param v 音速 (m/s)
   * @returns 観測周波数 (Hz)
   */
  dopplerEffect: (f0: number, vs: number, v: number): number => {
    return f0 * (v / (v - vs));
  },
};

// 電磁気学関連の計算式
export const electromagnetism = {
  /**
   * クーロンの法則による電荷間の力の計算
   * @param q1 電荷1 (C)
   * @param q2 電荷2 (C)
   * @param r 距離 (m)
   * @param k クーロン定数 (N·m^2/C^2)（省略時はデフォルト値を使用）
   * @returns 力 (N)（引力なら負、斥力なら正）
   */
  coulombForce: (q1: number, q2: number, r: number, k: number = 8.9875517923e9): number => {
    return k * q1 * q2 / (r * r);
  },

  /**
   * 電場の計算（点電荷による）
   * @param q 電荷 (C)
   * @param r 距離 (m)
   * @param k クーロン定数 (N·m^2/C^2)（省略時はデフォルト値を使用）
   * @returns 電場の強さ (N/C)
   */
  electricField: (q: number, r: number, k: number = 8.9875517923e9): number => {
    return k * q / (r * r);
  },

  /**
   * 電位の計算（点電荷による）
   * @param q 電荷 (C)
   * @param r 距離 (m)
   * @param k クーロン定数 (N·m^2/C^2)（省略時はデフォルト値を使用）
   * @returns 電位 (V)
   */
  electricPotential: (q: number, r: number, k: number = 8.9875517923e9): number => {
    return k * q / r;
  },

  /**
   * 磁場中の荷電粒子に働くローレンツ力の大きさの計算
   * @param q 電荷 (C)
   * @param v 速度 (m/s)
   * @param B 磁束密度 (T)
   * @param theta 速度と磁場のなす角 (rad)
   * @returns 力の大きさ (N)
   */
  lorentzForce: (q: number, v: number, B: number, theta: number): number => {
    return Math.abs(q) * v * B * Math.sin(theta);
  },

  /**
   * 電磁波のエネルギーの計算
   * @param h プランク定数 (J·s)（省略時はデフォルト値を使用）
   * @param f 周波数 (Hz)
   * @returns 光子1個のエネルギー (J)
   */
  photonEnergy: (f: number, h: number = CONSTANTS.PLANCK_CONSTANT): number => {
    return h * f;
  },
};

// 量子物理学関連の計算式
export const quantum = {
  /**
   * ド・ブロイ波長の計算
   * @param p 運動量 (kg·m/s)
   * @param h プランク定数 (J·s)（省略時はデフォルト値を使用）
   * @returns 波長 (m)
   */
  deBroglieWavelength: (p: number, h: number = CONSTANTS.PLANCK_CONSTANT): number => {
    return h / p;
  },

  /**
   * 光電効果のアインシュタイン方程式
   * @param h プランク定数 (J·s)（省略時はデフォルト値を使用）
   * @param f 光の周波数 (Hz)
   * @param w 仕事関数 (J)
   * @returns 光電子の最大運動エネルギー (J)
   */
  photoelectricEffect: (f: number, w: number, h: number = CONSTANTS.PLANCK_CONSTANT): number => {
    const energy = h * f - w;
    return energy > 0 ? energy : 0;
  },
};