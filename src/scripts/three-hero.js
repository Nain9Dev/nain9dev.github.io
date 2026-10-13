import { hasHardwareAcceleration } from './hardware-acceleration.js';
// Emitted byte-for-byte as a hashed asset (keeps the MIT notice) and fetched only on capable desktops.
import threeModuleUrl from '../vendor/three.module.min.js?url';

let animationFrameId = null;
let renderer = null;
let scene = null;
let camera = null;
let mainObject = null;
let particlesMesh = null;
let particlesGeometry = null;

// Event listener references
let onDocumentMouseMove = null;
let onScroll = null;
let onWindowResize = null;
let onVisibilityChange = null;
let observer = null;
let isVisible = false;
let heroSection = null;

export async function initializeThreeHero() {
  console.log('[ThreeHero] Initializing hero 3D canvas...');
  const canvas = document.getElementById('hero-3d-canvas');
  heroSection = document.querySelector('.hero');

  if (!canvas || !heroSection) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    canvas.style.display = 'none';
    return;
  }

  const isMobileOrTouch = window.innerWidth < 768 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  if (isMobileOrTouch) {
    console.log('[ThreeHero] Mobile or touch device detected. Disabling 3D hero to preserve battery and responsiveness.');
    canvas.style.display = 'none';
    return;
  }

  if (!hasHardwareAcceleration()) {
    console.log('[ThreeHero] Hardware acceleration not available or low-spec device. Falling back to static hero.');
    canvas.style.display = 'none';
    return;
  }

  let THREE;
  try {
    console.log('[ThreeHero] Loading Three.js bundle...');
    THREE = await import(/* @vite-ignore */ threeModuleUrl);
    console.log('[ThreeHero] Three.js loaded successfully.');
  } catch (error) {
    console.error("[NainDev] Unable to load Three.js. Skipping 3D hero.", error);
    canvas.style.display = 'none';
    return;
  }

  console.log('[ThreeHero] Configuring 3D scene...');
  let width = heroSection.clientWidth;
  let height = heroSection.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    console.warn('[ThreeHero] WebGL context lost. Gracefully disabling 3D hero.');
    cleanupThreeHero();
    canvas.style.display = 'none';
  }, { once: true });

  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      // A decorative wireframe does not justify waking a discrete laptop GPU.
      powerPreference: 'low-power',
      failIfMajorPerformanceCaveat: true
    });
  } catch (error) {
    console.warn('[ThreeHero] Unable to create accelerated WebGLRenderer. Falling back to static hero.', error);
    canvas.style.display = 'none';
    return;
  }

  const isMobile = width < 768 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5);
  renderer.setSize(width, height);
  renderer.setPixelRatio(pixelRatio);

  const geometry = new THREE.IcosahedronGeometry(2.2, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0x3B82F6,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  mainObject = new THREE.Mesh(geometry, material);
  scene.add(mainObject);

  particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = isMobile ? 180 : 350;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    const radius = 2.4 + Math.random() * 5.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    
    posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    posArray[i * 3 + 2] = radius * Math.cos(phi);
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.025,
    color: 0x60A5FA,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending
  });
  
  particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  let mouseX = 0;
  let mouseY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  onDocumentMouseMove = (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
  };
  heroSection.addEventListener('mousemove', onDocumentMouseMove, { passive: true });

  let scrollY = window.scrollY;
  onScroll = () => {
    scrollY = window.scrollY;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  onWindowResize = () => {
    if (!heroSection) return;
    width = heroSection.clientWidth;
    height = heroSection.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (renderer) renderer.setSize(width, height);
  };
  window.addEventListener('resize', onWindowResize, { passive: true });

  const clock = new THREE.Clock();
  let lastFrameTime = 0;
  let checkedFrames = 0;
  let consecutiveSlowFrames = 0;

  const animate = () => {
    if (!isVisible) return;

    const now = performance.now();
    if (lastFrameTime > 0 && checkedFrames < 60) {
      checkedFrames++;
      const frameDelta = now - lastFrameTime;
      if (frameDelta > 50) {
        consecutiveSlowFrames++;
        if (consecutiveSlowFrames >= 5) {
          console.warn('[ThreeHero] Low framerate detected during execution. Degraded to lightweight mode.');
          cleanupThreeHero();
          canvas.style.display = 'none';
          if (typeof document !== 'undefined' && document.documentElement) {
            document.documentElement.classList.remove('high-performance');
            document.documentElement.classList.add('low-performance');
          }
          return;
        }
      }
    }
    lastFrameTime = now;

    animationFrameId = requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    mainObject.rotation.y += 0.001;
    mainObject.rotation.x += 0.0005;
    
    mainObject.rotation.y += 0.05 * (mouseX - mainObject.rotation.y);
    mainObject.rotation.x += 0.05 * (mouseY - mainObject.rotation.x);

    particlesMesh.rotation.y = elapsedTime * 0.04;
    particlesMesh.rotation.x = Math.sin(elapsedTime * 0.15) * 0.05;
    particlesMesh.rotation.z = elapsedTime * 0.02;

    const baseCameraY = -scrollY * 0.0015;
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 2 + baseCameraY - camera.position.y) * 0.02;
    
    camera.lookAt(scene.position);
    if (renderer) {
      renderer.render(scene, camera);
    }
    
    if (canvas.classList.contains('canvas-placeholder')) {
      canvas.classList.remove('canvas-placeholder');
      console.log('[ThreeHero] Canvas placeholder hidden after initial render');
    }
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log('[ThreeHero] Hero section visible, starting animation loop.');
        isVisible = true;
        clock.start();
        animate();
      } else {
        isVisible = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    });
  }, { rootMargin: '100px' });
  observer.observe(heroSection);

  onVisibilityChange = () => {
    if (document.hidden) {
      isVisible = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    } else {
      if (!heroSection) return;
      const rect = heroSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        isVisible = true;
        clock.start();
        animate();
      }
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);
}

export function cleanupThreeHero() {
  console.log('[ThreeHero] Disposing 3D resources...');
  isVisible = false;
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (heroSection && onDocumentMouseMove) {
    heroSection.removeEventListener('mousemove', onDocumentMouseMove);
    onDocumentMouseMove = null;
  }
  
  if (onScroll) {
    window.removeEventListener('scroll', onScroll);
    onScroll = null;
  }
  
  if (onWindowResize) {
    window.removeEventListener('resize', onWindowResize);
    onWindowResize = null;
  }
  
  if (onVisibilityChange) {
    document.removeEventListener('visibilitychange', onVisibilityChange);
    onVisibilityChange = null;
  }

  if (observer) {
    observer.disconnect();
    observer = null;
  }

  if (mainObject) {
    mainObject.geometry.dispose();
    mainObject.material.dispose();
    mainObject = null;
  }

  if (particlesMesh) {
    particlesMesh.geometry.dispose();
    particlesMesh.material.dispose();
    particlesMesh = null;
  }

  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
  
  scene = null;
  camera = null;
  heroSection = null;
}
