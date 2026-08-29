let animationFrameId = null;
let renderer = null;
let scene = null;
let camera = null;
let mainObject = null;
let particlesMesh = null;
let particlesGeometry = null;

// Referencias a listeners
let onDocumentMouseMove = null;
let onScroll = null;
let onWindowResize = null;
let onVisibilityChange = null;
let observer = null;
let isVisible = false;
let heroSection = null;

export async function initializeThreeHero() {
  console.log('[ThreeHero] Iniciando initializeThreeHero...');
  const canvas = document.getElementById('hero-3d-canvas');
  heroSection = document.querySelector('.hero');

  if (!canvas || !heroSection) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  let THREE;
  try {
    console.log('[ThreeHero] Cargando Three.js desde local...');
    THREE = await import('/assets/js/three.module.min.js');
    console.log('[ThreeHero] Three.js cargado correctamente.');
  } catch (error) {
    console.error("[NainDev] No se pudo cargar Three.js (CSP o Red). El 3D hero se omite.", error);
    return;
  }

  console.log('[ThreeHero] Configurando escena 3D...');
  let width = heroSection.clientWidth;
  let height = heroSection.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
  const particlesCount = 400;
  const posArray = new Float32Array(particlesCount * 3);
  const orbitSpeeds = new Float32Array(particlesCount);
  const orbitAngles = new Float32Array(particlesCount);
  const orbitRadii = new Float32Array(particlesCount);

  for (let i = 0; i < particlesCount; i++) {
    const radius = 2.5 + Math.random() * 5.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    
    posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    posArray[i * 3 + 2] = radius * Math.cos(phi);

    orbitRadii[i] = radius;
    orbitAngles[i] = theta;
    orbitSpeeds[i] = (Math.random() * 0.02) + 0.005;
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

  const animate = () => {
    if (!isVisible) return;

    animationFrameId = requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    mainObject.rotation.y += 0.001;
    mainObject.rotation.x += 0.0005;
    
    mainObject.rotation.y += 0.05 * (mouseX - mainObject.rotation.y);
    mainObject.rotation.x += 0.05 * (mouseY - mainObject.rotation.x);

    const positions = particlesGeometry.attributes.position.array;
    for(let i = 0; i < particlesCount; i++) {
      orbitAngles[i] += orbitSpeeds[i] * 0.5;
      const r = orbitRadii[i];
      const theta = orbitAngles[i];
      const phi = Math.acos(positions[i * 3 + 2] / r) || 0;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta + elapsedTime * 0.1);
    }
    particlesGeometry.attributes.position.needsUpdate = true;
    
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.05;

    const baseCameraY = -scrollY * 0.0015;
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 2 + baseCameraY - camera.position.y) * 0.02;
    
    camera.lookAt(scene.position);
    if (renderer) {
      renderer.render(scene, camera);
    }
    
    if (canvas.classList.contains('canvas-placeholder')) {
      canvas.classList.remove('canvas-placeholder');
      console.log('[ThreeHero] Placeholder ocultado tras renderizar');
    }
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log('[ThreeHero] Sección visible, iniciando animación.');
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
  console.log('[ThreeHero] Limpiando recursos (cleanup)...');
  isVisible = false;
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (heroSection && onDocumentMouseMove) {
    heroSection.removeEventListener('mousemove', onDocumentMouseMove);
  }
  
  if (onScroll) {
    window.removeEventListener('scroll', onScroll);
  }
  
  if (onWindowResize) {
    window.removeEventListener('resize', onWindowResize);
  }
  
  if (onVisibilityChange) {
    document.removeEventListener('visibilitychange', onVisibilityChange);
  }

  if (observer) {
    observer.disconnect();
    observer = null;
  }

  if (mainObject) {
    mainObject.geometry.dispose();
    mainObject.material.dispose();
  }

  if (particlesMesh) {
    particlesMesh.geometry.dispose();
    particlesMesh.material.dispose();
  }

  if (renderer) {
    renderer.dispose();
    // Do NOT remove canvas from DOM, it belongs to the template and will be recreated/destroyed by Astro SPA navigation anyway.
    renderer = null;
  }
  
  scene = null;
  camera = null;
  heroSection = null;
}
