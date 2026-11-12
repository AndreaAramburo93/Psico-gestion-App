import {
  BillingRecord,
  CalendarAppointment,
  NotificationRule,
  ReminderLogItem,
  SoapNote,
  Specialist,
} from '../types';

export const IMAGES = {
  logoMain:
    'https://lh3.googleusercontent.com/aida/AEtjO1WyqI9XXJ__Nyb1F1emfTiGVLEv2DYcoN-Hsy2xevAxPqQr1MKbRgiAHd50JmSX4Mpm2Kq4nG4rRxz388_hm51PtKYlsK1dhU7hqWpLRiYHu1ARMIhnWl1hRUm3sKw6OqTCkWeF8KC2ZyVydNAi4hQTaruZDk16fii0oHcoPa3SAIkbJYgpVppzWiarnmh7-1TPVsC2-WB9pfRv-JL53cIlXb4aEuN8h-N8cqKK3iJ90-JFyz81YhS4JA',
  logoAuth:
    'https://lh3.googleusercontent.com/aida/AEtjO1VRAzYjirtxLFbf63oTNQCwjho1eVF90pWg3d8Zj0Rqgj-_5jxvkgYF7PQYwjVkDDyvf3R0_dw0Udep_tViIzswW7GMSPHwQOOt-kTOC8snsTeAIps52YdLYLzdWhl6Y_tkdgTT16cYldFzRUhqIr2IcFoM-HmihsiqKcVFtkVzns6iXZUpLa6nGF0iWzq_n158eSBcDOlEL2jAyIJfad7s80kvD-9od8ZlbJAtOsEcx85ZaRHf5U-w7hc',
  sofiaAvatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDuABKe4Lk09MqNmwgcQMYEKviIXh1Pa-I_J9-4XEHeefbH-K2QbzG8NWE68D2x6YURpqEEVX4-OtZWmv3vN0Lkqkt7rS8hHftIXE13fDl_emjsEk5OjRxiq434Fp852uYV8rRn3zjPJGwPzPvAV1scTyDYzfbUWLAznkZZIgcr7ywj7WwLGw68nGSQMLUKd4X59LZX6SZCg-oL--hD-sTX49uB44qvVaSrjAPFyBVh9q77t6S3LmdY',
  sofiaHero:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCYl7u_YVvQxZdAKofZUS7r9U_aYy4pO2dWkb1JYgf-ro30nkznW2SwD9lO9u_Brkuv4n8KVJGgKpHCFtygpkulfTQ1D9bSZ74eoz5pu_tKrqoCwwIKDoFdbcbQVUy3Y2pHXvVAF5lCdprkO6h1eByj_XCO1CuP3uHxMVt4hPKCkFvE16FR2jxMDU6EL0tK2c23P0lxOko7g7Pg2S-rAV0-y-J78FwZR-wJqMKdWJI',
  marcelaHero:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD1GNpbkxtgRO1KhXv32vjXeQ8dI7rLeMLjLVQ2NKBMmFfp-ztYGHp69qLkO1EZiTSNcdR5whj4e7mUCbs8hJVnamNLKSefj2bFh0xvW5nd7MLDZgv-H7IZGQq5q-YCAkgOGMJ3gHQM6VHrHsU6Il2HPOG-MUmrh1ibRJznEI5hKJvmYagshjR4cV06c8aVUsF54v3PONpzK8pO_kTEK1gUnX8SDNu87J9S6fBwPJXQzkCps1XBWxxS',
  marcelaChat:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBUXQXkzyYstLCQL_Xb2n7668oRHnrBQTuvLWUWqkdMIgDskRyp7vppwDbGc3AHNn1OL4iMuci26VQ6nyygUjVekLNj3OjNPxs8_B_n71GsDcj9jIxfmF4keQFdFqF_FOxDBygRZSKniY4oQJkhs44cEaw4oh2-HtWc9_3Gmocn5yVOJkxBbly4vfMUS1Sjbelz2lAPJPODug8uDufF2h6fZKoBKIHNdktu_uBDhPE5axI_RhXnzR7a',
  marcelaDir:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAGzoGJiHXC7TlEkwcX5Ncx19gfgt2_P6v4937NJjWt7GG3PTQifzaasC2T9do53DT8ALOWAGwluc1sNwnt1_4Eog_WZZIKJX6l4sps7N7KQD34PfjuzJ5_EOEF5YqI-iuH6l0jfFSe24gmSAskZUsNrLT14DoFPQNreXwjWLs9ox9RzoNuJXe_p6xssXNkPbUn8Uy5TSVTCRoHnwWA0pz0TjOOKZcc6_09qpKR1b0',
  marcelaSession14:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA3r6x7pmRokJzonFlOefa6bXZjT3yct3Rh8L6S5Y19qHxTbLl612KraGjcxBTUr_t2tEMY2MwS2euuPc18Poe3azGQ6Ygsg1HrnjMMhUhgfnGNL1GL_6tm_Q1OY83ptleOqDUK57WJAewp8eienqqGlDN5gDE56nZK-EzYYzTqXW0gy9LRIuIIgMEpOgLChnhpy4q2VNCokadUflKc2Yur_LmLUOkJ5Va4Gxgz_Tw',
  marcelaUpcoming:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAH7O6gtkJy0bSOyWsRymPcVlaSPj2qC87J9d4zBsdLLSFKE3kgtsLcu6eIKhAcyPZXGPadwfUQ2Z_nBTfqPBldroeLS_bKYxBb60aYJPVZOZStcvqtck7tss-Qp4WIrh_wHM2k_JK3M3cj-membFLuxhx0j8w1aZ-n-TjUjlwrfz6SLDtZJr4npopHvfJAC1OUnbOtmMSF1Gtq4wclk8jww0i6tDzdbVJwbCFGqaY',
  marcelaProfileCard:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBcxHhDXU6YyGxFunhAE8vgupySTrQbefUMxId1G6KtqfsQ2Lcl8NwnMr5hqzVGYaXAff1xZu3_LTpUWmK_s-VhOHDHS1K-CO8Z9kueaubKCAQau4KYUgoLK7RDaFvuLnO4XxbD13hhP1OyfEo1H1TDuD8npfi9kYMz75l8mg59Uw_XHL-lOjCIcoWR6jyuykOrOVJCXn1FA3r0KlFvlTy_muSlyNuvZngONcB0HJI',
  camilaHistory:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuASoSOso5ZJhhuD1k15IpB8swmyp8wcVJBrCPbpZKMTa-uzMZUlW4GFjJcOFPj38HKzpY09anlAzDtAOIumsok092JW7Uu4YlV3LOP7PYE9zFnv3N9Cww9B_ATWLNBhejf_6UQnyiPbcjuu-qILvH4R4eKgK6uM9mWWloNi-izV28GLegMEKUYOXBR8ad5UZZuN3DGiKkCb5iCamNzwwgQ0FN8EPcseYme1z8kevzg',
  camilaCalendar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBMtUxbh5Jfc1_BQ4YTh2-EGYyje97zOcwV2n6DBex5dk9PEpXbf-5FF6WQzCWxL69MOI9RgtoSgNG9Oa_muo4yXtaHGKMTGgk4dN90KxpZQP3ootF0j4XNT9I_pALAIMUMBW_skVDZmiCGUF5vj3QJluNthNnvnWgJEgXWZhL8ET37a8TXmg9lBGC8vtGoUr0uuk5Klfc7PwzvIGh7sh9ioh-Yz2wjnoC3YWwsnY_wZyDrtzIq7M3l',
  camilaProfile:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCXyt49H5JKslkED5KKumyR1-HeBb4d76ywSBNfUoR8AhS-Oc560C-TEAmagY_-zJvsmxZV022vRFe1igE8xII6-479Yokr0Jf7pUDWaq6tAZXDqKfLFGMfPTxMGMn1XzNJZtvuRauW3S673qLmqz496bWOLTMktybUTjLlD_nI1kFR111Ln0eHZ5AOQ8nvPLKazuLHSCQimWniHSuXBTvs9ALSc9qdtVUipR6L1Us',
  andresDir:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBhg-m_frAFNeU3bN8inN8OtO78VPcxt5yKBPHUAL-lSgBCfudzjwOPFo5YRKPx8sLcF2q7n0O8BTxRUnp0y_Q0F3uDEWuE0uCmyYCXs6PapqBSj9Bx9-i1cwNNLGZwaZ9XcqE0CVYtKLoBGnOAcL9demanlivC8vDCE_PADdu2EzdWKDZXrHbwEIKWBUEUkV253zJQVGoJSIrq99xQXozDYq3vCDuUUzvIlrOgY4E',
  andresHero:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB4hxORhwVPbeIqvikH2gdPiEHhxH7lLKb0k4AR8QsQH-TxeKxXFZ20cJ3q_kWUd2HEGLwoPY18Ep1it4dEtgOCfjB9_L0pYFanWMnks2lOnJ00dI_EnloB3zL_8b86Zj6eZymOIK7Xe45_jJsQ9-fxy0fhX15C37SoiRZ3J1rIM6Uf7FzGE69fmvcqdckCPX57wJixDPezX74__am0uSkP1oAIKUyAJ5L5Jksoy4aCc5q_JEpuqlPQ',
  valentinaDir:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCPIGcY5BsFSDGSwxSv8GultZXYmGRW8-UOAf8CPEOT7c_9R7w5YQiHD4ghnl_R_XFjDXi5tjBT652xsRpTi80jKHHBdaLcQCsSWV21X1y0EXRLBuux8TgXJz5emGFAOaZQLbtodIqPwhw91zXuVzUhvnX1wzAmPXPWIBjLh9ejBYyeJl8WZtGZNvf64BejAqENOOWEQY93uZ9AUCo8cyEpSn_p-7SXhGBjxp6sivE',
  camiloDir:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD5_QxI2UVwlnOSMTmD_1zVcWy1PHK3zXu8eHOtG9BZkImwqC5Z3_K7cdOKmk2kn9PX3l1p3pfXhBfx4mOSyaKJIW4mXfsI2FuGua4UFNbHKwsiiUsbEqJq2HRDb6T3b6bz8O_hmPMOptj1O8TW-RWO7L2K6ylgPYCrUz8N41dlVNdb1wnajR3FTozeYKwgRlF3srybT2n7l4ObCyRMnqCopLaqjwdv6mqXhK_UXD0',
  camiloProfileCard:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCTHlNmXRr-b3FsCwuGeHJoKnFKkTH5yFnGtlNi5s7p0KgORZxiBYAayZvHWyqNZIOO-Y2bQUDpoLfJu-Nn0YpfN2lBapiWBolEJjrusy5FB-l-Mnb3HP4yTmyI4DBPnd7qjKWXl5MIJ3Znm4xUNQIdYave-7qT9iF82WRFkButO2kkbUd9z49TuUjvtkn4wEaKzSGFAU7Vzjw5If0TCG1RK_BECb2BkKIx48mgQ1c',
  helenaAuth:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC1v8BJFbrPWmjbxzcxYEAP0CQQ__VMcSlDYruihsCEHJgAXIn_rS-GHEMmzG8PCRD9ZJQVLqP4TahQflvoHWy3of0Q_-kbH4P9ymLFlprP2CdBm8e2RkHuZxDGh8dYZlbRVWMwg6ZNb5q8bnZ1Fa83bgtl_zSgLMu4Vxy2Qi9-SvV_I60aauHA1aMQ-cNLfY9ocDnh1JUaEFOK4aWcafMOtUsTAQdDkDgb3u5saik',
  officePresencial:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDy1_M2DfxN5wcXmA_EGn5Xe1cL33QIJP1dHPzrXzzGgEI9Gv6452ZywLFKDBzNfpmAm0DzcHkf2VQ27IJWBzLK1UN_1Iiwy5W5mULoTyw1i5bh9hvWa0vSLDtV3IoZEzQ5wB-tPDw_BWbbXDd1Cq0tTyG6ttitI-RYVE52yjy0a_-gYaZq5gXbaJ_7BYcSvyf3UOlQAiuOzYNNiB-1xm81F585GLLgiAnM7OfPiG3ZLjxsfpCHpQEx',
  officeTele:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC9YFkcnCfIQn1k7AZ4j0aPm5pVqoPi2HXKGieTKiLH7BLB7XO3GGy7gRBEyjpWcIXLwww93IwIXHTB7oKjpgwYw7ldmGgcld4eaaQw87QUVDW_TLOMuhAsvBkZf3ovko3yUdIyn-zn03JAtNZ_VFbGOG9ahohzQ-LPnUjIoe5DGk7FUO-Fuv_GEmJlFmKqPjWPkgCYhrkvA_idR1sLZ7vBO_rTjscnw9QwTpIF3A_Q-4d6cnFLSxh9',
  mapBogota:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDPHgdbPRtNtlRmuW77_JWfOHlK2gIzYI6gtZt02TDWF4lv9X3Sn7qo9jD_g0F9CsKq1zG_tSknxIqMJssWoxMS7nb-MXBCJSTxy1N6GBCC45hZMA94aGUSpknyzGnVRYhP89X_JBiVq8L7WCGPBG6Pzq9WUBK9R0YwB7J0PlnpD-UexkB_A-1m9mTRKRFP7SQzV2AYlawCxoAw5Ojq6NlFDnR-bDbp5wUTyMDjCpw',
};

export const INITIAL_SPECIALISTS: Specialist[] = [
  {
    id: 'marcela',
    name: 'Dra. Marcela Restrepo G.',
    title: 'Psicóloga Clínica M.Sc. • Terapias de Tercera Generación',
    license: 'COL-48291 • MinSalud',
    rating: 4.95,
    reviewCount: 148,
    feeUsd: 55,
    feeCop: 220000,
    durationMin: 50,
    description:
      'Especialista en desensibilización de trastornos de pánico, ansiedad generalizada y regulación emocional. Integración de Mindfulness clínico con Terapia Cognitivo-Conductual (TCC).',
    tags: ['Ansiedad & Pánico', 'TCC', 'Mindfulness Clínico', 'Depresión'],
    modalityLabel: 'Online & Presencial',
    modalityType: 'hibrido',
    nextSlot: 'Hoy, 16:00 hrs (Virtual o Sede Chicó)',
    featured: true,
    avatarUrl: IMAGES.marcelaDir,
    accentColor: 'primary',
  },
  {
    id: 'andres',
    name: 'Dr. Andrés Valencia Peña',
    title: 'Terapeuta Sistémico • Parejas y Dinámicas Familiares',
    license: 'COL-39102 • Colegiado',
    rating: 4.92,
    reviewCount: 95,
    feeUsd: 60,
    feeCop: 240000,
    durationMin: 60,
    description:
      'Acompañamiento especializado en resolución de conflictos conyugales, terapia relacional, acuerdos de co-parentalidad y crisis vitales familiares.',
    tags: ['Terapia de Pareja', 'Enfoque Sistémico', 'Duelo Relacional'],
    modalityLabel: '100% Online',
    modalityType: 'online',
    nextSlot: 'Mañana, 10:00 hrs',
    avatarUrl: IMAGES.andresDir,
    accentColor: 'secondary',
  },
  {
    id: 'valentina',
    name: 'Lic. Valentina Ríos',
    title: 'Neuropsicóloga Clínica • Especialista en TDAH en Adultos',
    license: 'COL-51408 • Neuro-Cert',
    rating: 4.98,
    reviewCount: 72,
    feeUsd: 50,
    feeCop: 200000,
    durationMin: 50,
    description:
      'Evaluación cognitiva, psicoeducación y estrategias de funciones ejecutivas para neurodivergencias, procrastinación crónica y adaptación profesional en TDAH.',
    tags: ['TDAH Adultos', 'Funciones Ejecutivas', 'Reorganización Hábitos'],
    modalityLabel: 'Consulta Global (Meet)',
    modalityType: 'online',
    nextSlot: 'Viernes, 14:00 hrs',
    avatarUrl: IMAGES.valentinaDir,
    accentColor: 'primary',
  },
  {
    id: 'camilo',
    name: 'Dr. Camilo Arboleda',
    title: 'Médico Psiquiatra • Trastornos del Estado de Ánimo & Sueño',
    license: 'RM-99412 • Psiquiatría',
    rating: 4.89,
    reviewCount: 110,
    feeUsd: 75,
    feeCop: 300000,
    durationMin: 45,
    description:
      'Manejo farmacológico humanizado, interconsulta y tratamiento combinado de depresión resistente, insomnio severo y trastornos afectivos bipolares.',
    tags: ['Psiquiatría Clínica', 'Manejo Farmacológico', 'Trastorno Bipolar', 'Insomnio'],
    modalityLabel: 'Online & Presencial',
    modalityType: 'presencial',
    nextSlot: 'Próximo Lunes, 09:30 hrs',
    avatarUrl: IMAGES.camiloDir,
    accentColor: 'tertiary',
  },
];

export const INITIAL_BILLING_RECORDS: BillingRecord[] = [
  {
    id: 'bill-4092',
    patientName: 'Camila Morales',
    initials: 'CM',
    initialsBg: 'bg-primary-fixed',
    initialsText: 'text-primary',
    historyCode: 'HC #CM-2024 • TCC Ansiedad',
    concept: 'Sesión TCC Individual (50 min)',
    dateTime: '24 Oct, 2024 • 10:00 AM',
    sessionLabel: 'Sesión Individual 50 min',
    paymentMethod: 'Stripe (Visa •••• 4120)',
    paymentIcon: 'credit_card',
    amountUsd: 55,
    status: 'Cobrado con éxito',
    receiptNumber: 'Recibo #4092',
  },
  {
    id: 'bill-4091',
    patientName: 'Mateo Gómez',
    initials: 'MG',
    initialsBg: 'bg-secondary-fixed',
    initialsText: 'text-secondary',
    historyCode: 'HC #MG-1049 • Terapia de Pareja',
    concept: 'Terapia de Pareja',
    dateTime: '23 Oct, 2024 • 04:30 PM',
    sessionLabel: 'Sesión Pareja 80 min',
    paymentMethod: 'Bancolombia Transfer',
    paymentIcon: 'account_balance',
    amountUsd: 85,
    status: 'Cobrado con éxito',
    receiptNumber: 'Recibo #4091',
  },
  {
    id: 'bill-pre',
    patientName: 'Valentina Rivas',
    initials: 'VR',
    initialsBg: 'bg-tertiary-fixed',
    initialsText: 'text-tertiary',
    historyCode: 'HC #VR-0982 • Intervención Focal',
    concept: 'Sesión TCC Individual (50 min)',
    dateTime: '22 Oct, 2024 • 11:30 AM',
    sessionLabel: 'Sesión Individual 50 min',
    paymentMethod: 'Seguros Sura (Reclamo)',
    paymentIcon: 'health_and_safety',
    amountUsd: 55,
    status: 'En Liquidación',
  },
  {
    id: 'bill-4090',
    patientName: 'Daniela Peña',
    initials: 'DP',
    initialsBg: 'bg-surface-container-high',
    initialsText: 'text-on-surface-variant',
    historyCode: 'HC #DP-4412 • Presencial Consultorio',
    concept: 'Sesión Individual Presencial',
    dateTime: '21 Oct, 2024 • 05:00 PM',
    sessionLabel: 'Sesión Individual Presencial',
    paymentMethod: 'Efectivo en Consultorio',
    paymentIcon: 'payments',
    amountUsd: 65,
    status: 'Cobrado con éxito',
    receiptNumber: 'Recibo #4090',
  },
];

export const INITIAL_SOAP_NOTES: SoapNote[] = [
  {
    id: 12,
    title: 'Sesión 12: Reestructuración Cognitiva III',
    dateTime: '13 de Noviembre, 2024 • 16:00 hs',
    subjective:
      'Paciente expresa tranquilidad tras resolver desacuerdo con directiva de proyecto. Menor rumiación antes de dormir.',
    objective:
      'Afecto eutímico, discurso fluido sin bloqueos cognitivos. Buen contacto empático.',
    analysis:
      'Se consolida la disminución de la autoexigencia desadaptativa. Excelente internalización de ejercicios de metacognición.',
    signedBy: 'Dra. Sofía Mendoza • MP 4182',
    hash: '7b29a...0e1',
    isDefaultOpen: true,
  },
  {
    id: 11,
    title: 'Sesión 11: Desensibilización Sistemática Imaginal',
    dateTime: '06 de Noviembre, 2024 • 16:00 hs',
    subjective:
      'Reporta inicio de tensión cervical moderada vinculada a plazos de entrega.',
    analysis:
      'Se realiza práctica de exposición imaginal a escenarios de retraso laboral controlando SUDs de 8/10 a 3/10.',
    signedBy: 'Dra. Sofía Mendoza • MP 4182',
    hash: '3f88b...1a4',
  },
  {
    id: 10,
    title: 'Sesión 10: Intervención en Rumiación Nocturna',
    dateTime: '30 de Octubre, 2024 • 16:00 hs',
    subjective:
      'La paciente describe despertares a las 03:00 AM con taquicardia.',
    plan: 'Higiene de sueño estricta y descarte de pantallas 60 min previos al sueño.',
    signedBy: 'Dra. Sofía Mendoza • MP 4182',
    hash: '9c01d...f22',
  },
];

export const INITIAL_CALENDAR_APPOINTMENTS: CalendarAppointment[] = [
  {
    id: 'cal-1',
    dayIndex: 1,
    hour: 9,
    timeRange: '09:00 - 10:00',
    patientName: 'Camila Morales',
    subtitle: 'Sesión 4: Manejo de Ansiedad',
    modality: 'virtual',
    locationOrPlatform: 'Google Meet',
    statusLabel: 'Confirmada',
    accent: 'primary',
  },
  {
    id: 'cal-2',
    dayIndex: 1,
    hour: 10,
    halfOffset: true,
    timeRange: '10:30 - 11:30',
    patientName: 'Mateo Gómez',
    subtitle: 'Primera Consulta',
    modality: 'presencial',
    locationOrPlatform: 'Consultorio 302',
    statusLabel: 'Presencial',
    accent: 'secondary',
  },
  {
    id: 'cal-3',
    dayIndex: 2,
    hour: 10,
    timeRange: '10:00 - 11:00',
    patientName: 'Jorge Velasco',
    subtitle: 'Seguimiento TCC',
    modality: 'virtual',
    locationOrPlatform: 'Virtual',
    statusLabel: 'Confirmada',
    accent: 'neutral',
  },
  {
    id: 'cal-4',
    dayIndex: 1,
    hour: 15,
    timeRange: '15:00 - 16:00',
    patientName: 'Lucía Fernández',
    subtitle: 'Terapia de Pareja (Virtual)',
    modality: 'virtual',
    locationOrPlatform: 'WhatsApp Confirmado',
    statusLabel: 'Recordatorio Enviado',
    accent: 'tertiary',
  },
];

export const INITIAL_NOTIFICATION_RULES: NotificationRule[] = [
  {
    id: 'rule-1',
    title: 'Recordatorio Pre-Sesión 48 Horas',
    channel: 'WhatsApp',
    timing: '48 h antes',
    description:
      'Envía confirmación interactiva con botones de asistencia o reprogramación temprana sin costo.',
    enabled: true,
  },
  {
    id: 'rule-2',
    title: 'Enlace Cifrado de Sala Teleconsulta',
    channel: 'Email',
    timing: '15 min antes',
    description:
      'Despacha el enlace encriptado de Google Meet Clínico junto con recomendaciones de privacidad.',
    enabled: true,
  },
  {
    id: 'rule-3',
    title: 'Seguimiento Post-Sesión & Tareas (CU-09)',
    channel: 'Email',
    timing: '2 h después',
    description:
      'Comparte el resumen terapéutico autorizado y habilita la encuesta confidencial de satisfacción.',
    enabled: true,
  },
  {
    id: 'rule-4',
    title: 'Aviso SMS de Respaldo Contingencia',
    channel: 'SMS',
    timing: '1 h antes',
    description:
      'Notificación ligera sin requerir datos móviles en caso de falta de confirmación por WhatsApp.',
    enabled: false,
  },
];

export const INITIAL_REMINDER_LOGS: ReminderLogItem[] = [
  {
    id: 'log-1',
    patientName: 'Camila Morales Valencia',
    appointmentTime: 'Jue 24 Oct • 16:00 hrs',
    channel: 'WhatsApp',
    sentAt: 'Hace 2 horas',
    status: 'Confirmado por paciente',
  },
  {
    id: 'log-2',
    patientName: 'Mateo Gómez',
    appointmentTime: 'Mar 22 Oct • 10:30 hrs',
    channel: 'Email',
    sentAt: 'Hoy • 08:15 AM',
    status: 'Entregado',
  },
  {
    id: 'log-3',
    patientName: 'Lucía Fernández',
    appointmentTime: 'Mar 22 Oct • 15:00 hrs',
    channel: 'WhatsApp',
    sentAt: 'Ayer • 15:00 PM',
    status: 'Confirmado por paciente',
  },
  {
    id: 'log-4',
    patientName: 'Daniela Peña',
    appointmentTime: 'Vie 25 Oct • 17:00 hrs',
    channel: 'WhatsApp',
    sentAt: 'Programado para Jue 24 Oct',
    status: 'Programado',
  },
];
