export async function initializeThreeHero() {
  const canvas = document.getElementById('hero-3d-canvas');
  const heroSection = document.querySelector('.hero');

  if (!canvas || !heroSection) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  let THREE;
  try {
    THREE = await import('https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js');
  } catch (error) {
    console.warn("[NainDev] No se pudo cargar Three.js (CSP o Red). El 3D hero se omite.");
    return;
  }

  let width = heroSection.clientWidth;
  let height = heroSection.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
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
  const mainObject = new THREE.Mesh(geometry, material);
  scene.add(mainObject);

  const particlesGeometry = new THREE.BufferGeometry();
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
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  let mouseX = 0;
  let mouseY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  const onDocumentMouseMove = (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
  };
  heroSection.addEventListener('mousemove', onDocumentMouseMove, { passive: true });

  let scrollY = window.scrollY;
  const onScroll = () => {
    scrollY = window.scrollY;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const onWindowResize = () => {
    if (!heroSection) return;
    width = heroSection.clientWidth;
    height = heroSection.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  window.addEventListener('resize', onWindowResize, { passive: true });

  let animationFrameId;
  let isVisible = false;
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
    renderer.render(scene, camera);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Se activa si supera el 50% de visibilidad (threshold: 0.5)
      if (entry.isIntersecting) {
        if (!isVisible) {
          isVisible = true;
          clock.start();
          animate();
        }
      } else {
        isVisible = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    });
  }, { threshold: 0.5 });
  observer.observe(heroSection);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isVisible = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      const rect = heroSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        isVisible = true;
        clock.start();
        animate();
      }
    }
  });
}
