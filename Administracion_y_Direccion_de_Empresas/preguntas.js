const bancoPreguntas = [
    // ---------------- UNIDAD 1: LA EMPRESA ----------------
    {
        unidad: "UD1",
        pregunta: "En una organización funcional clásica, un miembro del equipo de un proyecto se queja de que recibe órdenes de distintos jefes. ¿Quién tiene realmente el poder de darle indicaciones a este miembro del equipo?",
        opciones: [
            "El equipo del proyecto.",
            "El director del proyecto.",
            "El patrocinador del proyecto.",
            "El director del departamento al que pertenece."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: El director del departamento al que pertenece."
    },
    {
        unidad: "UD1",
        pregunta: "En un proyecto el director de proyecto tiene plena potestad para tomar decisiones, ¿cuál de las siguientes afirmaciones es FALSA?",
        opciones: [
            "Se trata de una organización funcional clásica.",
            "Ninguna de las anteriores.",
            "Se trata de una organización por proyectos.",
            "Se trata de una organización matricial fuerte."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: Se trata de una organización funcional clásica."
    },
    {
        unidad: "UD1",
        pregunta: "¿Cuál de las siguientes es una actividad de control?",
        opciones: [
            "Se decide incrementar el bono de productividad de los empleados.",
            "Se solicita planificar la producción del próximo mes.",
            "Se requiere de un aumento no previsto de las compras de un insumo.",
            "Se reparten los paquetes de trabajo."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Se requiere de un aumento no previsto de las compras de un insumo."
    },
    {
        unidad: "UD1",
        pregunta: "Un director de proyecto no logra atraer la suficiente atención sobre su proyecto porque los recursos están ocupados en tareas operativas y el director de proyecto no tiene suficiente autoridad en la asignación de recursos. Probablemente se trata de una organización:",
        opciones: [
            "Orientada a proyectos.",
            "Matricial fuerte.",
            "Funcional clásica.",
            "Matricial balanceada."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Funcional clásica."
    },
    {
        unidad: "UD1",
        pregunta: "¿Cuál de las siguientes afirmaciones es cierta?",
        opciones: [
            "La dirección debe maximizar el valor de la acción y olvidarse de la responsabilidad social de la empresa.",
            "La dirección debe ocuparse de la responsabilidad social de la empresa y olvidarse de maximizar el valor de la acción.",
            "La dirección debe maximizar el valor de la acción y hacer que la empresa cumpla con su responsabilidad social.",
            "La dirección no debe ocuparse de la responsabilidad social de la empresa."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: La dirección debe maximizar el valor de la acción y hacer que la empresa cumpla con su responsabilidad social."
    },
    {
        unidad: "UD1",
        pregunta: "Caso Tech4Learn S.A.: clasifica la empresa según tamaño, sector y propiedad del capital; elige dos stakeholders con intereses en conflicto; propón estrategias de gestión y analiza riesgos de una mala gestión en un proyecto internacional de EdTech.",
        opciones: [
            "Respuesta de desarrollo: Tech4Learn es una mediana empresa, del sector terciario y de capital mixto. Un conflicto posible es docentes frente al equipo de desarrollo. Estrategias: pruebas piloto con docentes aliados y formación práctica orientada a utilidad real. Riesgos: bloqueo normativo por protección de datos y rechazo cultural de la plataforma."
        ],
        correcta: 0,
        explicacion: "Pregunta de desarrollo del PDF. Se conserva con una única opción para no romper la estructura del banco de preguntas."
    },
    {
        unidad: "UD1",
        pregunta: "¿Cuál de las siguientes NO es una empresa del sector terciario?",
        opciones: [
            "Un distribuidor de ropa.",
            "Un fabricante de ropa.",
            "Un vendedor de ropa.",
            "Un taller de arreglo de ropa."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Un fabricante de ropa."
    },
    {
        unidad: "UD1",
        pregunta: "¿Cuál de los siguientes es un sistema de procesamiento de transacciones?",
        opciones: [
            "El sistema de selección de nuevos empleados.",
            "El programa de evaluación de empleados.",
            "La web de banca a distancia de un banco.",
            "El sistema de evaluación de proveedores."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: La web de banca a distancia de un banco."
    },
    {
        unidad: "UD1",
        pregunta: "Una empresa decide implementar un sistema que permite emitir facturas a sus clientes de forma automática. Esto es un ejemplo de:",
        opciones: [
            "Sistema de información de las operaciones.",
            "Sistema experto.",
            "Sistema de apoyo a la decisión.",
            "Sistema de procesamiento de transacciones."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Sistema de procesamiento de transacciones."
    },
    {
        unidad: "UD1",
        pregunta: "De entre los distintos tipos de organización, ¿qué es lo que caracteriza a la empresa?",
        opciones: [
            "El lucro.",
            "La comunicación.",
            "La jerarquía.",
            "La separación de funciones."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: El lucro."
    },
    {
        unidad: "UD1",
        pregunta: "En una organización orientada a proyectos, el equipo del proyecto:",
        opciones: [
            "No tiene un departamento al que regresar al finalizar el proyecto.",
            "Reporta a muchos jefes a la vez.",
            "Reporta a un director de departamento funcional.",
            "No tiene lealtad al proyecto."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: No tiene un departamento al que regresar al finalizar el proyecto."
    },
    {
        unidad: "UD1",
        pregunta: "¿Cuál de las siguientes es una tarea de la alta dirección?",
        opciones: [
            "Negociar el precio de cada materia prima.",
            "Gestionar las compras de cada una de las fábricas.",
            "Fijar los objetivos de crecimiento de la empresa para el año entrante.",
            "Repartir el trabajo entre los empleados de cada grupo."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Fijar los objetivos de crecimiento de la empresa para el año entrante."
    },
    {
        unidad: "UD1",
        pregunta: "¿Cuál de los siguientes NO es una función de la dirección?",
        opciones: [
            "Planificación.",
            "Gestión.",
            "Organización.",
            "Justificación."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Justificación."
    },
    {
        unidad: "UD1",
        pregunta: "La estructura de la empresa queda reflejada en:",
        opciones: [
            "Las nóminas.",
            "El informe institucional.",
            "El plan de gestión.",
            "El organigrama."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: El organigrama."
    },
    {
        unidad: "UD1",
        pregunta: "El consejo de administración se reúne para analizar el balance de la empresa antes de su publicación. ¿A qué función de la dirección corresponde esta tarea?",
        opciones: [
            "Organización.",
            "Planificación.",
            "Gestión.",
            "Control."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Control."
    },
    {
        unidad: "UD1",
        pregunta: "Un hospital implementa un sistema que recopila datos históricos en los que se relacionan síntomas, tratamiento aplicado y resultado obtenido y que en base a esos datos proporciona propuestas de tratamientos a nuevos pacientes. Esto es un ejemplo de:",
        opciones: [
            "Sistema de apoyo a la decisión.",
            "Sistema experto.",
            "Sistema de procesamiento de transacciones.",
            "Sistema de información de las operaciones."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Sistema experto."
    },
    {
        unidad: "UD1",
        pregunta: "¿Cuál de los siguientes NO es una entrada de la empresa como sistema?",
        opciones: [
            "Las materias primas.",
            "Los salarios.",
            "El capital.",
            "El trabajo."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Los salarios."
    },
    {
        unidad: "UD1",
        pregunta: "¿Cuál de las siguientes organizaciones constituye una empresa?",
        opciones: [
            "Las Naciones Unidas.",
            "La mercería de un pequeño pueblo.",
            "La Cruz Roja Internacional.",
            "El Ministerio de Industria."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: La mercería de un pequeño pueblo."
    },
    {
        unidad: "UD1",
        pregunta: "¿Cuál de los siguientes no es un sistema de información para la dirección?",
        opciones: [
            "Sistema de apoyo a la decisión.",
            "Sistema de procesamiento de transacciones.",
            "Sistema de información de las operaciones.",
            "Procesamiento de texto."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Procesamiento de texto."
    },
    {
        unidad: "UD1",
        pregunta: "Un sistema experto:",
        opciones: [
            "Suele ser estático.",
            "No siempre utiliza la experiencia humana.",
            "Es una aplicación de la inteligencia artificial.",
            "Es una posición en el organigrama de la empresa."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Es una aplicación de la inteligencia artificial."
    },

    // ---------------- UNIDAD 2: BALANCE Y RENTABILIDAD ----------------
    {
        unidad: "UD2",
        pregunta: "Los activos forman parte de:",
        opciones: [
            "De la estructura económica y de la financiera.",
            "Ni de la estructura económica ni de la financiera.",
            "La estructura financiera.",
            "La estructura económica."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: La estructura económica."
    },
    {
        unidad: "UD2",
        pregunta: "Una empresa adquiere un piso para alojar a empleados que pasen temporadas en su sede central. Esto es un:",
        opciones: [
            "Pasivo fijo.",
            "Pasivo a corto plazo.",
            "Activo fijo.",
            "Activo circulante."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Activo fijo."
    },
    {
        unidad: "UD2",
        pregunta: "¿Cuál de los siguientes indicadores nos puede señalar si hay activos ociosos?",
        opciones: [
            "Rotación del capital.",
            "Prueba del ácido.",
            "Endeudamiento total.",
            "Rentabilidad financiera después de impuestos."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Prueba del ácido."
    },
    {
        unidad: "UD2",
        pregunta: "¿Cuál de las siguientes afirmaciones sobre el fondo de maniobra (FM) es FALSA?",
        opciones: [
            "Es la parte de los capitales permanentes que no financia activo fijo.",
            "Es la parte del activo circulante que no se financia con pasivo a corto.",
            "Es la parte de los capitales permanentes que financia activo circulante.",
            "Es la parte del activo circulante que se financia con pasivo a corto."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Es la parte del activo circulante que se financia con pasivo a corto."
    },
    {
        unidad: "UD2",
        pregunta: "El capital social de la empresa forma parte de su:",
        opciones: [
            "La estructura financiera.",
            "De la estructura económica y de la financiera.",
            "Ni de la estructura económica ni de la financiera.",
            "La estructura económica."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: La estructura financiera."
    },
    {
        unidad: "UD2",
        pregunta: "Una empresa tiene un fondo de maniobra más elevado de lo deseable, ¿cuál de las siguientes afirmaciones NO puede ser cierta?",
        opciones: [
            "Se tiene un alto nivel de endeudamiento a corto plazo.",
            "Hay bajo riesgo de impago.",
            "Se está desaprovechando el activo circulante.",
            "La situación es conveniente."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: La situación es conveniente."
    },
    {
        unidad: "UD2",
        pregunta: "Una empresa compra unas pocas acciones de otra. Esto, para la empresa que las compra, es un:",
        opciones: [
            "Activo fijo.",
            "Pasivo a corto plazo.",
            "Activo circulante.",
            "Pasivo fijo."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Activo circulante."
    },
    {
        unidad: "UD2",
        pregunta: "La rentabilidad económica es igual al:",
        opciones: [
            "Beneficio neto generado por cada euro del pasivo total.",
            "Beneficio económico generado por cada euro del pasivo total.",
            "Beneficio neto generado por cada euro de recursos propios.",
            "Beneficio económico generado por cada euro de recursos propios."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Beneficio económico generado por cada euro del pasivo total."
    },
    {
        unidad: "UD2",
        pregunta: "La rentabilidad económica es igual al:",
        opciones: [
            "Beneficio económico generado por cada euro de recursos propios.",
            "Beneficio neto generado por cada euro del pasivo total.",
            "Beneficio económico generado por cada euro del pasivo total.",
            "Beneficio neto generado por cada euro de recursos propios."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Beneficio neto generado por cada euro de recursos propios."
    },
    {
        unidad: "UD2",
        pregunta: "El beneficio económico es:",
        opciones: [
            "El generado por los activos, una vez deducido el coste de las deudas.",
            "El generado por los activos, una vez deducido el coste de las deudas y los impuestos.",
            "El generado por los activos de la empresa.",
            "El EBITDA."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: El generado por los activos de la empresa."
    },
    {
        unidad: "UD2",
        pregunta: "Las deudas forman parte de:",
        opciones: [
            "Ni de la estructura económica ni de la financiera.",
            "De la estructura económica y de la financiera.",
            "La estructura financiera.",
            "La estructura económica."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: La estructura financiera."
    },
    {
        unidad: "UD2",
        pregunta: "El beneficio neto es:",
        opciones: [
            "El generado por los activos, una vez deducido el coste de las deudas y los impuestos.",
            "El generado por los activos, una vez deducido el coste de las deudas.",
            "El generado por los activos de la empresa.",
            "El EBITDA."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: El generado por los activos, una vez deducido el coste de las deudas."
    },
    {
        unidad: "UD2",
        pregunta: "Una empresa hipoteca una de sus naves industriales. Esto es un:",
        opciones: [
            "Activo fijo.",
            "Pasivo a corto plazo.",
            "Activo circulante.",
            "Pasivo fijo."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Pasivo fijo."
    },
    {
        unidad: "UD2",
        pregunta: "¿Cuál de las siguientes afirmaciones se corresponde con la definición del EBITDA?",
        opciones: [
            "Beneficio económico - Amortizaciones - Depreciaciones.",
            "Beneficio económico + Amortizaciones + Depreciaciones.",
            "Beneficio neto.",
            "Beneficio líquido."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Beneficio económico + Amortizaciones + Depreciaciones."
    },
    {
        unidad: "UD2",
        pregunta: "¿En cuál partida del balance de la empresa están incluidas las facturas emitidas por los proveedores?",
        opciones: [
            "Capitales permanentes.",
            "Activo circulante.",
            "Recursos propios.",
            "Pasivo a corto."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Pasivo a corto."
    },
    {
        unidad: "UD2",
        pregunta: "El beneficio que un accionista obtiene por cada euro invertido es:",
        opciones: [
            "La rentabilidad financiera.",
            "La rentabilidad externa.",
            "La rentabilidad operativa.",
            "El beneficio neto."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: La rentabilidad financiera."
    },
    {
        unidad: "UD2",
        pregunta: "Los recursos propios de una empresa ascienden a 2 millones de euros y los recursos ajenos totales a 10 millones; por tanto, el activo total asciende a:",
        opciones: [
            "5 millones.",
            "12 millones.",
            "8 millones.",
            "20 millones."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: 12 millones."
    },
    {
        unidad: "UD2",
        pregunta: "¿En cuál partida del balance está incluido un préstamo que le han concedido a la empresa por 5 millones a pagar en 5 años?",
        opciones: [
            "Activo circulante.",
            "Capitales permanentes.",
            "Recursos propios.",
            "Pasivo a corto."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Capitales permanentes."
    },
    {
        unidad: "UD2",
        pregunta: "¿En cuál partida del balance están incluidas las facturas emitidas a los clientes?",
        opciones: [
            "Recursos propios.",
            "Pasivo a corto.",
            "Capitales permanentes.",
            "Activo circulante."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Activo circulante."
    },
    {
        unidad: "UD2",
        pregunta: "¿Cuál de las siguientes descripciones NO se corresponde con el fondo de comercio?",
        opciones: [
            "Es la parte de los capitales permanentes que no se financia con activo fijo.",
            "Es la parte de los capitales permanentes (CP) que no se financia con activo circulante.",
            "Es la parte del activo circulante que se financia con capitales permanentes.",
            "Es la parte del activo circulante que no se financia con pasivo a corto plazo."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Es la parte de los capitales permanentes (CP) que no se financia con activo circulante."
    },

    // ---------------- UNIDAD 3: ANÁLISIS DE INVERSIONES ----------------
    {
        unidad: "UD3",
        pregunta: "Para una tasa de descuento del 5%, ¿cuál es el monto, a valor actual, de 100 euros de ahora, dentro de un año?",
        opciones: [
            "95,24",
            "105",
            "95",
            "105"
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: 95,24."
    },
    {
        unidad: "UD3",
        pregunta: "De los siguientes, ¿cuál es el criterio económico que debe seguirse para elegir entre dos proyectos?",
        opciones: [
            "El de mayor Payback.",
            "El de mayor VAN.",
            "El de menor TIR.",
            "El de Payback más corto."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: El de mayor VAN."
    },
    {
        unidad: "UD3",
        pregunta: "¿Qué se entiende por valor actual neto de una inversión?",
        opciones: [
            "La inversión inicial del valor actual.",
            "El valor actual más la inversión inicial.",
            "La inversión inicial menos el valor actual.",
            "El valor actual menos la inversión inicial."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: El valor actual menos la inversión inicial."
    },
    {
        unidad: "UD3",
        pregunta: "¿Qué se entiende por \"flujo de caja\"?",
        opciones: [
            "El beneficio económico actualizado.",
            "La diferencia entre los cobros generados y los pagos requeridos en cierto período.",
            "El beneficio económico.",
            "La suma de los valores actualizados."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: La diferencia entre los cobros generados y los pagos requeridos en cierto período."
    },
    {
        unidad: "UD3",
        pregunta: "¿Cuál de las siguientes NO es una razón para que el valor del dinero varíe en el tiempo?",
        opciones: [
            "La inflación.",
            "El coste de oportunidad.",
            "Los avances tecnológicos.",
            "El riesgo."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Los avances tecnológicos."
    },
    {
        unidad: "UD3",
        pregunta: "Se tienen dos posibles proyectos con distinto nivel de riesgo, ¿cuál debe elegirse?",
        opciones: [
            "El que produzca rentabilidad externa.",
            "Los proyectos no son comparables.",
            "El que tenga menor nivel de riesgo.",
            "El que tenga una rentabilidad neta de riesgo superior."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: El que tenga una rentabilidad neta de riesgo superior."
    },
    {
        unidad: "UD3",
        pregunta: "¿Cuál de los siguientes NO es una propiedad que deba cumplir un método de selección de inversiones?",
        opciones: [
            "Considerar los costes de mantenimiento.",
            "Considerar la prima de riesgo.",
            "Considerar todos los flujos de caja generados durante la vida del proyecto.",
            "Considerar el valor del dinero en el tiempo."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: Considerar los costes de mantenimiento."
    },
    {
        unidad: "UD3",
        pregunta: "¿Cuál es el inconveniente del uso del método de valoración del retorno de inversión modificado (payback modificado)?",
        opciones: [
            "No toma en cuenta el valor del dinero en el tiempo ni todos los flujos de caja de la vida del proyecto.",
            "No toma en cuenta el VAN.",
            "No toma en cuenta todos los flujos de caja de la vida del proyecto.",
            "No toma en cuenta el valor del dinero en el tiempo."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: No toma en cuenta todos los flujos de caja de la vida del proyecto."
    },
    {
        unidad: "UD3",
        pregunta: "¿Cuál de los siguientes es un ejemplo de inversión inmaterial?",
        opciones: [
            "Comprar un terreno.",
            "Comprar un software.",
            "Comprar una máquina.",
            "No comprar nada."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Comprar un software."
    },
    {
        unidad: "UD3",
        pregunta: "Si la rentabilidad de la inversión alternativa más rentable es del 20% y la prima de riesgo de la inversión que pretendemos acometer es del 5%, esto quiere decir que la rentabilidad exigida de este último proyecto deberá ser del:",
        opciones: [
            "15 %",
            "20 %",
            "25 %",
            "30 %"
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: 25 %."
    },
    {
        unidad: "UD3",
        pregunta: "Si la rentabilidad exigida es del 30%, el cobro de 50 euros el año que viene tiene un valor actual de:",
        opciones: [
            "50 €",
            "0 €",
            "65 €",
            "38,46 €"
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: 38,46 €."
    },
    {
        unidad: "UD3",
        pregunta: "¿Cuál de las siguientes afirmaciones es FALSA?",
        opciones: [
            "Adquirir un nuevo filtro anti-emisiones es una inversión.",
            "Comprar la cantidad de materia prima necesaria para la producción es una inversión.",
            "Lanzar un nuevo proyecto de investigación requiere de una inversión.",
            "Cambiar los coches de la empresa requiere de una inversión."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Comprar la cantidad de materia prima necesaria para la producción es una inversión."
    },
    {
        unidad: "UD3",
        pregunta: "¿Cuál de las siguientes NO es una razón para que el dinero tenga un valor en el tiempo?",
        opciones: [
            "El coste de oportunidad.",
            "El riesgo.",
            "Las modas.",
            "La inflación."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Las modas."
    },
    {
        unidad: "UD3",
        pregunta: "¿Qué es el activo libre de riesgo?",
        opciones: [
            "El que tiene prima de riesgo nula.",
            "El que anula el riesgo de los otros proyectos y sirve de referencia.",
            "El que se da en situación de inflación nula.",
            "El que tiene rentabilidad exigida nula."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: El que tiene prima de riesgo nula."
    },
    {
        unidad: "UD3",
        pregunta: "TIR es:",
        opciones: [
            "Rentabilidad exigida para la que el VA se maximiza.",
            "Rentabilidad exigida para la que el VA se anula.",
            "Rentabilidad exigida para la que el VAN se maximiza.",
            "Rentabilidad exigida para la que el VAN se anula."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Rentabilidad exigida para la que el VAN se anula."
    },
    {
        unidad: "UD3",
        pregunta: "Una empresa requiere cambiar una máquina que, aunque está en buen estado, se ha quedado obsoleta; esto es un ejemplo de:",
        opciones: [
            "Inversión inmaterial.",
            "Inversión financiera.",
            "Inversión productiva.",
            "Préstamo a largo plazo."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Inversión productiva."
    },
    {
        unidad: "UD3",
        pregunta: "¿Cuál de los siguientes puntos NO se considera como uno de los aspectos a determinar por un método de selección de inversiones?",
        opciones: [
            "Qué proyectos son preferibles.",
            "Cuáles proyectos son realizables.",
            "Qué proyectos son tecnológicamente más avanzados.",
            "Qué proyectos son excluyentes entre sí."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Qué proyectos son tecnológicamente más avanzados."
    },
    {
        unidad: "UD3",
        pregunta: "¿Cuál de los siguientes aspectos NO es económicamente relevante para una inversión?",
        opciones: [
            "El desembolso inicial.",
            "Los flujos de caja.",
            "La innovación tecnológica.",
            "El riesgo."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: La innovación tecnológica."
    },
    {
        unidad: "UD3",
        pregunta: "¿Cuál de las siguientes NO es una inversión productiva?",
        opciones: [
            "Substituir una máquina por otra más productiva.",
            "Comprar acciones muy rentables de otra empresa.",
            "Comprar una máquina con un nivel bajo de productividad.",
            "Comprar una máquina con un nivel alto de productividad."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Comprar acciones muy rentables de otra empresa."
    },
    {
        unidad: "UD3",
        pregunta: "Si en un año, los gastos superan ligeramente a los ingresos:",
        opciones: [
            "El flujo de caja es neutro.",
            "El flujo de caja es positivo.",
            "No podemos afirmar nada acerca del flujo de caja.",
            "El flujo de caja es negativo."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: No podemos afirmar nada acerca del flujo de caja."
    },

    // ---------------- UNIDAD 4: FINANCIACIÓN ----------------
    {
        unidad: "UD4",
        pregunta: "¿Cuál de las siguientes es una fuente de financiación interna?",
        opciones: [
            "Las ampliaciones de capital.",
            "Las proporciones retenidas a los empleados para las pagas extraordinarias.",
            "El capital aportado por los accionistas.",
            "Los beneficios no repartidos."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Los beneficios no repartidos."
    },
    {
        unidad: "UD4",
        pregunta: "En el balance de una empresa aparecen las siguientes partidas. Capital social 200; Pendiente de pago a empleados 50; Beneficios no repartidos 30. Los recursos propios alcanzan a un monto de:",
        opciones: [
            "230",
            "200",
            "250",
            "30"
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: 230."
    },
    {
        unidad: "UD4",
        pregunta: "En el sistema de amortización de préstamos Americano, los intereses se pagan:",
        opciones: [
            "En cantidad decreciente.",
            "En cantidad creciente.",
            "A cantidad constante.",
            "Al final de la vida del préstamo."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: A cantidad constante."
    },
    {
        unidad: "UD4",
        pregunta: "¿Cuál de las siguientes fuentes de financiación suele ser más cara para la empresa?",
        opciones: [
            "Los descubiertos en cuenta.",
            "Los pagarés.",
            "El crédito bancario a corto plazo.",
            "La de los proveedores."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: Los descubiertos en cuenta."
    },
    {
        unidad: "UD4",
        pregunta: "¿Cuál de las siguientes afirmaciones sobre la financiación de la empresa es FALSA?",
        opciones: [
            "Los recursos propios son solo aquellos que han sido generados por la empresa.",
            "Los recursos propios forman parte de los capitales permanentes.",
            "Las reservas son recursos propios.",
            "Los recursos provenientes de bancos y proveedores son recursos ajenos."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: Los recursos propios son solo aquellos que han sido generados por la empresa."
    },
    {
        unidad: "UD4",
        pregunta: "¿Cuál de las siguientes entraría dentro de lo que se denomina financiación de los proveedores?",
        opciones: [
            "Ninguna de las anteriores.",
            "Facturas pendientes de pago a un proveedor por un monto de 5.000 euros.",
            "Préstamo de un proveedor por un monto de 1.000 euros a pagar a 7 años.",
            "Las dos anteriores."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Facturas pendientes de pago a un proveedor por un monto de 5.000 euros."
    },
    {
        unidad: "UD4",
        pregunta: "¿Con cuál sistema de amortización de préstamos se amortiza siempre la misma proporción del principal?",
        opciones: [
            "Alemán.",
            "Francés.",
            "Cuota constante.",
            "Americano."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: Alemán."
    },
    {
        unidad: "UD4",
        pregunta: "Una empresa emite obligaciones con un valor nominal de 100 euros y un interés del 3% anual. Tiene una prima de emisión de 10 euros. ¿De cuánto es rendimiento de las obligaciones?",
        opciones: [
            "2,73 %",
            "3,33 %",
            "3,00 %",
            "2,5 %"
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: 3,33 %."
    },
    {
        unidad: "UD4",
        pregunta: "¿En cuál partida del balance está incluido un préstamo que le han concedido a la empresa por 5 millones a pagar en 6 meses?",
        opciones: [
            "Activo circulante.",
            "Recursos propios.",
            "Pasivo a corto.",
            "Capitales permanentes."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Capitales permanentes."
    },
    {
        unidad: "UD4",
        pregunta: "¿Cuál de los siguientes casos NO representa una financiación de los proveedores propiamente dicha?",
        opciones: [
            "La empresa paga a un año con un recargo del 5%.",
            "El proveedor le abre a la empresa una línea de crédito para que compre sus productos.",
            "El proveedor confiere a la empresa un préstamo a 3 años al 15% para que use esos recursos en lo que crea conveniente.",
            "La empresa decide no beneficiarse del descuento por pronto pago."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: El proveedor confiere a la empresa un préstamo a 3 años al 15% para que use esos recursos en lo que crea conveniente."
    },
    {
        unidad: "UD4",
        pregunta: "¿Cuál de las siguientes es una fuente de financiación a corto plazo?",
        opciones: [
            "El capital aportado por los accionistas.",
            "Las ampliaciones de capital.",
            "Los beneficios no repartidos.",
            "Las proporciones retenidas a los empleados para las pagas extraordinarias."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Las proporciones retenidas a los empleados para las pagas extraordinarias."
    },
    {
        unidad: "UD4",
        pregunta: "Se tienen facturas pendientes de cobro a un cliente. Esto es un caso de:",
        opciones: [
            "Financiación.",
            "Activo inmaterial.",
            "Inversión inmaterial.",
            "Activo circulante."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Activo circulante."
    },
    {
        unidad: "UD4",
        pregunta: "En el sistema de amortización de préstamos Francés, el principal se amortiza:",
        opciones: [
            "En cantidad decreciente.",
            "Al final de la vida del préstamo.",
            "A cantidad constante.",
            "En cantidad creciente."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: A cantidad constante."
    },
    {
        unidad: "UD4",
        pregunta: "¿Quién emite la letra de cambio?",
        opciones: [
            "El librado.",
            "El endosante.",
            "El aceptante.",
            "El librador."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: El librador."
    },
    {
        unidad: "UD4",
        pregunta: "En el sistema de amortización de préstamos a cuota constante, el principal se amortiza:",
        opciones: [
            "A cantidad constante.",
            "Al final de la vida del préstamo.",
            "En cantidad creciente.",
            "En cantidad decreciente."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: En cantidad creciente."
    },
    {
        unidad: "UD4",
        pregunta: "El librador entrega una letra por 500 euros a 30 días vista y el tomador la presenta al librado para su cobro y no es aceptada. Si el librado no paga a los treinta días, el tomador podrá ir contra:",
        opciones: [
            "El tenedor.",
            "El librado, el endosante o el librador.",
            "El librador.",
            "El endosante o el librador."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: El librador."
    },
    {
        unidad: "UD4",
        pregunta: "A la consecución de los medios necesarios para efectuar las inversiones se la denomina:",
        opciones: [
            "Activo circulante.",
            "Activo fijo.",
            "Activo.",
            "Financiación."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Financiación."
    },
    {
        unidad: "UD4",
        pregunta: "¿Cuál de las siguientes NO es una fuente de financiación?",
        opciones: [
            "Capital social.",
            "Invertir en bolsa.",
            "Recursos internos.",
            "Capitales permanentes."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Invertir en bolsa."
    },
    {
        unidad: "UD4",
        pregunta: "Las facturas que los clientes le deben a la empresa son:",
        opciones: [
            "Recursos ajenos.",
            "Un activo.",
            "Recursos internos.",
            "Financiación externa."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Un activo."
    },
    {
        unidad: "UD4",
        pregunta: "¿Cuál de las siguientes NO es una fuente de financiación?",
        opciones: [
            "Facturas pendientes de cobro a un cliente por un monto de 5.000 euros.",
            "Préstamo de un banco por un monto de 7.000 euros a pagar en 5 años.",
            "Préstamo de un proveedor por un monto de 1.000 euros a pagar a 7 años.",
            "Facturas pendientes de pago a un proveedor por un monto de 5.000 euros."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: Facturas pendientes de cobro a un cliente por un monto de 5.000 euros."
    },

    // ---------------- UNIDAD 5: VALORACIÓN Y COSTES ----------------
    {
        unidad: "UD5",
        pregunta: "¿Cuál de las siguientes afirmaciones, acerca de una empresa rentable, es INCORRECTA?",
        opciones: [
            "El coeficiente de apalancamiento operativo es mayor que la unidad.",
            "El coeficiente de apalancamiento operativo es positivo.",
            "Todas son falsas.",
            "Las dos anteriores son ciertas."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Todas son falsas."
    },
    {
        unidad: "UD5",
        pregunta: "¿Cuál de las siguientes es una forma de calcular el fondo de comercio?",
        opciones: [
            "Por los flujos de caja.",
            "Por los superrendimientos.",
            "Por el valor de reposición.",
            "Por el valor sustancial."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Por los superrendimientos."
    },
    {
        unidad: "UD5",
        pregunta: "¿Cuál de las siguientes afirmaciones, acerca del coste fijo, es cierta?",
        opciones: [
            "El coste fijo no varía con el volumen de producción siempre y cuando la variación del volumen no sea tal que requiera una nueva estructura de costes.",
            "El coste fijo varía en función del volumen de producción para pequeños cambios en dicho volumen de producción.",
            "El coste fijo no varía de un sector a otro.",
            "El coste fijo no varía de una empresa a otra."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: El coste fijo no varía con el volumen de producción siempre y cuando la variación del volumen no sea tal que requiera una nueva estructura de costes."
    },
    {
        unidad: "UD5",
        pregunta: "Del apalancamiento total se puede decir que:",
        opciones: [
            "Ninguna de las anteriores.",
            "Representa una relación entre ventas y beneficio operativo.",
            "Se obtiene del producto del beneficio económico y el financiero.",
            "Se obtiene del producto de los apalancamientos operativo y financiero."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Se obtiene del producto de los apalancamientos operativo y financiero."
    },
    {
        unidad: "UD5",
        pregunta: "Una empresa valorada en muchos millones de dólares se dedica a la correduría de seguros. Sus únicos activos corresponden a cinco ordenadores, un router y mobiliario de oficina. Esto es un caso de:",
        opciones: [
            "Fondo de comercio positivo (Goodwill).",
            "Beneficio sobreestimado.",
            "Beneficio subestimado.",
            "Fondo de comercio negativo (Badwill)."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: Fondo de comercio positivo (Goodwill)."
    },
    {
        unidad: "UD5",
        pregunta: "El valor global es:",
        opciones: [
            "La suma del valor sustancial y el fondo de comercio.",
            "La suma del valor sustancial y la mitad del fondo de comercio.",
            "La suma del valor sustancial y el doble del fondo de comercio.",
            "Depende del método de valoración que se esté utilizando."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Depende del método de valoración que se esté utilizando."
    },
    {
        unidad: "UD5",
        pregunta: "El beneficio operativo es:",
        opciones: [
            "La diferencia entre el precio y el coste fijo.",
            "La diferencia entre los ingresos y los costes financieros.",
            "La diferencia entre los ingresos y los costes no financieros.",
            "La diferencia entre el precio y el coste variable."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: La diferencia entre los ingresos y los costes no financieros."
    },
    {
        unidad: "UD5",
        pregunta: "Si se calcula el valor actual de todos los beneficios que se supone que generará la empresa en el futuro, se obtiene:",
        opciones: [
            "El valor de rendimiento.",
            "El valor global.",
            "El valor de reposición.",
            "El valor sustancial."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: El valor de rendimiento."
    },
    {
        unidad: "UD5",
        pregunta: "La rentabilidad financiera podría llegar a ser negativa cuando:",
        opciones: [
            "El coeficiente de leverage es menor que la unidad.",
            "El coeficiente de leverage es mayor que la unidad.",
            "La rentabilidad económica es menor que el coste de endeudamiento.",
            "La rentabilidad económica es mayor que el coste de endeudamiento."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: La rentabilidad económica es menor que el coste de endeudamiento."
    },
    {
        unidad: "UD5",
        pregunta: "El punto muerto es aquel nivel de ventas por encima del cual:",
        opciones: [
            "Hay equilibrio entre pérdida y beneficio.",
            "Hay beneficio.",
            "Hay pérdida.",
            "La empresa se muere."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Hay beneficio."
    },
    {
        unidad: "UD5",
        pregunta: "El de reposición actualizado de los bienes y derechos menos las deudas es:",
        opciones: [
            "El valor global.",
            "El valor de reposición.",
            "El valor de rendimiento.",
            "El valor sustancial."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: El valor sustancial."
    },
    {
        unidad: "UD5",
        pregunta: "Se calcula el valor que corresponde a lo que queda luego de vender todos los activos de la empresa y de pagar todas las deudas, gastos e impuestos; esto corresponde al:",
        opciones: [
            "Valor de liquidación.",
            "Valor liquidativo.",
            "Los dos anteriores, que son sinónimos.",
            "Ninguno de los anteriores."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Valor liquidativo."
    },
    {
        unidad: "UD5",
        pregunta: "El valor actual de todas las rentas que generará la empresa en el futuro es:",
        opciones: [
            "El valor global.",
            "El valor de rendimiento.",
            "El valor sustancial.",
            "El valor de reposición."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: El valor de rendimiento."
    },
    {
        unidad: "UD5",
        pregunta: "¿Cuál de los siguientes casos presentará menores costes fijos?",
        opciones: [
            "Un fabricante de ropa con una red de distribución ajena.",
            "Un fabricante de ropa que subcontrata parte de la producción y tiene su propia red de distribución.",
            "Un fabricante de ropa con una red de distribución ajena que subcontrata parte de la producción.",
            "Un fabricante de ropa con su propia red de distribución."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Un fabricante de ropa con una red de distribución ajena que subcontrata parte de la producción."
    },
    {
        unidad: "UD5",
        pregunta: "Una empresa vale más liquidándola que en funcionamiento. Esto es un caso de:",
        opciones: [
            "Beneficio subestimado.",
            "Goodwill.",
            "Badwill.",
            "Beneficio sobreestimado."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Badwill."
    },
    {
        unidad: "UD5",
        pregunta: "El método directo revisado:",
        opciones: [
            "No toma en cuenta el global sino el sustancial, para el cálculo de los superrendimientos.",
            "No toma en cuenta el valor sustancial sino el global, para el cálculo de los superrendimientos.",
            "No toma en cuenta el valor sustancial sino el global.",
            "No toma en cuenta el global sino el sustancial."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: No toma en cuenta el valor sustancial sino el global, para el cálculo de los superrendimientos."
    },
    {
        unidad: "UD5",
        pregunta: "¿Cuál de las siguientes afirmaciones, acerca del margen bruto unitario, es cierta?",
        opciones: [
            "Es igual al precio de venta unitario menos el coste variable unitario menos el coste fijo.",
            "Es igual al precio de venta unitario más el coste variable unitario más el coste fijo.",
            "Es igual al precio de venta unitario más el coste variable unitario.",
            "Es igual al precio de venta unitario menos el coste variable unitario."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Es igual al precio de venta unitario menos el coste variable unitario."
    },
    {
        unidad: "UD5",
        pregunta: "Para un vendedor su bien tiene un valor de 5, mientras que para el comprador, el mismo bien tiene un valor de 4, ¿cuál de las siguientes afirmaciones es cierta?",
        opciones: [
            "El beneficio de la operación es de 1.",
            "No se puede realizar la transacción.",
            "El margen de negociación es de 1.",
            "El precio se puede fijar en 4,5."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: No se puede realizar la transacción."
    },
    {
        unidad: "UD5",
        pregunta: "Cuando el beneficio del comprador es idéntico al del vendedor:",
        opciones: [
            "El beneficio total es el máximo.",
            "El beneficio total es nulo.",
            "La transacción no se puede realizar.",
            "El precio es igual a la mitad del beneficio total."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: El precio es igual a la mitad del beneficio total."
    },
    {
        unidad: "UD5",
        pregunta: "¿Cuál de las siguientes afirmaciones es FALSA?",
        opciones: [
            "Cuando las ventas son inferiores al punto muerto, el beneficio es negativo.",
            "Si las ventas crecen, el beneficio operativo aumenta.",
            "Los costes fijos dependen fundamentalmente del tamaño del inmovilizado.",
            "La rentabilidad económica debe ser inferior al coste de financiación."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Los costes fijos dependen fundamentalmente del tamaño del inmovilizado."
    },

    // ---------------- UNIDAD 6: TÉCNICAS DE DECISIÓN ----------------
    {
        unidad: "UD6",
        pregunta: "La solución que persigue TOPSIS estará en el punto:",
        opciones: [
            "Más cercano a la solución ideal óptima y más lejano a la solución pésima teórica.",
            "Más cercano a la solución ideal óptima y más cercano a la solución pésima teórica.",
            "Más lejano a la solución ideal óptima y más cercano a la solución pésima teórica.",
            "Más lejano a la solución ideal óptima y más lejano a la solución pésima teórica."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: Más cercano a la solución ideal óptima y más lejano a la solución pésima teórica."
    },
    {
        unidad: "UD6",
        pregunta: "Con relación a AHP:",
        opciones: [
            "Se realizan comparaciones dos a dos para la asignación de pesos y para la evaluación.",
            "Se realizan comparaciones dos a dos para la evaluación pero no así para la asignación de pesos.",
            "No se realizan comparaciones dos a dos ni para la asignación de pesos ni para la evaluación.",
            "Se realizan comparaciones dos a dos para la asignación de pesos pero no para la evaluación."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: Se realizan comparaciones dos a dos para la asignación de pesos y para la evaluación."
    },
    {
        unidad: "UD6",
        pregunta: "¿Cuál de las siguientes afirmaciones NO es cierta con relación a las redes neuronales?",
        opciones: [
            "La señal de salida de un nodo puede ser señal de entrada de otro.",
            "La señal de entrada de un nodo no puede ser señal de salida de otro.",
            "La señal de salida de un nodo puede ser la señal de salida de la red neuronal.",
            "La señal de entrada de un nodo puede ser señal de salida de otro."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: La señal de entrada de un nodo no puede ser señal de salida de otro."
    },
    {
        unidad: "UD6",
        pregunta: "TOPSIS se caracteriza por:",
        opciones: [
            "La búsqueda de un punto óptimo.",
            "La comparación dos a dos.",
            "La jerarquía de criterios.",
            "El paralelismo entre el procedimiento de asignación de pesos a los criterios y el de evaluación de opciones para cada criterio."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: La búsqueda de un punto óptimo."
    },
    {
        unidad: "UD6",
        pregunta: "AHP NO se caracteriza por:",
        opciones: [
            "La jerarquía de criterios.",
            "La comparación dos a dos.",
            "El paralelismo entre el procedimiento de asignación de pesos a los criterios y el de evaluación de opciones para cada criterio.",
            "La búsqueda de un punto óptimo."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: La búsqueda de un punto óptimo."
    },
    {
        unidad: "UD6",
        pregunta: "¿Cuál de los siguientes métodos busca una solución lo más cercana posible a un punto óptimo ideal y lo más lejana posible a un punto pésimo teórico?",
        opciones: [
            "TOPSIS.",
            "Algoritmo genético.",
            "FAHP.",
            "Sistema de inferencia difusa."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: TOPSIS."
    },
    {
        unidad: "UD6",
        pregunta: "El uso de métodos matemáticos para la toma de decisiones:",
        opciones: [
            "Sirve de ayuda al decisor.",
            "Es un puro ejercicio teórico.",
            "Libera al decisor de sus responsabilidades.",
            "Aminora la responsabilidad del decisor."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: Sirve de ayuda al decisor."
    },
    {
        unidad: "UD6",
        pregunta: "En FAHP NO se aplica:",
        opciones: [
            "La comparación dos a dos.",
            "El establecimiento de una jerarquía.",
            "La asignación de pesos a los criterios.",
            "Las reglas de inferencia."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Las reglas de inferencia."
    },
    {
        unidad: "UD6",
        pregunta: "Los algoritmos genéticos están basados en:",
        opciones: [
            "Lógica difusa.",
            "Análisis jerárquico.",
            "Un proceso iterativo de mutaciones.",
            "Comparaciones dos a dos."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Un proceso iterativo de mutaciones."
    },
    {
        unidad: "UD6",
        pregunta: "¿Cuál de las siguientes no es una técnica de evaluación multicriterio?",
        opciones: [
            "AHP.",
            "FAHP.",
            "Algoritmos genéticos.",
            "Lógica difusa."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Lógica difusa."
    },
    {
        unidad: "UD6",
        pregunta: "¿Cuál de las siguientes NO suele ser una causa de inconsistencia en la asignación de pesos en AHP?",
        opciones: [
            "Errores de transcripción.",
            "Falta de información.",
            "Complejidad y multiplicidad de factores.",
            "Incompetencia de los evaluadores."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Incompetencia de los evaluadores."
    },
    {
        unidad: "UD6",
        pregunta: "Una de las ventajas de TOPSIS es:",
        opciones: [
            "El uso de diversas unidades de medida para distintos criterios.",
            "Su precisión.",
            "Su infalibilidad.",
            "Su exactitud."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: El uso de diversas unidades de medida para distintos criterios."
    },
    {
        unidad: "UD6",
        pregunta: "Las técnicas de decisión multicriterio NO suelen utilizarse para:",
        opciones: [
            "Determinar la importancia de los criterios de evaluación.",
            "Seleccionar una opción.",
            "Relevar al decisor de sus responsabilidades.",
            "Evaluar opciones."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Evaluar opciones."
    },
    {
        unidad: "UD6",
        pregunta: "FAHP es:",
        opciones: [
            "AHP difuso.",
            "AHP financiero.",
            "AHP funcional.",
            "AHP realimentado."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: AHP difuso."
    },
    {
        unidad: "UD6",
        pregunta: "La asignación de pesos a los criterios en AHP se obtiene por:",
        opciones: [
            "Comparación dos a dos entre los evaluadores.",
            "Comparación dos a dos de las opciones con relación a cada criterio.",
            "Comparación dos a dos de la ejecución de una opción con relación al evaluador.",
            "Comparación dos a dos de la importancia de cada criterio."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Comparación dos a dos de la importancia de cada criterio."
    },
    {
        unidad: "UD6",
        pregunta: "La lógica difusa se caracteriza por:",
        opciones: [
            "Funciones de pertenencia no binarias.",
            "Difusión internacional de los resultados.",
            "Soluciones inexactas.",
            "Soluciones imprecisas."
        ],
        correcta: 0,
        explicacion: "Respuesta correcta según el test: Funciones de pertenencia no binarias."
    },
    {
        unidad: "UD6",
        pregunta: "El primer paso en la implementación de AHP es:",
        opciones: [
            "Establecer los pesos de los criterios.",
            "Establecer la jerarquía de criterios.",
            "Comparar dos a dos los criterios.",
            "Evaluar los criterios."
        ],
        correcta: 1,
        explicacion: "Respuesta correcta según el test: Establecer la jerarquía de criterios."
    },
    {
        unidad: "UD6",
        pregunta: "¿Cuál de los siguientes métodos implementa una jerarquía de criterios de evaluación?",
        opciones: [
            "Sistema de inferencia.",
            "Algoritmo genético.",
            "Lógica difusa.",
            "FAHP."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: FAHP."
    },
    {
        unidad: "UD6",
        pregunta: "¿Cuál de los siguientes NO es una técnica de MCDM?",
        opciones: [
            "Redes neuronales.",
            "Algoritmos genéticos.",
            "Método de los superrendimientos.",
            "AHP."
        ],
        correcta: 2,
        explicacion: "Respuesta correcta según el test: Método de los superrendimientos."
    },
    {
        unidad: "UD6",
        pregunta: "Los niveles o capas a las que se refiere el método basado en redes neuronales están constituidos por:",
        opciones: [
            "Funciones de activación.",
            "Señales de salida.",
            "Señales de entrada.",
            "Capas de nodos."
        ],
        correcta: 3,
        explicacion: "Respuesta correcta según el test: Capas de nodos."
    }
];
