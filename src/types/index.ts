/**
 * シミュレーションの型定義
 */

// シミュレーションパラメータの型
export interface SimulationParameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  label: string;
}

// シミュレーションのデータ型（ジェネリック）
export interface SimulationData {
  [key: string]: unknown;
}

// Projectile Motionに特化したデータ型
export interface ProjectileMotionData extends SimulationData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trajectory: TrajectoryPoint[];
  maxHeight: number;
  range: number;
  flightTime: number;
  hasLanded: boolean;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  time: number;
  vx: number;
  vy: number;
}

// シミュレーション状態の型
export interface SimulationState {
  id: string;
  unitId: string;
  topicId: string;
  name: string;
  parameters: Record<string, SimulationParameter>;
  timeStep: number;
  isRunning: boolean;
  currentTime: number;
  speed: number;
  simulationData: SimulationData | ProjectileMotionData; // SimulationData または ProjectileMotionData
}

// シミュレーション単元の型
export type UnitType = 'mechanics' | 'thermodynamics' | 'waves' | 'electromagnetism';

// シミュレーションの詳細情報の型
export interface SimulationInfo {
  id: string;
  name: string;
  description: string;
  unitId: UnitType;
  topicId: string;
  path: string;
  thumbnailPath?: string;
}

// 物理単元の型
export interface PhysicsUnit {
  id: UnitType;
  name: string;
  description: string;
  topics: PhysicsTopic[];
}

// 物理トピックの型
export interface PhysicsTopic {
  id: string;
  name: string;
  description: string;
  simulations: SimulationInfo[];
}

// 物理単元のデータ構造
export const UNITS: PhysicsUnit[] = [
  {
    id: 'mechanics',
    name: '力学',
    description: '物体の運動と力の関係を扱う分野です。',
    topics: [
      {
        id: 'kinematics',
        name: '運動学',
        description: '物体の運動を、位置、速度、加速度で記述します。',
        simulations: [
          {
            id: 'uniform-motion',
            name: '等速直線運動・等加速度運動',
            description: '一定の速度または加速度で動く物体の運動を観察します。',
            unitId: 'mechanics',
            topicId: 'kinematics',
            path: '/mechanics/kinematics/uniform-motion',
          },
          {
            id: 'projectile-motion',
            name: '投射運動',
            description: '斜め方向に投げられた物体の放物線運動をシミュレーションします。',
            unitId: 'mechanics',
            topicId: 'kinematics',
            path: '/mechanics/kinematics/projectile-motion',
          }
        ]
      },
      {
        id: 'energy',
        name: '力学的エネルギー',
        description: '運動エネルギーと位置エネルギーの関係を学びます。',
        simulations: [
          {
            id: 'inclined-plane',
            name: '斜面上の物体運動',
            description: '斜面上を滑り落ちる物体のエネルギー変換を観察します。',
            unitId: 'mechanics',
            topicId: 'energy',
            path: '/mechanics/energy/inclined-plane',
          },
          {
            id: 'spring-oscillation',
            name: 'バネ振動',
            description: 'バネの伸縮による振動運動とエネルギー変換を観察します。',
            unitId: 'mechanics',
            topicId: 'energy',
            path: '/mechanics/energy/spring-oscillation',
          }
        ]
      },
      {
        id: 'circular-motion',
        name: '円運動と単振動',
        description: '円運動および単振動の性質を学びます。',
        simulations: [
          {
            id: 'pendulum',
            name: '単振り子',
            description: '重力による振り子の運動をシミュレーションします。',
            unitId: 'mechanics',
            topicId: 'circular-motion',
            path: '/mechanics/circular-motion/pendulum',
          },
          {
            id: 'circular-motion',
            name: '円運動',
            description: '等速円運動と向心力の関係を観察します。',
            unitId: 'mechanics',
            topicId: 'circular-motion',
            path: '/mechanics/circular-motion/circular-motion',
          }
        ]
      }
    ]
  },
  {
    id: 'thermodynamics',
    name: '熱力学',
    description: '熱と物質の関係、エネルギー変換の法則を扱う分野です。',
    topics: [
      {
        id: 'kinetic-theory',
        name: '気体分子運動',
        description: '気体分子の運動と熱力学の関係を学びます。',
        simulations: [
          {
            id: 'gas-molecules',
            name: '気体分子運動シミュレーション',
            description: '気体分子の運動をシミュレーションし、温度・圧力・体積の関係を観察します。',
            unitId: 'thermodynamics',
            topicId: 'kinetic-theory',
            path: '/thermodynamics/kinetic-theory/gas-molecules',
          }
        ]
      },
      {
        id: 'processes',
        name: '熱力学過程',
        description: '等温、等圧、等積、断熱などの熱力学過程を学びます。',
        simulations: [
          {
            id: 'thermodynamic-processes',
            name: '等温・等圧・等積・断熱過程',
            description: '様々な熱力学過程における気体の状態変化を観察します。',
            unitId: 'thermodynamics',
            topicId: 'processes',
            path: '/thermodynamics/processes/thermodynamic-processes',
          }
        ]
      },
      {
        id: 'heat-transfer',
        name: '熱伝導・対流・放射',
        description: '熱の伝わり方について学びます。',
        simulations: [
          {
            id: 'heat-conduction',
            name: '熱伝導シミュレーション',
            description: '異なる物質間の熱の伝わり方を観察します。',
            unitId: 'thermodynamics',
            topicId: 'heat-transfer',
            path: '/thermodynamics/heat-transfer/heat-conduction',
          }
        ]
      }
    ]
  },
  {
    id: 'waves',
    name: '波動',
    description: '波の性質と伝播について扱う分野です。',
    topics: [
      {
        id: 'wave-basics',
        name: '波の基本',
        description: '波の基本的な性質を学びます。',
        simulations: [
          {
            id: 'wave-types',
            name: '横波・縦波シミュレーション',
            description: '横波と縦波の違いを観察します。',
            unitId: 'waves',
            topicId: 'wave-basics',
            path: '/waves/wave-basics/wave-types',
          },
          {
            id: 'wave-superposition',
            name: '重ね合わせの原理',
            description: '複数の波の重ね合わせと干渉について観察します。',
            unitId: 'waves',
            topicId: 'wave-basics',
            path: '/waves/wave-basics/wave-superposition',
          }
        ]
      },
      {
        id: 'sound-waves',
        name: '音波',
        description: '音波の性質と現象について学びます。',
        simulations: [
          {
            id: 'doppler-effect',
            name: 'ドップラー効果',
            description: '音源または観測者が動くときの周波数変化を観察します。',
            unitId: 'waves',
            topicId: 'sound-waves',
            path: '/waves/sound-waves/doppler-effect',
          },
          {
            id: 'musical-instruments',
            name: '楽器の振動と倍音',
            description: '弦や管の振動モードと倍音の関係を観察します。',
            unitId: 'waves',
            topicId: 'sound-waves',
            path: '/waves/sound-waves/musical-instruments',
          }
        ]
      },
      {
        id: 'light-waves',
        name: '光波',
        description: '光の波動性に関する現象を学びます。',
        simulations: [
          {
            id: 'light-phenomena',
            name: '反射・屈折・回折・干渉',
            description: '光の様々な現象をシミュレーションします。',
            unitId: 'waves',
            topicId: 'light-waves',
            path: '/waves/light-waves/light-phenomena',
          }
        ]
      }
    ]
  },
  {
    id: 'electromagnetism',
    name: '電磁場・原子',
    description: '電気、磁気、原子物理学について扱う分野です。',
    topics: [
      {
        id: 'electrostatics',
        name: '静電場',
        description: '静止した電荷が作る電場について学びます。',
        simulations: [
          {
            id: 'point-charges',
            name: '点電荷の電場・電位',
            description: '点電荷が作る電場と電位を観察します。',
            unitId: 'electromagnetism',
            topicId: 'electrostatics',
            path: '/electromagnetism/electrostatics/point-charges',
          }
        ]
      },
      {
        id: 'magnetism',
        name: '電流と磁場',
        description: '電流と磁場の関係について学びます。',
        simulations: [
          {
            id: 'current-magnetic-field',
            name: '電流による磁場',
            description: '様々な形状の電流が作る磁場を観察します。',
            unitId: 'electromagnetism',
            topicId: 'magnetism',
            path: '/electromagnetism/magnetism/current-magnetic-field',
          },
          {
            id: 'electromagnetic-induction',
            name: '電磁誘導',
            description: '磁場の変化によって生じる誘導起電力を観察します。',
            unitId: 'electromagnetism',
            topicId: 'magnetism',
            path: '/electromagnetism/magnetism/electromagnetic-induction',
          }
        ]
      },
      {
        id: 'atomic-physics',
        name: '原子物理',
        description: '原子の構造と量子現象について学びます。',
        simulations: [
          {
            id: 'bohr-model',
            name: 'ボーア模型',
            description: '原子内の電子のエネルギー準位と遷移を観察します。',
            unitId: 'electromagnetism',
            topicId: 'atomic-physics',
            path: '/electromagnetism/atomic-physics/bohr-model',
          },
          {
            id: 'photoelectric-effect',
            name: '光電効果',
            description: '光による電子の放出現象を観察します。',
            unitId: 'electromagnetism',
            topicId: 'atomic-physics',
            path: '/electromagnetism/atomic-physics/photoelectric-effect',
          }
        ]
      }
    ]
  }
];