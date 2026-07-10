import { CPL, CPMK, KanbanCard, Column } from './types';

export const initialCPLs: CPL[] = [
  {
    id: 'cpl-1',
    code: 'CPL-01',
    description: 'Mampu menerapkan konsep teoretis ilmu komputer dan rekayasa perangkat lunak untuk menyelesaikan masalah praktis.'
  },
  {
    id: 'cpl-2',
    code: 'CPL-02',
    description: 'Mampu merancang, mengimplementasikan, dan menguji solusi perangkat lunak yang andal, aman, dan berorientasi pengguna.'
  },
  {
    id: 'cpl-3',
    code: 'CPL-03',
    description: 'Mampu bekerja sama dalam tim lintas disiplin dan berkomunikasi secara efektif secara lisan maupun tertulis.'
  }
];

export const initialCPMKs: CPMK[] = [
  {
    id: 'cpmk-1',
    code: 'CPMK-01',
    description: 'Memahami prinsip dasar arsitektur web modern, komponen reaktif, dan virtual DOM.',
    cplId: 'cpl-1'
  },
  {
    id: 'cpmk-2',
    code: 'CPMK-02',
    description: 'Mampu membangun antarmuka web yang responsif, modular, dan dinamis menggunakan framework React.',
    cplId: 'cpl-2'
  },
  {
    id: 'cpmk-3',
    code: 'CPMK-03',
    description: 'Mampu mengimplementasikan manajemen state yang kompleks, asynchronous data fetching, dan interaksi API.',
    cplId: 'cpl-2'
  },
  {
    id: 'cpmk-4',
    code: 'CPMK-04',
    description: 'Mampu mendemonstrasikan, mengomunikasikan, dan mempresentasikan hasil kerja proyek web dengan baik secara berkelompok.',
    cplId: 'cpl-3'
  }
];

export const initialColumns: Column[] = [
  {
    id: 'planning',
    title: 'Perancangan (Planning)',
    color: 'border-t-4 border-blue-500 bg-blue-50/40 text-blue-800',
    description: 'Aktivitas pembelajaran, materi kuliah, & rencana asesmen yang sedang disiapkan/dirancang.'
  },
  {
    id: 'progress',
    title: 'Pelaksanaan (In Progress)',
    color: 'border-t-4 border-amber-500 bg-amber-50/40 text-amber-800',
    description: 'Materi kuliah yang sedang diajarkan atau tugas/asesmen yang sedang dikerjakan mahasiswa.'
  },
  {
    id: 'assessment',
    title: 'Evaluasi & Penilaian (Assessment)',
    color: 'border-t-4 border-purple-500 bg-purple-50/40 text-purple-800',
    description: 'Tahap pengumpulan tugas, koreksi nilai, dan evaluasi ketercapaian rubrik CPMK.'
  },
  {
    id: 'completed',
    title: 'Selesai & Refleksi (Done)',
    color: 'border-t-4 border-emerald-500 bg-emerald-50/40 text-emerald-800',
    description: 'Aktivitas selesai. Nilai dirilis & evaluasi tindak lanjut (CQI) dicatat untuk perbaikan semester depan.'
  }
];

export const initialCards: KanbanCard[] = [
  {
    id: 'card-1',
    title: 'Materi: Pengenalan React & Virtual DOM',
    type: 'lesson',
    description: 'Membahas sejarah arsitektur web, transisi dari MVC konvensional ke berbasis komponen, dan bagaimana React memperbarui tampilan secara efisien melalui Virtual DOM.',
    cpmkId: 'cpmk-1',
    week: 1,
    taxonomy: 'C2 - Memahami',
    method: 'Interactive Lecturing',
    weight: 0,
    rubrics: [],
    columnId: 'completed'
  },
  {
    id: 'card-2',
    title: 'Materi: JSX & Props Rendering',
    type: 'lesson',
    description: 'Sintaksis JSX, rendering ekspresi, penggunaan properties (props) untuk melewatkan data dari parent ke child component.',
    cpmkId: 'cpmk-2',
    week: 2,
    taxonomy: 'C3 - Mengaplikasikan',
    method: 'Contextual Instruction',
    weight: 0,
    rubrics: [],
    columnId: 'completed'
  },
  {
    id: 'card-3',
    title: 'Asesmen 1: Pembuatan Komponen UI Statis',
    type: 'assessment',
    description: 'Mahasiswa diminta menyusun tiruan antarmuka e-commerce sederhana secara statis dengan komponen React modular.',
    cpmkId: 'cpmk-2',
    week: 4,
    taxonomy: 'C3 - Mengaplikasikan',
    method: 'Project-Based Learning',
    weight: 15,
    rubrics: [
      { id: 'r1', criteria: 'Kelengkapan komponen & modularitas struktur folder', maxScore: 40 },
      { id: 'r2', criteria: 'Akurasi desain dan responsivitas Tailwind CSS', maxScore: 40 },
      { id: 'r3', criteria: 'Kerapihan kode program (ESLint)', maxScore: 20 }
    ],
    columnId: 'assessment',
    cqiNote: 'Rata-rata nilai mahasiswa cukup baik di angka 82. Masih ada kendala pada pemahaman flexbox di Tailwind.'
  },
  {
    id: 'card-4',
    title: 'Materi: Hook State & Effect Lifecycle',
    type: 'lesson',
    description: 'Mendalami penggunaan useState untuk state lokal, useEffect untuk sinkronisasi side-effects, dan siklus hidup komponen fungsional.',
    cpmkId: 'cpmk-2',
    week: 5,
    taxonomy: 'C3 - Mengaplikasikan',
    method: 'Problem-Based Learning',
    weight: 0,
    rubrics: [],
    columnId: 'progress'
  },
  {
    id: 'card-5',
    title: 'Materi: Advanced State & Context API',
    type: 'lesson',
    description: 'Solusi prop-drilling menggunakan React Context, pola reducer dengan useReducer, dan manajemen state global sederhana.',
    cpmkId: 'cpmk-3',
    week: 7,
    taxonomy: 'C4 - Menganalisis',
    method: 'Problem-Based Learning',
    weight: 0,
    rubrics: [],
    columnId: 'planning'
  },
  {
    id: 'card-6',
    title: 'Asesmen 2: Aplikasi Pencarian Film (Fetch API & Context)',
    type: 'assessment',
    description: 'Membangun aplikasi pencarian film menggunakan API publik (OMDb), mengelola state pencarian dan daftar favorit dengan React Context.',
    cpmkId: 'cpmk-3',
    week: 9,
    taxonomy: 'C4 - Menganalisis',
    method: 'Case-Based Learning',
    weight: 25,
    rubrics: [
      { id: 'r4', criteria: 'Keberhasilan integrasi Fetch API & handling state asynchronous', maxScore: 40 },
      { id: 'r5', criteria: 'Implementasi Context API untuk mengelola daftar favorit', maxScore: 35 },
      { id: 'r6', criteria: 'Error handling & loading indicators yang user-friendly', maxScore: 25 }
    ],
    columnId: 'planning'
  },
  {
    id: 'card-7',
    title: 'Tugas Akhir: Proyek Kolaborasi Aplikasi Fullstack SPA',
    type: 'assessment',
    description: 'Tugas akhir berupa rancangan proyek aplikasi web berkelompok yang mengintegrasikan seluruh CPMK dengan presentasi akhir.',
    cpmkId: 'cpmk-4',
    week: 16,
    taxonomy: 'C6 - Berkreasi',
    method: 'Project-Based Learning',
    weight: 60,
    rubrics: [
      { id: 'r7', criteria: 'Kompleksitas fungsionalitas aplikasi & integrasi database', maxScore: 35 },
      { id: 'r8', criteria: 'Desain UX, performa transisi, dan responsivitas', maxScore: 25 },
      { id: 'r9', criteria: 'Kualitas presentasi dan pembagian peran kerja tim', maxScore: 20 },
      { id: 'r10', criteria: 'Dokumentasi proyek (README & petunjuk instalasi)', maxScore: 20 }
    ],
    columnId: 'planning'
  }
];

export const listTaxonomies = [
  'C1 - Mengingat (Remembering)',
  'C2 - Memahami (Understanding)',
  'C3 - Mengaplikasikan (Applying)',
  'C4 - Menganalisis (Analyzing)',
  'C5 - Evaluasi (Evaluating)',
  'C6 - Berkreasi (Creating)',
  'P1 - Persepsi (Perception)',
  'P2 - Kesiapan (Set)',
  'P3 - Reaksi Terbimbing (Guided Response)',
  'P4 - Mekanisme (Mechanism)',
  'P5 - Reaksi Kompleks (Complex Overt Response)',
  'A1 - Menerima (Receiving)',
  'A2 - Menanggapi (Responding)',
  'A3 - Menilai (Valuing)',
  'A4 - Mengorganisasikan (Organizing)',
  'A5 - Karakterisasi (Characterizing)'
];

export const listMethods = [
  'Lecturing / Ceramah Interaktif',
  'Case-Based Learning (Pembelajaran Berbasis Kasus)',
  'Project-Based Learning (Pembelajaran Berbasis Proyek)',
  'Problem-Based Learning (Pembelajaran Berbasis Masalah)',
  'Contextual Instruction',
  'Inquiry-Based Learning',
  'Praktikum Mandiri',
  'Collaborative Learning (Belajar Kelompok)'
];
