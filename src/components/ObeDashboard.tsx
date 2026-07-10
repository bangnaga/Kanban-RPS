import { CPL, CPMK, KanbanCard } from '../types';
import { Award, GraduationCap, CheckCircle, AlertTriangle, BookOpen, FileCheck, ListChecks, HelpCircle, FileText, ChevronRight } from 'lucide-react';
import React from 'react';

interface ObeDashboardProps {
  cpls: CPL[];
  cpmks: CPMK[];
  cards: KanbanCard[];
}

export default function ObeDashboard({ cpls, cpmks, cards }: ObeDashboardProps) {
  
  // 1. Calculations
  const lessonsCount = cards.filter((c) => c.type === 'lesson').length;
  const assessments = cards.filter((c) => c.type === 'assessment');
  const assessmentsCount = assessments.length;
  const totalWeight = assessments.reduce((sum, c) => sum + (c.weight || 0), 0);

  // CPMK Coverage (which CPMKs have at least 1 card)
  const coveredCpmkIds = new Set(cards.map((c) => c.cpmkId));
  const cpmkCoverageCount = cpmks.filter((c) => coveredCpmkIds.has(c.id)).length;
  const cpmkCoveragePercent = cpmks.length > 0 ? Math.round((cpmkCoverageCount / cpmks.length) * 100) : 0;

  // 2. Taxonomies counts
  const taxonomyDistribution: { [key: string]: number } = {};
  cards.forEach((card) => {
    const level = card.taxonomy.split(' - ')[0]; // E.g., "C3"
    taxonomyDistribution[level] = (taxonomyDistribution[level] || 0) + 1;
  });

  const allTaxonomyLevels = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'P1', 'P2', 'P3', 'P4', 'P5', 'A1', 'A2', 'A3', 'A4', 'A5'];
  const activeTaxonomies = allTaxonomyLevels.filter(lvl => taxonomyDistribution[lvl]);

  // 3. Learning Methods counts
  const methodDistribution: { [key: string]: number } = {};
  cards.forEach((card) => {
    methodDistribution[card.method] = (methodDistribution[card.method] || 0) + 1;
  });

  // 4. CPMK Weight Mapping
  const cpmkStats = cpmks.map((cpmk) => {
    const cpmkCards = cards.filter((card) => card.cpmkId === cpmk.id);
    const cpmkLessons = cpmkCards.filter((card) => card.type === 'lesson');
    const cpmkAssessments = cpmkCards.filter((card) => card.type === 'assessment');
    const cpmkWeight = cpmkAssessments.reduce((sum, card) => sum + card.weight, 0);
    return {
      ...cpmk,
      lessons: cpmkLessons,
      assessments: cpmkAssessments,
      totalWeight: cpmkWeight
    };
  });

  // 5. CQI Notes / Reflections List
  const cqiCards = cards.filter((c) => c.cqiNote && c.cqiNote.trim());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" id="obe-dashboard">
      
      {/* GLANCE STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bobot Asesmen */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-3xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bobot Nilai</span>
            {totalWeight === 100 ? (
              <span className="p-1 rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle className="w-5 h-5" />
              </span>
            ) : (
              <span className="p-1 rounded-full bg-amber-50 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900">{totalWeight}%</span>
            <span className="text-xs text-slate-500">dari target 100%</span>
          </div>
          <div className="mt-2">
            {totalWeight === 100 ? (
              <p className="text-[10px] text-emerald-600 font-medium">✓ Proporsi bobot nilai sudah tepat 100%.</p>
            ) : totalWeight > 100 ? (
              <p className="text-[10px] text-rose-600 font-medium">⚠️ Kelebihan bobot ({totalWeight - 100}%). Sesuaikan nilai asesmen.</p>
            ) : (
              <p className="text-[10px] text-amber-600 font-medium">⚠️ Kurang bobot ({100 - totalWeight}%). Tambah atau naikkan bobot tugas.</p>
            )}
          </div>
        </div>

        {/* CPMK Coverage */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-3xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ketercakupan CPMK</span>
            <span className="p-1 rounded-full bg-indigo-50 text-indigo-600">
              <GraduationCap className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{cpmkCoveragePercent}%</span>
            <span className="text-xs text-slate-500">({cpmkCoverageCount}/{cpmks.length} CPMK)</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5">
            <div 
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${cpmkCoveragePercent}%` }}
            ></div>
          </div>
        </div>

        {/* Total Aktivitas & Tipe */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-3xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aktivitas Kelas</span>
            <span className="p-1 rounded-full bg-blue-50 text-blue-600">
              <BookOpen className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{cards.length}</span>
            <span className="text-xs text-slate-500">total entri</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-[10px] font-medium text-slate-500">
            <span className="flex items-center gap-0.5"><BookOpen className="w-3 h-3 text-blue-500" /> {lessonsCount} Materi</span>
            <span className="flex items-center gap-0.5"><FileCheck className="w-3 h-3 text-purple-500" /> {assessmentsCount} Asesmen</span>
          </div>
        </div>

        {/* CPL Alignment rate */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-3xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sasaran CPL</span>
            <span className="p-1 rounded-full bg-emerald-50 text-emerald-600">
              <Award className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{cpls.length}</span>
            <span className="text-xs text-slate-500">Profil Lulusan</span>
          </div>
          <div className="mt-2">
            <p className="text-[10px] text-slate-500 leading-tight">
              Masing-masing CPMK terpetakan pada kompetensi utama kurikulum program studi.
            </p>
          </div>
        </div>
      </div>

      {/* CORE ALIGNMENT MATRIX (PEMETAAN CPMK, ASESMEN, & MATERI) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-3xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Matriks Keselarasan Konstruktif (Constructive Alignment Matrix)</h3>
            <p className="text-xs text-slate-500">Pemetaan ketercapaian CPMK melalui materi kuliah dan distribusi bobot asesmen.</p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">OBE STANDARD</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-40">CPMK & Sasaran CPL</th>
                <th className="py-3 px-4">Deskripsi Capaian Pembelajaran</th>
                <th className="py-3 px-4 w-64">Materi Terkait (Lessons)</th>
                <th className="py-3 px-4 w-72">Asesmen Terkait & Bobot</th>
                <th className="py-3 px-4 text-center w-28">Total Bobot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {cpmkStats.map((cpmk) => {
                const parentCpl = cpls.find((cpl) => cpl.id === cpmk.cplId);
                return (
                  <tr key={cpmk.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* CPMK CODE & CPL */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex flex-col gap-1">
                        <span className="inline-block bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-sm w-fit">
                          {cpmk.code}
                        </span>
                        {parentCpl && (
                          <span 
                            title={parentCpl.description}
                            className="inline-block bg-indigo-50 text-indigo-700 text-[9px] px-1.5 py-0.5 rounded-sm w-fit font-medium border border-indigo-100"
                          >
                            Mendukung {parentCpl.code}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* DESCRIPTION */}
                    <td className="py-3.5 px-4 pr-6">
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {cpmk.description}
                      </p>
                    </td>

                    {/* LESSONS */}
                    <td className="py-3.5 px-4 text-slate-500">
                      {cpmk.lessons.length === 0 ? (
                        <span className="text-amber-500 italic text-[11px] font-medium block">
                           belum ada materi pengajaran
                        </span>
                      ) : (
                        <ul className="space-y-1">
                          {cpmk.lessons.map((lesson) => (
                            <li key={lesson.id} className="flex items-start gap-1 font-medium text-slate-600">
                              <span className="text-blue-500 font-bold font-mono text-[10px] mt-0.5">W{lesson.week}</span>
                              <span className="line-clamp-2">{lesson.title.replace('Materi: ', '')}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>

                    {/* ASSESSMENTS */}
                    <td className="py-3.5 px-4 text-slate-500">
                      {cpmk.assessments.length === 0 ? (
                        <span className="text-rose-500 italic text-[11px] font-medium block">
                          ⚠️ belum ada instrumen penilaian
                        </span>
                      ) : (
                        <ul className="space-y-1.5">
                          {cpmk.assessments.map((ass) => (
                            <li key={ass.id} className="flex items-start justify-between gap-1.5 bg-slate-50 border border-slate-100 p-1.5 rounded-md">
                              <div className="flex items-start gap-1 text-slate-700 font-semibold">
                                <span className="text-purple-600 font-mono text-[10px] mt-0.5">W{ass.week}</span>
                                <span className="line-clamp-2">{ass.title.replace('Asesmen ', '').replace('Tugas ', '')}</span>
                              </div>
                              <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-sm border border-purple-100 leading-none shrink-0 self-center">
                                {ass.weight}%
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>

                    {/* TOTAL WEIGHT & COMPLIANCE */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900 text-sm">
                      <div className="flex flex-col items-center justify-center">
                        <span className={`px-2 py-0.5 rounded-md ${
                          cpmk.totalWeight > 0 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {cpmk.totalWeight}%
                        </span>
                        {cpmk.totalWeight === 0 && (
                          <span className="text-[8px] text-rose-500 mt-1 uppercase font-sans font-bold tracking-wider">
                            Butuh Asesmen
                          </span>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BLOOM'S TAXONOMY & METHODS DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bloom's Taxonomy Visualizer */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-3xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-sky-400 rounded-full"></span>
              Profil Kognitif & Taksonomi Bloom
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Penyebaran aktivitas pembelajaran berdasarkan tingkat kompleksitas kognitif (C1-C6) dan psikomotorik (P1-P5).
            </p>

            <div className="space-y-3">
              {activeTaxonomies.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6 border border-dashed border-slate-200 rounded-lg">
                  Belum ada profil taksonomi. Tambahkan aktivitas di papan Kanban terlebih dahulu.
                </p>
              ) : (
                allTaxonomyLevels
                  .filter((lvl) => taxonomyDistribution[lvl] > 0)
                  .map((lvl) => {
                    const count = taxonomyDistribution[lvl];
                    const maxVal = Math.max(...Object.values(taxonomyDistribution));
                    const percentage = Math.round((count / maxVal) * 100);
                    
                    // Label helper
                    let fullLvlName = lvl;
                    if (lvl === 'C1') fullLvlName = 'C1 - Mengingat';
                    if (lvl === 'C2') fullLvlName = 'C2 - Memahami';
                    if (lvl === 'C3') fullLvlName = 'C3 - Mengaplikasikan';
                    if (lvl === 'C4') fullLvlName = 'C4 - Menganalisis';
                    if (lvl === 'C5') fullLvlName = 'C5 - Evaluasi';
                    if (lvl === 'C6') fullLvlName = 'C6 - Berkreasi';

                    return (
                      <div key={lvl} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-slate-700">{fullLvlName}</span>
                          <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm">{count} Aktivitas</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-sky-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          <div className="mt-5 text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
            * Sejalan dengan standar OBE Dikti, CPMK untuk mata kuliah jenjang sarjana (S1) idealnya berkisar pada tingkat taksonomi **C3 (Mengaplikasikan) hingga C6 (Berkreasi)**.
          </div>
        </div>

        {/* Learning Methods SCL (Student Centered Learning) Tracker */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-3xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
              Metode Pengajaran & Indikator SCL
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Distribusi metode untuk membuktikan keaktifan pengajaran yang berorientasi pada mahasiswa (Student-Centered Learning).
            </p>

            <div className="space-y-3.5">
              {Object.keys(methodDistribution).length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6 border border-dashed border-slate-200 rounded-lg">
                  Belum ada rekam metode pembelajaran.
                </p>
              ) : (
                Object.keys(methodDistribution).map((meth) => {
                  const count = methodDistribution[meth];
                  const totalCards = cards.length;
                  const ratioPercent = Math.round((count / totalCards) * 100);

                  // Highlight PBL or SCL approaches
                  const isScl = meth.includes('Project-Based') || meth.includes('Case-Based') || meth.includes('Problem-Based') || meth.includes('Inquiry');

                  return (
                    <div key={meth} className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <span className="text-slate-800 line-clamp-1">{meth}</span>
                          {isScl && (
                            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded-full shrink-0">
                              SCL ✓
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${isScl ? 'bg-emerald-500' : 'bg-slate-400'}`}
                            style={{ width: `${ratioPercent}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right text-xs font-semibold text-slate-500 shrink-0 font-mono">
                        {ratioPercent}% <span className="text-[10px] font-normal">({count})</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-5 text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
            * IKU-2 Kemendikbudristek menekankan proporsi kuliah berbasis kasus (**Case Method**) dan proyek kelompok (**Team-Based Project**) minimal **30% dari total asesmen**.
          </div>
        </div>

      </div>

      {/* CONTINUOUS QUALITY IMPROVEMENT (CQI) REPORT & LOGS */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-3xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
              Pencatatan Tindak Lanjut & Refleksi CQI (Continuous Quality Improvement)
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi berkelanjutan yang ditulis oleh dosen di akhir fase pelaksanaan dan asesmen untuk siklus mata kuliah mendatang.
            </p>
          </div>
          <span className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg font-bold">
            {cqiCards.length} Catatan Aktif
          </span>
        </div>

        {cqiCards.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
            <p className="font-medium">Belum ada catatan evaluasi CQI yang diisi.</p>
            <p className="mt-1 text-[11px] text-slate-400">
              Kunjungi kartu Kanban di kolom **Selesai (Done)** atau **Asesmen (Assessment)**, buka detail kartu, lalu isi bagian Catatan Evaluasi/CQI.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cqiCards.map((card) => {
              const mappedCpmk = cpmks.find((c) => c.id === card.cpmkId);
              return (
                <div key={card.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2.5 hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs tracking-tight line-clamp-1">{card.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Minggu ke-{card.week} • Metode: {card.method}</p>
                    </div>
                    {mappedCpmk && (
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-sm shrink-0">
                        {mappedCpmk.code}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Catatan Evaluasi & Tindak Lanjut:</span>
                    <p className="text-xs text-slate-700 italic leading-relaxed font-medium bg-white p-2.5 border border-slate-200 rounded-md shadow-3xs">
                      "{card.cqiNote}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
