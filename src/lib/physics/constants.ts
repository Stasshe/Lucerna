/**
 * 物理シミュレーションで使用する基本定数
 */

// 基本的な物理定数
export const CONSTANTS = {
  // 重力加速度 (m/s^2)
  GRAVITY: 9.81,
  
  // 光速 (m/s)
  SPEED_OF_LIGHT: 299792458,
  
  // プランク定数 (J·s)
  PLANCK_CONSTANT: 6.62607015e-34,
  
  // ボルツマン定数 (J/K)
  BOLTZMANN_CONSTANT: 1.380649e-23,
  
  // アボガドロ数 (/mol)
  AVOGADRO_NUMBER: 6.02214076e23,
  
  // 真空の誘電率 (F/m)
  VACUUM_PERMITTIVITY: 8.8541878128e-12,
  
  // 真空の透磁率 (H/m)
  VACUUM_PERMEABILITY: 1.25663706212e-6,
  
  // 電子の電荷 (C)
  ELEMENTARY_CHARGE: 1.602176634e-19,
  
  // 電子の質量 (kg)
  ELECTRON_MASS: 9.1093837015e-31,
  
  // 陽子の質量 (kg)
  PROTON_MASS: 1.67262192369e-27,
};

// 単位変換
export const UNIT_CONVERSION = {
  // 度からラジアンへの変換
  DEG_TO_RAD: Math.PI / 180,
  
  // ラジアンから度への変換
  RAD_TO_DEG: 180 / Math.PI,
};