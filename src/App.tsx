import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import CardModal from './components/CardModal';
import ObeDashboard from './components/ObeDashboard';
import CurriculumModal from './components/CurriculumModal';
import { initialCards, initialCPMKs, initialCPLs, initialColumns } from './initialData';
import { KanbanCard, CPMK, CPL, Column } from './types';
import { AlertTriangle, RotateCcw, X, Info, GraduationCap, CheckCircle } from 'lucide-react';

export default function App() {
  // --- 1. CORE STATES ---
  const [courseName, setCourseName] = useState<string>(() => {
    try {
      return localStorage.getItem('obe_course_name') || 'Pemrograman Aplikasi Web Berorientasi Komponen (React)';
    } catch {
      return 'Pemrograman Aplikasi Web Berorientasi Komponen (React)';
    }
  });

  const [cards, setCards] = useState<KanbanCard[]>(() => {
    try {
      const saved = localStorage.getItem('obe_cards');
      return saved ? JSON.parse(saved) : initialCards;
    } catch {
      return initialCards;
    }
  });

  const [cpmks, setCpmks] = useState<CPMK[]>(() => {
    try {
      const saved = localStorage.getItem('obe_cpmks');
      return saved ? JSON.parse(saved) : initialCPMKs;
    } catch {
      return initialCPMKs;
    }
  });

  const [cpls, setCpls] = useState<CPL[]>(() => {
    try {
      const saved = localStorage.getItem('obe_cpls');
      return saved ? JSON.parse(saved) : initialCPLs;
    } catch {
      return initialCPLs;
    }
  });

  // --- 2. LAYOUT / ROUTING STATES ---
  const [activeTab, setActiveTab] = useState<'board' | 'analysis'>('board');
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  
  // Modal Editing State
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [addingCardColumn, setAddingCardColumn] = useState<Column['id'] | null>(null);

  // Filter States
  const [selectedCpmkFilter, setSelectedCpmkFilter] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState('');

  // Confirmation state (for safe reset without raw window.confirm)
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importNotification, setImportNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // --- 3. PERSISTENCE IN LOCAL STORAGE ---
  useEffect(() => {
    try {
      localStorage.setItem('obe_course_name', courseName);
    } catch (e) {
      console.error('Failed to save course name', e);
    }
  }, [courseName]);

  useEffect(() => {
    try {
      localStorage.setItem('obe_cards', JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to save cards', e);
    }
  }, [cards]);

  useEffect(() => {
    try {
      localStorage.setItem('obe_cpmks', JSON.stringify(cpmks));
    } catch (e) {
      console.error('Failed to save CPMKs', e);
    }
  }, [cpmks]);

  useEffect(() => {
    try {
      localStorage.setItem('obe_cpls', JSON.stringify(cpls));
    } catch (e) {
      console.error('Failed to save CPLs', e);
    }
  }, [cpls]);

  // --- 4. DATA MUTATIONS ---
  
  const handleSaveCard = (cardData: Omit<KanbanCard, 'id'> & { id?: string }) => {
    if (cardData.id) {
      // Edit Mode
      setCards((prev) =>
        prev.map((card) =>
          card.id === cardData.id
            ? ({ ...card, ...cardData } as KanbanCard)
            : card
        )
      );
    } else {
      // Add Mode
      const newCard: KanbanCard = {
        ...cardData,
        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      } as KanbanCard;
      setCards((prev) => [...prev, newCard]);
    }
    
    // Close modals
    setEditingCard(null);
    setIsAddingCard(false);
    setAddingCardColumn(null);
  };

  const handleDeleteCard = (cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
    if (editingCard?.id === cardId) {
      setEditingCard(null);
    }
  };

  const handleMoveCard = (cardId: string, targetColumnId: Column['id']) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, columnId: targetColumnId } : card
      )
    );
  };

  // --- 5. DATA PORTABILITY (EXPORT / IMPORT) ---
  const handleExportData = () => {
    const payload = {
      version: '1.0.0',
      courseName,
      cpls,
      cpmks,
      cards,
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    
    const safeCourseFilename = courseName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadAnchor.setAttribute("download", `kanban_obe_${safeCourseFilename}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.courseName && parsed.cpmks && parsed.cpls && parsed.cards) {
          setCourseName(parsed.courseName);
          setCpls(parsed.cpls);
          setCpmks(parsed.cpmks);
          setCards(parsed.cards);
          
          setImportNotification({
            type: 'success',
            message: 'Data kurikulum dan kartu OBE berhasil diimpor ke workspace!',
          });
        } else {
          setImportNotification({
            type: 'error',
            message: 'Format file JSON tidak valid. Pastikan file diekspor dari aplikasi ini.',
          });
        }
      } catch (err) {
        setImportNotification({
          type: 'error',
          message: 'Gagal membaca file JSON. Pastikan file tidak rusak.',
        });
      }
    };
    fileReader.readAsText(file);
    
    // Clear input
    e.target.value = '';
  };

  // Clear notification after 5 seconds
  useEffect(() => {
    if (importNotification) {
      const timer = setTimeout(() => {
        setImportNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [importNotification]);

  // --- 6. CURRICULUM RESETS ---
  const triggerReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setCourseName('Pemrograman Aplikasi Web Berorientasi Komponen (React)');
    setCards(initialCards);
    setCpmks(initialCPMKs);
    setCpls(initialCPLs);
    setShowResetConfirm(false);
  };

  // Calculations
  const assessmentCards = cards.filter((c) => c.type === 'assessment');
  const totalAssessmentWeight = assessmentCards.reduce((sum, c) => sum + (c.weight || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans">
      
      {/* HEADER BAR */}
      <Header
        courseName={courseName}
        setCourseName={setCourseName}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCurriculum={() => setIsCurriculumOpen(true)}
        onExport={handleExportData}
        onImport={handleImportData}
        onReset={triggerReset}
        totalWeight={totalAssessmentWeight}
      />

      {/* NOTIFICATIONS CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
        {/* Reset Confirmation Banner */}
        {showResetConfirm && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-fade-in mb-4">
            <div className="flex gap-2.5 items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-900 text-sm">Konfirmasi Reset Kurikulum</h4>
                <p className="text-xs text-red-700 leading-normal">
                  Tindakan ini akan menghapus semua perubahan kustom, kartu, CPL, dan CPMK yang Anda buat, lalu mengembalikan papan ke kurikulum pemrograman standar. Apakah Anda yakin?
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmReset}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-3xs transition-colors cursor-pointer"
                id="confirm-reset-btn"
              >
                Ya, Reset Data
              </button>
            </div>
          </div>
        )}

        {/* File Import Notification Banner */}
        {importNotification && (
          <div className={`border rounded-xl p-4 flex items-center justify-between gap-3 shadow-sm mb-4 transition-all ${
            importNotification.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <div className="flex gap-2 items-center">
              {importNotification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <p className="text-xs font-semibold">{importNotification.message}</p>
            </div>
            <button 
              onClick={() => setImportNotification(null)}
              className="p-1 rounded-md hover:bg-black/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Warning Badge if total weight isn't 100% */}
        {totalAssessmentWeight !== 100 && activeTab === 'board' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2 items-center shadow-3xs mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11px] font-semibold text-amber-800 leading-normal">
              <span className="font-bold">Perhatian Akreditasi OBE:</span> Total bobot instrumen asesmen saat ini adalah <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded-md border border-amber-200">{totalAssessmentWeight}%</span>. Dalam standar Outcome-Based Education, akumulasi seluruh nilai bobot tugas, ujian, dan proyek harus bernilai <span className="font-bold">persis 100%</span>. Silakan sunting bobot kartu asesmen atau kunjungi tab <span className="font-bold">Analisis</span> untuk pemetaan terperinci.
            </span>
          </div>
        )}
      </div>

      {/* MAIN LAYOUT */}
      <main className="flex-1">
        {activeTab === 'board' ? (
          <KanbanBoard
            columns={initialColumns}
            cards={cards}
            cpmks={cpmks}
            onCardClick={(card) => setEditingCard(card)}
            onAddCard={(colId) => {
              setAddingCardColumn(colId);
              setIsAddingCard(true);
            }}
            onDeleteCard={handleDeleteCard}
            onMoveCard={handleMoveCard}
            selectedCpmk={selectedCpmkFilter}
            setSelectedCpmk={setSelectedCpmkFilter}
            selectedType={selectedTypeFilter}
            setSelectedType={setSelectedTypeFilter}
            selectedWeek={selectedWeekFilter}
            setSelectedWeek={setSelectedWeekFilter}
            onResetFilters={() => {
              setSelectedCpmkFilter('');
              setSelectedTypeFilter('');
              setSelectedWeekFilter('');
            }}
          />
        ) : (
          <ObeDashboard
            cpls={cpls}
            cpmks={cpmks}
            cards={cards}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
          <p className="font-medium">Papan Kanban OBE (Outcome-Based Education)</p>
          <p className="text-[10px] text-slate-400">Dirancang khusus untuk pembuktian akreditasi BAN-PT, LAMSAMA, LAM Infokom, dan IABEE.</p>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* OVERLAY MODALS PORTALS */}
      {/* ======================================================== */}

      {/* Add / Edit Card Modal */}
      {(isAddingCard || editingCard) && (
        <CardModal
          card={editingCard}
          initialColumnId={addingCardColumn}
          cpmks={cpmks}
          onSave={handleSaveCard}
          onClose={() => {
            setEditingCard(null);
            setIsAddingCard(false);
            setAddingCardColumn(null);
          }}
        />
      )}

      {/* Curriculum Setup Modal */}
      {isCurriculumOpen && (
        <CurriculumModal
          cpls={cpls}
          cpmks={cpmks}
          cards={cards}
          onSaveCpls={setCpls}
          onSaveCpmks={setCpmks}
          onClose={() => setIsCurriculumOpen(false)}
        />
      )}

    </div>
  );
}
