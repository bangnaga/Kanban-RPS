import React from 'react';
import { KanbanCard, CPMK, RubricCriteria, Column } from '../types';
import { listTaxonomies, listMethods } from '../initialData';
import { X, Plus, Trash2, HelpCircle, Save, Info } from 'lucide-react';

interface CardModalProps {
  card: KanbanCard | null; // Null means adding new card
  initialColumnId: Column['id'] | null;
  cpmks: CPMK[];
  onSave: (card: Omit<KanbanCard, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

export default function CardModal({
  card,
  initialColumnId,
  cpmks,
  onSave,
  onClose,
}: CardModalProps) {
  const isEdit = !!card;

  // Form State
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState<'lesson' | 'assessment'>('lesson');
  const [description, setDescription] = React.useState('');
  const [cpmkId, setCpmkId] = React.useState('');
  const [week, setWeek] = React.useState(1);
  const [taxonomy, setTaxonomy] = React.useState(listTaxonomies[0]);
  const [method, setMethod] = React.useState(listMethods[0]);
  const [weight, setWeight] = React.useState(0);
  const [rubrics, setRubrics] = React.useState<RubricCriteria[]>([]);
  const [cqiNote, setCqiNote] = React.useState('');
  const [columnId, setColumnId] = React.useState<Column['id']>('planning');

  // Custom method option support
  const [isCustomMethod, setIsCustomMethod] = React.useState(false);
  const [customMethodText, setCustomMethodText] = React.useState('');

  // Set default form values from card if edit mode
  React.useEffect(() => {
    if (card) {
      setTitle(card.title);
      setType(card.type);
      setDescription(card.description);
      setCpmkId(card.cpmkId);
      setWeek(card.week);
      
      // If taxonomy isn't in default list, add it
      setTaxonomy(card.taxonomy);
      
      // Handle learning methods
      if (listMethods.includes(card.method)) {
        setMethod(card.method);
        setIsCustomMethod(false);
      } else {
        setIsCustomMethod(true);
        setCustomMethodText(card.method);
      }

      setWeight(card.weight || 0);
      setRubrics(card.rubrics || []);
      setCqiNote(card.cqiNote || '');
      setColumnId(card.columnId);
    } else {
      // Create mode
      setTitle('');
      setType('lesson');
      setDescription('');
      setCpmkId(cpmks[0]?.id || '');
      setWeek(1);
      setTaxonomy(listTaxonomies[1]); // Default to C2 - Memahami
      setMethod(listMethods[0]);
      setIsCustomMethod(false);
      setWeight(0);
      setRubrics([]);
      setCqiNote('');
      if (initialColumnId) {
        setColumnId(initialColumnId);
      }
    }
  }, [card, initialColumnId, cpmks]);

  // Handle rubrics
  const handleAddRubric = () => {
    const newRubric: RubricCriteria = {
      id: `rubric-${Date.now()}-${Math.random()}`,
      criteria: '',
      maxScore: 25,
    };
    setRubrics([...rubrics, newRubric]);
  };

  const handleUpdateRubric = (id: string, field: 'criteria' | 'maxScore', value: any) => {
    setRubrics(
      rubrics.map((r) => {
        if (r.id === id) {
          return { ...r, [field]: value };
        }
        return r;
      })
    );
  };

  const handleRemoveRubric = (id: string) => {
    setRubrics(rubrics.filter((r) => r.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalMethod = isCustomMethod ? customMethodText : method;

    onSave({
      id: card?.id,
      title: title.trim(),
      type,
      description: description.trim(),
      cpmkId,
      week: Number(week),
      taxonomy,
      method: finalMethod.trim() || 'Interactive Lecture',
      weight: type === 'assessment' ? Number(weight) : 0,
      rubrics: type === 'assessment' ? rubrics : [],
      cqiNote: cqiNote.trim() || undefined,
      columnId,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div 
        className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="card-modal-container"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {isEdit ? 'Sunting Aktivitas OBE' : 'Tambah Aktivitas Pembelajaran/Asesmen'}
            </h3>
            <p className="text-xs text-slate-500">
              Isi parameter aktivitas agar terpetakan dengan capaian pembelajaran (CPMK).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            id="close-card-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
          {/* Title & Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Aktivitas / Topik / Judul Tugas *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Tugas 1: Integrasi API & Client-side Routing"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-hidden text-slate-800"
                id="modal-card-title"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Jenis Aktivitas
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setType('lesson')}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    type === 'lesson'
                      ? 'bg-white text-blue-700 shadow-3xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Materi
                </button>
                <button
                  type="button"
                  onClick={() => setType('assessment')}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    type === 'assessment'
                      ? 'bg-white text-purple-700 shadow-3xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Asesmen
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Deskripsi Aktivitas & Instruksi Pengajaran
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan detail cakupan materi pengajaran atau petunjuk pengerjaan tugas bagi mahasiswa..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-hidden text-slate-800"
              id="modal-card-description"
            />
          </div>

          {/* Alignment (CPMK, Week, Taxonomy) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CPMK mapping */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target CPMK (Asosiasi)*
              </label>
              {cpmks.length === 0 ? (
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  Belum ada CPMK terdaftar!
                </div>
              ) : (
                <select
                  required
                  value={cpmkId}
                  onChange={(e) => setCpmkId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-hidden text-slate-800"
                  id="modal-card-cpmk"
                >
                  {cpmks.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.description.substring(0, 35)}...
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Target Week */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Minggu Pelaksanaan
              </label>
              <select
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-hidden text-slate-800"
                id="modal-card-week"
              >
                {Array.from({ length: 16 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    Minggu ke-{w}
                  </option>
                ))}
              </select>
            </div>

            {/* Bloom's Taxonomy */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Taksonomi Bloom
              </label>
              <select
                value={taxonomy}
                onChange={(e) => setTaxonomy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-hidden text-slate-800"
                id="modal-card-taxonomy"
              >
                {listTaxonomies.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Learning Method & Column Phase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Learning Method */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Metode Pembelajaran
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomMethod(!isCustomMethod)}
                  className="text-[10px] text-indigo-600 font-semibold hover:underline"
                >
                  {isCustomMethod ? 'Pilih dari List' : 'Input Custom'}
                </button>
              </div>

              {isCustomMethod ? (
                <input
                  type="text"
                  required
                  value={customMethodText}
                  onChange={(e) => setCustomMethodText(e.target.value)}
                  placeholder="Ketik metode kustom (misal: Socratic Seminar)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-hidden text-slate-800"
                  id="modal-card-method-custom"
                />
              ) : (
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-hidden text-slate-800"
                  id="modal-card-method-select"
                >
                  {listMethods.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Current Column Phase */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Fase / Tahapan Papan
              </label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value as Column['id'])}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-hidden text-slate-800"
                id="modal-card-column"
              >
                <option value="planning">Perancangan (Planning)</option>
                <option value="progress">Pelaksanaan (In Progress)</option>
                <option value="assessment">Evaluasi & Penilaian (Assessment)</option>
                <option value="completed">Selesai & Refleksi (Done)</option>
              </select>
            </div>
          </div>

          {/* ASSESSMENT SPECIFIC FIELDS (Weight & Rubrics) */}
          {type === 'assessment' && (
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
                  Detail Parameter Asesmen (Penilaian)
                </span>
                
                {/* Weight Input */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">
                    Bobot Nilai (%):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-16 bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs font-mono font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-hidden text-slate-800"
                    id="modal-card-weight"
                  />
                </div>
              </div>

              {/* Rubric Criteria List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 uppercase">
                    Kriteria Rubrik Penilaian (Pemetaan Asesmen OBE)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddRubric}
                    className="inline-flex items-center gap-1 text-[11px] bg-indigo-600 text-white hover:bg-indigo-700 py-1 px-2.5 rounded-md font-semibold cursor-pointer shadow-3xs"
                    id="add-rubric-btn"
                  >
                    <Plus className="w-3 h-3" />
                    Tambah Kriteria
                  </button>
                </div>

                {rubrics.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-4 border border-dashed border-slate-200 rounded-lg bg-white">
                    Belum ada kriteria penilaian. Tambahkan kriteria untuk mempermudah audit akreditasi OBE.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {rubrics.map((rubric, idx) => (
                      <div key={rubric.id} className="flex gap-2 items-center bg-white p-2 border border-slate-200 rounded-lg shadow-3xs">
                        <span className="text-xs text-slate-400 font-bold font-mono">
                          #{idx + 1}
                        </span>
                        
                        <input
                          type="text"
                          required
                          placeholder="Kriteria (contoh: Kemampuan presentasi, Ketepatan algoritma)"
                          value={rubric.criteria}
                          onChange={(e) => handleUpdateRubric(rubric.id, 'criteria', e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                        />

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400 font-medium">Max:</span>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            required
                            placeholder="Skor"
                            value={rubric.maxScore}
                            onChange={(e) => handleUpdateRubric(rubric.id, 'maxScore', Number(e.target.value))}
                            className="w-14 bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-xs font-mono focus:outline-hidden text-center"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveRubric(rubric.id)}
                          className="p-1 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CQI NOTE / REFLEKSI TINDAK LANJUT */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Catatan Evaluasi / CQI (Continuous Quality Improvement)
              </label>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-bold">Opsional</span>
            </div>
            <textarea
              value={cqiNote}
              onChange={(e) => setCqiNote(e.target.value)}
              placeholder="Tuliskan catatan evaluasi, kendala mahasiswa saat diajarkan materi ini, rata-rata nilai, atau rekomendasi perbaikan/tindak lanjut untuk siklus kurikulum berikutnya..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-hidden text-slate-800"
              id="modal-card-cqi"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              * CQI sangat berguna untuk mengevaluasi efektivitas pengajaran berdasarkan pencapaian mahasiswa di akhir semester.
            </p>
          </div>

          {/* Action buttons footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2 px-5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              id="save-card-modal-btn"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
