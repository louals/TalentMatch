import { motion } from "framer-motion";

/**  
 * Extreme wave path with deeper curves and sharper peaks
 */
const crazyWavePath =
  "M0 200 C150 80 300 320 450 200 C600 80 750 320 900 200 C1050 80 1200 320 1350 200 C1500 80 1650 320 1800 200 L1800 400 L0 400 Z";

const W = 1800; // viewBox width

export default function CrazyAnimatedWave() {
  return (
    <motion.svg
      viewBox={`0 0 ${W} 400`}
      className="absolute bottom-0 left-0 w-full text-gray-100 dark:text-gray-900 select-none"
      preserveAspectRatio="none"
      style={{ height: "clamp(320px, 25vh, 500px)" }}
    >
      {/* Back layer - wild undulations */}
      <motion.g
        initial={{ x: 0, y: 0, scaleY: 1 }}
        animate={{
          x: -W,
          y: [0, -40, 20, -30, 0],
          scaleY: [1, 1.15, 0.9, 1.1, 1]
        }}
        transition={{
          x: { ease: "linear", duration: 18, repeat: Infinity },
          y: { 
            ease: "easeInOut", 
            duration: 8, 
            repeat: Infinity, 
            repeatType: "mirror",
            times: [0, 0.2, 0.5, 0.8, 1]
          },
          scaleY: { 
            ease: "easeInOut", 
            duration: 6, 
            repeat: Infinity, 
            repeatType: "mirror",
            times: [0, 0.3, 0.6, 0.9, 1]
          }
        }}
        opacity={0.3}
      >
        <path fill="currentColor" d={crazyWavePath} />
        <path transform={`translate(${W} 0)`} fill="currentColor" d={crazyWavePath} />
      </motion.g>

      {/* Mid layer - chaotic movement */}
      <motion.g
        initial={{ x: 0, scaleY: 1, rotate: 0 }}
        animate={{
          x: -W,
          scaleY: [1, 1.2, 0.8, 1.3, 1],
          rotate: [0, -1, 1, -0.5, 0]
        }}
        transition={{
          x: { ease: "linear", duration: 12, repeat: Infinity },
          scaleY: { 
            ease: "easeInOut", 
            duration: 5, 
            repeat: Infinity, 
            repeatType: "mirror",
            times: [0, 0.2, 0.5, 0.8, 1]
          },
          rotate: {
            ease: "easeInOut",
            duration: 7,
            repeat: Infinity,
            repeatType: "mirror"
          }
        }}
        opacity={0.6}
      >
        <motion.path
          fill="currentColor"
          d={crazyWavePath}
          animate={{ 
            opacity: [0.4, 0.9, 0.4],
            d: [
              crazyWavePath,
              "M0 200 C150 60 300 340 450 200 C600 60 750 340 900 200 C1050 60 1200 340 1350 200 C1500 60 1650 340 1800 200 L1800 400 L0 400 Z",
              crazyWavePath
            ]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            repeatType: "mirror", 
            ease: "easeInOut" 
          }}
        />
        <motion.path
          transform={`translate(${W} 0)`}
          fill="currentColor"
          d={crazyWavePath}
          animate={{ 
            opacity: [0.4, 0.9, 0.4],
            d: [
              crazyWavePath,
              "M0 200 C150 60 300 340 450 200 C600 60 750 340 900 200 C1050 60 1200 340 1350 200 C1500 60 1650 340 1800 200 L1800 400 L0 400 Z",
              crazyWavePath
            ]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            repeatType: "mirror", 
            ease: "easeInOut" 
          }}
        />
      </motion.g>

      {/* Front layer - most intense */}
      <motion.g
        initial={{ x: 0, scaleY: 1, rotate: 0 }}
        animate={{
          x: -W,
          scaleY: [1, 1.3, 0.7, 1.4, 1],
          rotate: [0, -2, 2, -1, 0]
        }}
        transition={{
          x: { ease: "linear", duration: 8, repeat: Infinity },
          scaleY: { 
            ease: "easeInOut", 
            duration: 3, 
            repeat: Infinity, 
            repeatType: "mirror",
            times: [0, 0.2, 0.5, 0.8, 1]
          },
          rotate: {
            ease: "easeInOut",
            duration: 4,
            repeat: Infinity,
            repeatType: "mirror"
          }
        }}
      >
        <motion.path
          fill="currentColor"
          d={crazyWavePath}
          animate={{ 
            opacity: [0.8, 1, 0.8],
            d: [
              crazyWavePath,
              "M0 200 C150 40 300 360 450 200 C600 40 750 360 900 200 C1050 40 1200 360 1350 200 C1500 40 1650 360 1800 200 L1800 400 L0 400 Z",
              crazyWavePath
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "mirror", 
            ease: "easeInOut" 
          }}
        />
        <motion.path
          transform={`translate(${W} 0)`}
          fill="currentColor"
          d={crazyWavePath}
          animate={{ 
            opacity: [0.8, 1, 0.8],
            d: [
              crazyWavePath,
              "M0 200 C150 40 300 360 450 200 C600 40 750 360 900 200 C1050 40 1200 360 1350 200 C1500 40 1650 360 1800 200 L1800 400 L0 400 Z",
              crazyWavePath
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "mirror", 
            ease: "easeInOut" 
          }}
        />
      </motion.g>
    </motion.svg>
  );
}