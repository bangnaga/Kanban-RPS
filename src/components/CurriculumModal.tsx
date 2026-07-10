import React from 'react';
import { CPL, CPMK, KanbanCard } from '../types';
import { X, Plus, Trash2, Award, GraduationCap, AlertCircle, Check } from 'lucide-react';

interface CurriculumModalProps {
  cpls: CPL[];
  cpmks: CPMK[];
  cards: KanbanCard[];
  onSaveCpls: (cpls: CPL[]) => void;
  onSaveCpmks: (cpmks: CPMK[]) => void;
  onClose: () => void;
}

export default function CurriculumModal({
  cpls,
  cpmks,
  cards,
  onSaveCpls,
  onSaveCpmks,
  onClose,
}: CurriculumModalProps) {
  const [activeSubTab, setActiveSubTab] = React.useState<'cpl' | 'cpmk'>('cpl');

  // Local state for CPL list editing
  const [localCpls, setLocalCpls] = React.useState<CPL[]>([]);
  const [newCplCode, setNewCplCode] = React.useState('');
  const [newCplDesc, setNewCplDesc] = React.useState('');

  // Local state for CPMK list editing
  const [localCpmks, setLocalCpmks] = React.useState<CPMK[]>([]);
  const [newCpmkCode, setNewCpmkCode] = React.useState('');
  const [newCpmkDesc, setNewCpmkDesc] = React.useState('');
  const [newCpmkCplId, setNewCpmkCplId] = React.useState('');

  React.useEffect(() => {
    setLocalCpls([...cpls]);
    setLocalCpmks([...cpmks]);
  }, [cpls, cpmks]);

  // Handle adding new CPL
  const handleAddCpl = () => {
    if (!newCplCode.trim() || !newCplDesc.trim()) return;

    const newCpl: CPL = {
      id: `cpl-${Date.now()}-${Math.random()}`,
      code: newCplCode.trim().toUpperCase(),
      description: newCplDesc.trim(),
    };

    const updated = [...localCpls, newCpl];
    setLocalCpls(updated);
    onSaveCpls(updated);

    // Reset form
    setNewCplCode('');
    setNewCplDesc('');
  };

  // Handle deleting CPL
  const handleDeleteCpl = (id: string) => {
    // Check if CPMKs are mapped to this CPL
    const isUsedByCpmk = localCpmks.some((c) => c.cplId === id);
    if (isUsedByCpmk) {
      alert('CPL ini tidak bisa dihapus karena masih digunakan/diasosiasikan oleh satu atau lebih CPMK.');
      return;
    }

    const updated = localCpls.filter((c) => c.id !== id);
    setLocalCpls(updated);
    onSaveCpls(updated);
  };

  // Handle adding new CPMK
  const handleAddCpmk = () => {
    if (!newCpmkCode.trim() || !newCpmkDesc.trim() || !newCpmkCplId) return;

    const newCpmk: CPMK = {
      id: `cpmk-${Date.now()}-${Math.random()}`,
      code: newCpmkCode.trim().toUpperCase(),
      description: newCpmkDesc.trim(),
      cplId: newCpmkCplId,
    };

    const updated = [...localCpmks, newCpmk];
    setLocalCpmks(updated);
    onSaveCpmks(updated);

    // Reset form
    setNewCpmkCode('');
    setNewCpmkDesc('');
    setNewCpmkCplId(localCpls[0]?.id || '');
  };

  // Handle deleting CPMK
  const handleDeleteCpmk = (id: string) => {
    // Check if Kanban cards are mapped to this CPMK
    const isUsedByCard = cards.some((card) => card.cpmkId === id);
    if (isUsedByCard) {
      alert('CPMK ini tidak bisa dihapus karena masih dikaitkan dengan aktivitas pengajaran atau asesmen di papan Kanban.');
      return;
    }

    const updated = localCpmks.filter((c) => c.id !== id);
    setLocalCpmks(updated);
    onSaveCpmks(updated);
  };

  // Initialize new CPMK's default CPL ID if none set
  React.useEffect(() => {
    if (localCpls.length > 0 && !newCpmkCplId) {
      setNewCpmkCplId(localCpls[0].id);
    }
  }, [localCpls, newCpmkCplId]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div 
        className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="curriculum-modal-container"
      >
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Kelola Kurikulum OBE
            </h3>
            <p className="text-xs text-slate-500">
              Konfigurasi target CPL (Program Outcomes) & CPMK (Course Outcomes) untuk menyelaraskan pengajaran.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            id="close-curriculum-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-2">
          <button
            onClick={() => setActiveSubTab('cpl')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'cpl'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            id="subtab-cpl-btn"
          >
            <Award className="w-4 h-4" />
            1. Capaian Pembelajaran Lulusan (CPL / PLO)
          </button>
          <button
            onClick={() => setActiveSubTab('cpmk')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'cpmk'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            id="subtab-cpmk-btn"
          >
            <GraduationCap className="w-4 h-4" />
            2. Capaian Pembelajaran Mata Kuliah (CPMK / CLO)
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 flex-1 space-y-6 overflow-y-auto">
          
          {/* ======================================================== */}
          {/* CPL MANAGEMENT TAB */}
          {/* ======================================================== */}
          {activeSubTab === 'cpl' && (
            <div className="space-y-6">
              
              {/* Add New CPL Form */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3.5">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Tambah Kompetensi Lulusan (CPL) Baru
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kode CPL</label>
                    <input
                      type="text"
                      placeholder="CPL-01"
                      value={newCplCode}
                      onChange={(e) => setNewCplCode(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-bold"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Deskripsi Kompetensi Lulusan</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Mampu mendesain dan mengembangkan solusi rekayasa perangkat lunak..."
                        value={newCplDesc}
                        onChange={(e) => setNewCplDesc(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCpl()}
                      />
                      <button
                        onClick={handleAddCpl}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 shadow-3xs cursor-pointer"
                        id="add-cpl-submit-btn"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CPL List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Daftar CPL Terdaftar ({localCpls.length})
                </h4>

                {localCpls.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-6 border border-dashed border-slate-200 rounded-lg bg-slate-50">
                    Belum ada CPL terdaftar. Tambahkan di atas untuk mulai.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {localCpls.map((cpl) => {
                      const countMappedCpmks = localCpmks.filter((c) => c.cplId === cpl.id).length;
                      return (
                        <div 
                          key={cpl.id} 
                          className="flex items-start justify-between gap-3 bg-white p-3 border border-slate-200 rounded-lg shadow-3xs hover:border-slate-300 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="inline-block bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                                {cpl.code}
                              </span>
                              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                                {countMappedCpmks} CPMK Terkait
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                              {cpl.description}
                            </p>
                          </div>

                          <button
                            onClick={() => handleDeleteCpl(cpl.id)}
                            className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                            title="Hapus CPL"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CPMK MANAGEMENT TAB */}
          {/* ======================================================== */}
          {activeSubTab === 'cpmk' && (
            <div className="space-y-6">
              
              {/* Add New CPMK Form */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3.5">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Tambah Capaian Pembelajaran MK (CPMK) Baru
                </span>

                {localCpls.length === 0 ? (
                  <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Anda harus mendaftarkan minimal 1 CPL terlebih dahulu sebelum dapat menambahkan CPMK.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kode CPMK</label>
                        <input
                          type="text"
                          placeholder="CPMK-01"
                          value={newCpmkCode}
                          onChange={(e) => setNewCpmkCode(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-bold"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dipetakan ke CPL Sasaran</label>
                        <select
                          value={newCpmkCplId}
                          onChange={(e) => setNewCpmkCplId(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden text-slate-700"
                        >
                          {localCpls.map((cpl) => (
                            <option key={cpl.id} value={cpl.id}>
                              {cpl.code} - {cpl.description.substring(0, 50)}...
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Deskripsi CPMK (Mata Kuliah)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Mampu mengimplementasikan arsitektur state management global..."
                          value={newCpmkDesc}
                          onChange={(e) => setNewCpmkDesc(e.target.value)}
                          className="flex-1 bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCpmk()}
                        />
                        <button
                          onClick={handleAddCpmk}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 shadow-3xs cursor-pointer"
                          id="add-cpmk-submit-btn"
                        >
                          <Plus className="w-3.5 h-3.5" /> Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CPMK List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Daftar CPMK Terdaftar ({localCpmks.length})
                </h4>

                {localCpmks.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-6 border border-dashed border-slate-200 rounded-lg bg-slate-50">
                    Belum ada CPMK terdaftar. Tambahkan di atas untuk mulai.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {localCpmks.map((cpmk) => {
                      const associatedCpl = localCpls.find((c) => c.id === cpmk.cplId);
                      const countCards = cards.filter((card) => card.cpmkId === cpmk.id).length;
                      return (
                        <div 
                          key={cpmk.id} 
                          className="flex items-start justify-between gap-3 bg-white p-3 border border-slate-200 rounded-lg shadow-3xs hover:border-slate-300 transition-colors"
                        >
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="inline-block bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                                {cpmk.code}
                              </span>
                              {associatedCpl && (
                                <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-sm">
                                  Menyasar: {associatedCpl.code}
                                </span>
                              )}
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                countCards > 0 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : 'bg-rose-50 text-rose-700 border border-rose-100'
                              }`}>
                                {countCards} Aktivitas Terkait
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                              {cpmk.description}
                            </p>
                          </div>

                          <button
                            onClick={() => handleDeleteCpmk(cpmk.id)}
                            className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                            title="Hapus CPMK"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Tips footer */}
          <div className="bg-indigo-50/50 rounded-lg border border-indigo-100 p-3 flex gap-2">
            <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-[10px] text-indigo-800 leading-normal font-medium">
              <span className="font-bold">Tips OBE:</span> Perancangan kurikulum harus konsisten! CPL mengalir dari profil prodi keseluruhan, yang kemudian diturunkan menjadi CPMK yang lebih spesifik pada tingkat mata kuliah. Di papan Kanban, setiap materi kuliah dan asesmen harus secara eksplisit menunjuk pada minimal satu CPMK agar tercipta <i>Constructive Alignment</i> (Keselarasan Konstruktif).
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            id="close-curriculum-modal-bottom-btn"
          >
            Selesai Pengaturan
          </button>
        </div>

      </div>
    </div>
  );
}
