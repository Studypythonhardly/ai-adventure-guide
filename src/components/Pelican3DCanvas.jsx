import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * 100% 纯代码实时渲染（零图片贴图）：GTA 罪恶都市落日海岸风格 3D 鹈鹕骑单车
 * - 自定义 GLSL 落日渐变天空 + 实时动态海面波光着色器
 * - 弯曲摇曳的 3D 棕榈树、迈阿密天际线剪影、暖橙路灯与反光柏油海滨大道
 * - 戴飞行员墨镜的雕刻级 3D 鹈鹕 + 带前后车灯的碳纤维弯把公路车 + 膝关节 IK 蹬车
 */
export function Pelican3DCanvas({ turbo = false, cameraPreset = 'hero' }) {
  const containerRef = useRef(null)
  const turboRef = useRef(turbo)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)

  useEffect(() => {
    turboRef.current = turbo
  }, [turbo])

  useEffect(() => {
    const cam = cameraRef.current
    const ctrl = controlsRef.current
    if (!cam || !ctrl) return

    if (cameraPreset === 'side') {
      cam.position.set(0.15, 1.65, 6.4)
      ctrl.target.set(0.1, 1.45, 0)
    } else if (cameraPreset === 'front') {
      cam.position.set(4.3, 1.95, 3.9)
      ctrl.target.set(0.15, 1.48, 0)
    } else {
      // Dramatic GTA Vice City sunset chase angle with full headroom
      cam.position.set(3.45, 1.88, 5.55)
      ctrl.target.set(0.12, 1.46, 0)
    }
    ctrl.update()
  }, [cameraPreset])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 720
    const height = container.clientHeight || 360

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x3b1d4a, 0.017)

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 160)
    camera.position.set(3.45, 1.88, 5.55)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.enablePan = false
    controls.minDistance = 2.6
    controls.maxDistance = 9.5
    controls.maxPolarAngle = Math.PI / 2 - 0.03
    controls.target.set(0.12, 1.46, 0)
    controls.update()
    controlsRef.current = controls

    // ==================== 1. CUSTOM GLSL GTA VICE CITY SUNSET SKY ====================
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uSunDir: { value: new THREE.Vector3(-0.35, 0.14, -0.92).normalize() },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPos;
        uniform vec3 uSunDir;
        void main() {
          vec3 dir = normalize(vWorldPos);
          float h = clamp(dir.y, -0.1, 1.0);

          vec3 zenith  = vec3(0.10, 0.07, 0.28); // Deep twilight indigo
          vec3 midSky  = vec3(0.58, 0.19, 0.48); // Vice City magenta
          vec3 horizon = vec3(0.99, 0.52, 0.28); // Warm sunset coral-orange
          vec3 lowGlow = vec3(1.00, 0.80, 0.42); // Golden horizon band

          vec3 col = mix(horizon, midSky, smoothstep(0.0, 0.34, h));
          col = mix(col, zenith, smoothstep(0.28, 0.82, h));
          col = mix(lowGlow, col, smoothstep(-0.02, 0.11, h));

          // Glowing sunset sun disc + wide atmospheric halo
          float sunDot = max(dot(dir, uSunDir), 0.0);
          col += vec3(1.0, 0.65, 0.30) * pow(sunDot, 14.0) * 0.75;
          col += vec3(1.0, 0.94, 0.76) * smoothstep(0.996, 0.9992, sunDot) * 1.4;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(85, 32, 24), skyMat))

    // ==================== 2. ANIMATED GLSL OCEAN WITH SUNSET SHIMMER ====================
    const oceanMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSunDir: { value: new THREE.Vector3(-0.35, 0.14, -0.92).normalize() },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        uniform float uTime;
        void main() {
          vec3 pos = position;
          pos.z += sin(pos.x * 0.45 + uTime * 2.2) * 0.08 + cos(pos.y * 0.6 + uTime * 1.6) * 0.06;
          vec4 wp = modelMatrix * vec4(pos, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPos;
        uniform float uTime;
        void main() {
          float wave = sin(vWorldPos.x * 1.4 + uTime * 2.8) * 0.5 + 0.5;
          float ripple = sin(vWorldPos.z * 2.6 - uTime * 3.2 + vWorldPos.x * 0.8) * 0.5 + 0.5;
          vec3 deepWater = vec3(0.06, 0.14, 0.30);
          vec3 duskTint  = vec3(0.32, 0.16, 0.38);
          vec3 col = mix(deepWater, duskTint, smoothstep(-3.0, -35.0, vWorldPos.z));

          // Golden sunset path shimmering across water
          float sunPath = exp(-pow((vWorldPos.x + 12.0) * 0.09, 2.0));
          float sparkle = smoothstep(0.65, 0.98, wave * ripple) * sunPath;
          col += vec3(1.0, 0.68, 0.32) * (sunPath * 0.32 + sparkle * 0.95);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
    const ocean = new THREE.Mesh(new THREE.PlaneGeometry(140, 65, 48, 24), oceanMat)
    ocean.rotation.x = -Math.PI / 2
    ocean.position.set(0, -0.18, -35.5)
    scene.add(ocean)

    // ==================== 3. CINEMATIC GTA GOLDEN-HOUR LIGHTING ====================
    const hemi = new THREE.HemisphereLight(0xfda4af, 0x1e1b4b, 0.85)
    scene.add(hemi)

    const sunKey = new THREE.DirectionalLight(0xffb86c, 2.6)
    sunKey.position.set(-7, 6.5, -10)
    sunKey.castShadow = true
    sunKey.shadow.mapSize.set(2048, 2048)
    sunKey.shadow.bias = -0.0004
    sunKey.shadow.camera.left = -6
    sunKey.shadow.camera.right = 6
    sunKey.shadow.camera.top = 6
    sunKey.shadow.camera.bottom = -6
    scene.add(sunKey)

    const frontFill = new THREE.DirectionalLight(0xf9a8d4, 1.15)
    frontFill.position.set(5, 5, 7)
    scene.add(frontFill)

    const cyanRim = new THREE.DirectionalLight(0x38bdf8, 0.75)
    cyanRim.position.set(6, 2.5, -4)
    scene.add(cyanRim)

    const makeTube = (a, b, r1, r2, material) => {
      const dir = new THREE.Vector3().subVectors(b, a)
      const len = dir.length()
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, len, 20), material)
      mesh.position.copy(a).add(b).multiplyScalar(0.5)
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
      mesh.castShadow = true
      mesh.receiveShadow = true
      return mesh
    }

    // ==================== 4. COASTAL BOULEVARD, PALM TREES & SKYLINE ====================
    // Glossy sunset-reflective coastal asphalt
    const roadMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e2030,
      roughness: 0.42,
      metalness: 0.15,
      clearcoat: 0.35,
      clearcoatRoughness: 0.38,
    })
    const road = new THREE.Mesh(new THREE.BoxGeometry(120, 0.08, 3.8), roadMat)
    road.position.y = -0.02
    road.receiveShadow = true
    scene.add(road)

    // Warm sunset promenade sidewalk + ocean seawall guardrail
    const sidewalk = new THREE.Mesh(
      new THREE.BoxGeometry(120, 0.14, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x47415c, roughness: 0.75 })
    )
    sidewalk.position.set(0, 0.01, -3.05)
    sidewalk.receiveShadow = true
    scene.add(sidewalk)

    const railMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.7, roughness: 0.3 })
    const guardrail = new THREE.Mesh(new THREE.BoxGeometry(120, 0.07, 0.07), railMat)
    guardrail.position.set(0, 0.56, -4.15)
    scene.add(guardrail)

    // Near-side sandy verge
    const nearVerge = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 20),
      new THREE.MeshStandardMaterial({ color: 0x2d243b, roughness: 0.9 })
    )
    nearVerge.rotation.x = -Math.PI / 2
    nearVerge.position.set(0, -0.02, 11.8)
    scene.add(nearVerge)

    // Double amber center road lines
    const stripes = []
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.25,
      roughness: 0.4,
    })
    for (let i = -12; i <= 12; i++) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.015, 0.1), stripeMat)
      s.position.set(i * 2.8, 0.028, 0)
      scene.add(s)
      stripes.push(s)
    }

    // Distant Miami Art-Deco Skyline Silhouettes
    const skylineMat = new THREE.MeshStandardMaterial({ color: 0x241738, roughness: 0.9 })
    const winGlowMat = new THREE.MeshBasicMaterial({ color: 0xfde047 })
    for (let i = 0; i < 16; i++) {
      const bh = 2.5 + ((i * 37) % 7) * 0.9
      const bw = 1.2 + (i % 3) * 0.55
      const b = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 1.2), skylineMat)
      b.position.set(-28 + i * 3.6, bh / 2 - 0.5, -42 - (i % 3) * 4)
      scene.add(b)
      const beacon = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.7, 0.08, 0.1), winGlowMat)
      beacon.position.set(b.position.x, bh - 0.8, b.position.z + 0.65)
      scene.add(beacon)
    }

    // Iconic Curved 3D GTA Palm Trees + Warm Neon Streetlights
    const palmTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3228, roughness: 0.85 })
    const palmLeafMat = new THREE.MeshStandardMaterial({
      color: 0x134e4a,
      roughness: 0.65,
      side: THREE.DoubleSide,
    })
    const lampPostMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.35 })
    const lampBulbMat = new THREE.MeshBasicMaterial({ color: 0xffe4b5 })

    const createPalmTree = (leanSign) => {
      const palm = new THREE.Group()
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(leanSign * 0.35, 1.6, 0.12),
        new THREE.Vector3(leanSign * 0.72, 3.2, 0.25),
        new THREE.Vector3(leanSign * 0.85, 4.4, 0.2),
      ])
      const trunk = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.12, 10, false), palmTrunkMat)
      trunk.castShadow = true
      palm.add(trunk)

      const crown = new THREE.Group()
      crown.position.set(leanSign * 0.85, 4.4, 0.2)
      for (let f = 0; f < 7; f++) {
        const ang = (f / 7) * Math.PI * 2
        const frondCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(Math.cos(ang) * 0.9, 0.45, Math.sin(ang) * 0.9),
          new THREE.Vector3(Math.cos(ang) * 1.75, -0.35, Math.sin(ang) * 1.75),
        ])
        const frond = new THREE.Mesh(new THREE.TubeGeometry(frondCurve, 10, 0.09, 6, false), palmLeafMat)
        frond.scale.set(1, 0.35, 1)
        crown.add(frond)
      }
      palm.add(crown)
      palm.userData.crown = crown
      return palm
    }

    const props = []
    for (let i = 0; i < 9; i++) {
      const palm = createPalmTree(i % 2 === 0 ? 1 : -1)
      palm.position.set(-22 + i * 5.6, 0.05, -2.9)
      scene.add(palm)
      props.push(palm)

      // Streetlight every other slot
      if (i % 2 === 0) {
        const lamp = new THREE.Group()
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 3.9, 10), lampPostMat)
        pole.position.y = 1.95
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.1), lampPostMat)
        arm.position.set(0, 3.85, 0.5)
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), lampBulbMat)
        bulb.position.set(0, 3.76, 0.98)
        lamp.add(pole, arm, bulb)
        lamp.position.set(-19.2 + i * 5.6, 0.05, -2.35)
        scene.add(lamp)
        props.push(lamp)
      }
    }

    // ==================== 5. AERO CARBON ROAD BIKE WITH LED HEAD/TAIL LIGHTS ====================
    const rig = new THREE.Group()
    scene.add(rig)

    const tireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.78 })
    const rimMat = new THREE.MeshPhysicalMaterial({ color: 0x1e1b4b, metalness: 0.7, roughness: 0.2, clearcoat: 0.9 })
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.92, roughness: 0.14 })
    const carbonFrameMat = new THREE.MeshPhysicalMaterial({
      color: 0x312e81,
      metalness: 0.72,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    })
    const magentaAccentMat = new THREE.MeshPhysicalMaterial({
      color: 0xec4899,
      metalness: 0.55,
      roughness: 0.2,
      clearcoat: 0.9,
    })
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.45, roughness: 0.35 })
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.18 })

    const createWheel = (xPos) => {
      const wheel = new THREE.Group()
      wheel.position.set(xPos, 0.64, 0)
      const tire = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.062, 20, 48), tireMat)
      tire.castShadow = true
      const aeroRim = new THREE.Mesh(new THREE.TorusGeometry(0.49, 0.036, 16, 48), rimMat)
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.18, 20), goldMat)
      hub.rotation.x = Math.PI / 2
      wheel.add(tire, aeroRim, hub)
      for (let i = 0; i < 12; i++) {
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.96, 6), chromeMat)
        spoke.rotation.z = (i * Math.PI) / 12
        wheel.add(spoke)
      }
      return wheel
    }

    const rearWheel = createWheel(-1.02)
    const frontWheel = createWheel(1.08)
    rig.add(rearWheel, frontWheel)

    const pBB = new THREE.Vector3(-0.12, 0.62, 0)
    const pSeatTop = new THREE.Vector3(-0.44, 1.44, 0)
    const pHeadTop = new THREE.Vector3(0.74, 1.54, 0)
    const pHeadBot = new THREE.Vector3(0.82, 1.28, 0)

    rig.add(
      makeTube(new THREE.Vector3(-1.02, 0.64, 0.065), new THREE.Vector3(-0.12, 0.62, 0.04), 0.022, 0.028, carbonFrameMat),
      makeTube(new THREE.Vector3(-1.02, 0.64, -0.065), new THREE.Vector3(-0.12, 0.62, -0.04), 0.022, 0.028, carbonFrameMat),
      makeTube(new THREE.Vector3(-1.02, 0.64, 0.065), pSeatTop, 0.02, 0.02, carbonFrameMat),
      makeTube(new THREE.Vector3(-1.02, 0.64, -0.065), pSeatTop, 0.02, 0.02, carbonFrameMat),
      makeTube(pBB, pSeatTop, 0.042, 0.036, carbonFrameMat),
      makeTube(pBB, pHeadBot, 0.046, 0.04, carbonFrameMat),
      makeTube(pSeatTop, pHeadTop, 0.036, 0.036, magentaAccentMat),
      makeTube(pHeadTop, pHeadBot, 0.045, 0.045, darkMat),
      makeTube(pHeadBot, new THREE.Vector3(1.08, 0.64, 0.085), 0.028, 0.02, carbonFrameMat),
      makeTube(pHeadBot, new THREE.Vector3(1.08, 0.64, -0.085), 0.028, 0.02, carbonFrameMat)
    )

    // Glowing LED Headlight + Red Taillight (GTA night-sunset vibe!)
    const headlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 14, 14),
      new THREE.MeshBasicMaterial({ color: 0xfffbeb })
    )
    headlight.position.set(0.86, 1.52, 0)
    const headSpot = new THREE.PointLight(0xfef08a, 1.8, 4.5)
    headSpot.position.set(1.05, 1.5, 0)
    const taillight = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xff2a55 })
    )
    taillight.position.set(-0.56, 1.48, 0)
    const tailGlow = new THREE.PointLight(0xff2a55, 1.4, 3.0)
    tailGlow.position.set(-0.68, 1.46, 0)
    rig.add(headlight, headSpot, taillight, tailGlow)

    // Saddle & drop handlebars
    rig.add(makeTube(pSeatTop, new THREE.Vector3(-0.48, 1.56, 0), 0.024, 0.024, chromeMat))
    const saddle = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 16), darkMat)
    saddle.scale.set(1.35, 0.25, 0.68)
    saddle.position.set(-0.5, 1.58, 0)
    rig.add(saddle)

    const stemTop = new THREE.Vector3(0.68, 1.72, 0)
    rig.add(makeTube(pHeadTop, stemTop, 0.026, 0.028, chromeMat))
    ;[-1, 1].forEach((side) => {
      const barCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.68, 1.72, 0),
        new THREE.Vector3(0.68, 1.72, side * 0.28),
        new THREE.Vector3(0.84, 1.7, side * 0.36),
        new THREE.Vector3(0.88, 1.56, side * 0.36),
        new THREE.Vector3(0.74, 1.5, side * 0.36),
      ])
      rig.add(new THREE.Mesh(new THREE.TubeGeometry(barCurve, 24, 0.024, 12, false), darkMat))
    })

    // Woven front basket + silver mackerel
    const basket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.15, 0.26, 24),
      new THREE.MeshStandardMaterial({ color: 0xb47b44, roughness: 0.8 })
    )
    basket.position.set(0.98, 1.54, 0)
    basket.castShadow = true
    rig.add(basket)

    const fishMat = new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.18, clearcoat: 0.9 })
    const fish = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 14), fishMat)
    fish.scale.set(1.6, 0.72, 0.48)
    fish.position.set(1.04, 1.72, 0)
    fish.rotation.z = 0.42
    rig.add(fish)

    // Crankset & pedals
    const crankGroup = new THREE.Group()
    crankGroup.position.copy(pBB)
    rig.add(crankGroup)
    const chainring = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 28), goldMat)
    chainring.rotation.x = Math.PI / 2
    crankGroup.add(chainring)
    ;[
      [1, 0.19],
      [-1, -0.19],
    ].forEach(([s, z]) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.25, 0.025), chromeMat)
      arm.position.set(0, s * 0.115, z * 0.65)
      const pedal = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.038, 0.11), darkMat)
      pedal.position.set(0, s * 0.23, z)
      crankGroup.add(arm, pedal)
    })

    // ==================== 6. GTA COOL AVIATOR-SUNGLASSES 3D PELICAN ====================
    const pelican = new THREE.Group()
    rig.add(pelican)

    const featherMat = new THREE.MeshPhysicalMaterial({
      color: 0xfef7ed,
      roughness: 0.45,
      sheen: 0.75,
      sheenColor: new THREE.Color(0xfdba74),
      clearcoat: 0.15,
    })
    const darkFeatherMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.55 })
    const beakMat = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.25, clearcoat: 0.5 })
    const pouchMat = new THREE.MeshPhysicalMaterial({
      color: 0xfb923c,
      roughness: 0.34,
      clearcoat: 0.35,
      sheen: 0.5,
      sheenColor: new THREE.Color(0xfef08a),
    })
    const legMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.4 })
    const scarfMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0x9f1239,
      emissiveIntensity: 0.15,
      roughness: 0.5,
    })

    // Smooth Lathe torso
    const bodyPts = [
      new THREE.Vector2(0.0, -0.58),
      new THREE.Vector2(0.22, -0.52),
      new THREE.Vector2(0.4, -0.3),
      new THREE.Vector2(0.45, -0.02),
      new THREE.Vector2(0.4, 0.28),
      new THREE.Vector2(0.26, 0.5),
      new THREE.Vector2(0.0, 0.6),
    ]
    const torso = new THREE.Mesh(new THREE.LatheGeometry(bodyPts, 32), featherMat)
    torso.rotation.z = -Math.PI / 2 - 0.18
    torso.scale.set(0.95, 1.12, 0.88)
    torso.position.set(-0.34, 1.98, 0)
    torso.castShadow = true
    pelican.add(torso)

    // Tail fan
    const tailShape = new THREE.Shape()
    tailShape.moveTo(0, 0)
    tailShape.quadraticCurveTo(-0.34, 0.14, -0.44, 0.04)
    tailShape.quadraticCurveTo(-0.34, -0.1, 0, -0.12)
    const tailGeo = new THREE.ExtrudeGeometry(tailShape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 6,
    })
    tailGeo.center()
    const tail = new THREE.Mesh(tailGeo, darkFeatherMat)
    tail.position.set(-0.98, 2.08, 0)
    tail.rotation.z = 0.22
    pelican.add(tail)

    // Graceful S-curve neck
    const neckCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.04, 2.08, 0),
      new THREE.Vector3(0.08, 2.38, 0),
      new THREE.Vector3(0.24, 2.66, 0),
    ])
    const neck = new THREE.Mesh(new THREE.TubeGeometry(neckCurve, 24, 0.145, 20, false), featherMat)
    neck.castShadow = true
    pelican.add(neck)

    // Head Group
    const headGroup = new THREE.Group()
    headGroup.position.set(0.27, 2.74, 0)
    pelican.add(headGroup)

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 24), featherMat)
    head.scale.set(1.1, 1.0, 0.94)
    head.castShadow = true
    headGroup.add(head)

    // Swept-back windblown crest feathers (classic cool GTA silhouette!)
    for (let c = 0; c < 3; c++) {
      const crest = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.24, 10), featherMat)
      crest.rotation.z = Math.PI / 2 + 0.35 + c * 0.15
      crest.position.set(-0.16 - c * 0.03, 0.2 - c * 0.04, 0)
      headGroup.add(crest)
    }

    // Iconic Gold-Rimmed Aviator Sunglasses reflecting the sunset!
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.95,
      roughness: 0.06,
      clearcoat: 1.0,
    })
    ;[-1, 1].forEach((side) => {
      const lens = new THREE.Mesh(new THREE.SphereGeometry(0.082, 16, 14), lensMat)
      lens.scale.set(0.55, 0.88, 1.05)
      lens.position.set(0.15, 0.04, side * 0.15)
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 10, 24), goldMat)
      rim.rotation.y = Math.PI / 2 - side * 0.35
      rim.position.set(0.16, 0.04, side * 0.16)
      headGroup.add(lens, rim)
    })
    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.16, 8), goldMat)
    bridge.rotation.x = Math.PI / 2
    bridge.position.set(0.21, 0.07, 0)
    headGroup.add(bridge)

    // Sculpted Upper Bill + Plump Throat Pouch
    const upperBillShape = new THREE.Shape()
    upperBillShape.moveTo(0, 0.08)
    upperBillShape.quadraticCurveTo(0.46, 0.09, 0.88, -0.02)
    upperBillShape.quadraticCurveTo(0.94, -0.06, 0.85, -0.11)
    upperBillShape.quadraticCurveTo(0.45, -0.04, 0, -0.05)
    const upperBillGeo = new THREE.ExtrudeGeometry(upperBillShape, {
      depth: 0.11,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.03,
      bevelSegments: 8,
    })
    upperBillGeo.translate(0, 0, -0.055)
    const upperBill = new THREE.Mesh(upperBillGeo, beakMat)
    upperBill.position.set(0.16, 0.01, 0)
    upperBill.castShadow = true
    headGroup.add(upperBill)

    const pouchShape = new THREE.Shape()
    pouchShape.moveTo(0.0, -0.04)
    pouchShape.lineTo(0.84, -0.08)
    pouchShape.quadraticCurveTo(0.68, -0.44, 0.24, -0.42)
    pouchShape.quadraticCurveTo(-0.04, -0.34, 0.0, -0.04)
    const pouchGeo = new THREE.ExtrudeGeometry(pouchShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.075,
      bevelSize: 0.042,
      bevelSegments: 10,
    })
    pouchGeo.translate(0, 0, -0.07)
    const pouch = new THREE.Mesh(pouchGeo, pouchMat)
    pouch.position.set(0.16, 0.0, 0)
    pouch.castShadow = true
    headGroup.add(pouch)

    // Sculpted wings gripping handlebars
    const wingShape = new THREE.Shape()
    wingShape.moveTo(0, 0.14)
    wingShape.quadraticCurveTo(0.48, 0.18, 0.88, -0.04)
    wingShape.quadraticCurveTo(0.62, -0.18, 0.02, -0.14)
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 6,
    })
    wingGeo.translate(0, 0, -0.025)
    ;[-1, 1].forEach((side) => {
      const wing = new THREE.Mesh(wingGeo, featherMat)
      wing.position.set(-0.22, 1.98, side * 0.34)
      wing.rotation.z = -0.26
      wing.rotation.y = side * -0.06
      wing.castShadow = true
      pelican.add(wing)
    })

    // Flowing crimson scarf
    const scarfCollar = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.046, 12, 24), scarfMat)
    scarfCollar.rotation.x = Math.PI / 2 - 0.35
    scarfCollar.position.set(0.08, 2.34, 0)
    pelican.add(scarfCollar)

    const scarfTailGroup = new THREE.Group()
    scarfTailGroup.position.set(-0.04, 2.32, 0)
    pelican.add(scarfTailGroup)
    const scarfNodes = []
    for (let i = 0; i < 7; i++) {
      const seg = new THREE.Mesh(new THREE.SphereGeometry(0.068 - i * 0.005, 14, 12), scarfMat)
      seg.scale.set(1.85, 0.52, 1.35)
      seg.position.set(-i * 0.15, -i * 0.02, 0)
      scarfTailGroup.add(seg)
      scarfNodes.push(seg)
    }

    // 2-Segment IK Pedaling Legs
    const makeLegRig = () => {
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.032, 1, 14), legMat)
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 12), legMat)
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.026, 1, 14), legMat)
      const foot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 12), legMat)
      foot.scale.set(1.45, 0.36, 0.9)
      thigh.castShadow = true
      shin.castShadow = true
      pelican.add(thigh, knee, shin, foot)
      return { thigh, knee, shin, foot }
    }
    const leftLeg = makeLegRig()
    const rightLeg = makeLegRig()
    const hipL = new THREE.Vector3(-0.36, 1.66, 0.19)
    const hipR = new THREE.Vector3(-0.36, 1.66, -0.19)

    const placeBone = (mesh, a, b) => {
      const d = new THREE.Vector3().subVectors(b, a)
      mesh.scale.y = d.length()
      mesh.position.copy(a).add(b).multiplyScalar(0.5)
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())
    }
    const updateIKLeg = (leg, hip, pedalOffsetY, zPos, angle) => {
      const footPos = new THREE.Vector3(
        pBB.x + Math.sin(angle) * pedalOffsetY,
        pBB.y + Math.cos(angle) * pedalOffsetY + 0.045,
        zPos
      )
      const mid = new THREE.Vector3().addVectors(hip, footPos).multiplyScalar(0.5)
      const bend = Math.max(0.05, 0.24 - hip.distanceTo(footPos) * 0.14)
      const kneePos = new THREE.Vector3(mid.x + bend, mid.y + 0.04, zPos)
      placeBone(leg.thigh, hip, kneePos)
      placeBone(leg.shin, kneePos, footPos)
      leg.knee.position.copy(kneePos)
      leg.foot.position.set(footPos.x + 0.04, footPos.y, zPos)
    }

    // ==================== ANIMATION LOOP ====================
    let rafId = 0
    let crankAngle = 0
    let elapsed = 0
    const clock = new THREE.Clock()

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      const speed = turboRef.current ? 2.4 : 1.0
      elapsed += dt * speed

      oceanMat.uniforms.uTime.value = elapsed

      rearWheel.rotation.z -= dt * 4.8 * speed
      frontWheel.rotation.z -= dt * 4.8 * speed
      crankAngle += dt * 4.8 * speed
      crankGroup.rotation.z = -crankAngle

      updateIKLeg(leftLeg, hipL, 0.23, 0.19, crankAngle)
      updateIKLeg(rightLeg, hipR, -0.23, -0.19, crankAngle)

      rig.position.y = Math.sin(elapsed * 9.5) * 0.022
      pelican.rotation.z = THREE.MathUtils.lerp(
        pelican.rotation.z,
        turboRef.current ? -0.1 : 0,
        0.08
      )
      headGroup.rotation.z = Math.sin(elapsed * 4.6) * 0.04

      scarfNodes.forEach((n, idx) => {
        n.position.y = -idx * 0.024 + Math.sin(elapsed * 13 - idx * 0.8) * 0.045
        n.position.z = Math.cos(elapsed * 9 - idx * 0.7) * 0.03
      })

      const moveX = dt * 7.2 * speed
      stripes.forEach((s) => {
        s.position.x -= moveX
        if (s.position.x < -32) s.position.x += 70
      })
      props.forEach((p) => {
        p.position.x -= moveX
        if (p.position.x < -26) p.position.x += 50.4
        if (p.userData.crown) {
          p.userData.crown.rotation.z = Math.sin(elapsed * 2.2 + p.position.x) * 0.05
        }
      })

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w > 0 && h > 0) {
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      controls.dispose()
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing relative"
      title="100% 纯代码 WebGL 实时渲染 · 按住鼠标拖拽 360° 旋转"
    />
  )
}
