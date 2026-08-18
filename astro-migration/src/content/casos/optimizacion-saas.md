---
title: "Optimización de rendimiento y escalabilidad horizontal"
eyebrow: "Plataforma SaaS · Backend Specialist"
description: "Optimización de rendimiento, sharding y escalabilidad horizontal para una plataforma SaaS crítica."
tags: [".NET", "SQL Server", "CQRS", "Performance Tuning"]
---

<div class="case-study-section">
  <h2>El Problema</h2>
  <p>El sistema experimentaba cuellos de botella severos en la base de datos principal debido a consultas monolíticas y bloqueos de recursos, degradando la experiencia de miles de usuarios en horas pico.</p>
</div>

<div class="case-study-section">
  <h2>Decisiones Arquitectónicas</h2>
  <ul class="case-study-list decisions-list">
    <li>Desacoplamiento progresivo de lógica pesada hacia workers en background.</li>
    <li>Implementación de caché distribuida (Redis) para lecturas intensivas.</li>
    <li>Optimización a nivel de SQL (índices, reconstrucción de queries) y segregación de lectura/escritura (CQRS ligero).</li>
  </ul>
</div>

<div class="case-study-section results-section">
  <h2>Resultados</h2>
  <ul class="case-study-list results-list">
    <li>Reducción del 85% en tiempos de respuesta p95.</li>
    <li>Reducción drástica del uso de CPU en la BD transaccional.</li>
    <li>Escalabilidad lineal habilitada para futuros incrementos de tráfico.</li>
  </ul>
</div>
