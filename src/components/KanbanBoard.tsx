import { Column, KanbanCard, CPMK } from '../types';
import { BookOpen, FileCheck, Calendar, GraduationCap, Edit2, Trash2, Plus, Filter, RotateCcw, AlertCircle, Sparkles, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface KanbanBoardProps {
  columns: Column[];
  cards: KanbanCard[];
  cpmks: CPMK[];
  onCardClick: (card: KanbanCard) => void;
  onAddCard: (columnId: Column['id']) => void;
  onDeleteCard: (cardId: string) => void;
  onMoveCard: (cardId: string, targetColumnId: Column['id']) => void;
  // Filters
  selectedCpmk: string;
  setSelectedCpmk: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  selectedWeek: string;
  setSelectedWeek: (val: string) => void;
  onResetFilters: () => void;
}

export default function KanbanBoard({
  columns,
  cards,
  cpmks,
  onCardClick,
  onAddCard,
  onDeleteCard,
  onMoveCard,
  selectedCpmk,
  setSelectedCpmk,
  selectedType,
  setSelectedType,
  selectedWeek,
  setSelectedWeek,
  onResetFilters,
}: KanbanBoardProps) {
  // Drag and drop state
  const [draggedCardId, setDraggedCardId] = React.useState<string | null>(null);

  // Filter logic
  const filteredCards = cards.filter((card) => {
    const matchCpmk = selectedCpmk ? card.cpmkId === selectedCpmk : true;
    const matchType = selectedType ? card.type === selectedType : true;
    const matchWeek = selectedWeek ? card.week === parseInt(selectedWeek) : true;
    return matchCpmk && matchType && matchWeek;
  });

  const getCardsByColumn = (columnId: Column['id']) => {
    return filteredCards.filter((card) => card.columnId === columnId);
  };

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
    setDraggedCardId(cardId);
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: Column['id']) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId) {
      onMoveCard(cardId, columnId);
    }
    setDraggedCardId(null);
  };

  // Helper for column shift buttons (accessibility)
  const shiftColumn = (card: KanbanCard, direction: 'left' | 'right') => {
    const colOrder: Column['id'][] = ['planning', 'progress', 'assessment', 'completed'];
    const currentIndex = colOrder.indexOf(card.columnId);
    if (direction === 'left' && currentIndex > 0) {
      onMoveCard(card.id, colOrder[currentIndex - 1]);
    } else if (direction === 'right' && currentIndex < colOrder.length - 1) {
      onMoveCard(card.id, colOrder[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="kanban-workspace">
      
      {/* FILTER PANEL */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
            <Filter className="w-4 h-4 text-slate-500" />
            <span>Saring Aktivitas:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-3xl">
            {/* CPMK Filter */}
            <div>
              <select
                value={selectedCpmk}
                onChange={(e) => setSelectedCpmk(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                id="filter-cpmk-select"
              >
                <option value="">Semua CPMK</option>
                {cpmks.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.description.substring(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                id="filter-type-select"
              >
                <option value="">Semua Tipe Aktivitas</option>
                <option value="lesson">Materi Kuliah (Lesson)</option>
                <option value="assessment">Asesmen / Tugas (Assessment)</option>
              </select>
            </div>

            {/* Week Filter */}
            <div>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                id="filter-week-select"
              >
                <option value="">Semua Minggu (1 - 16)</option>
                {Array.from({ length: 16 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    Minggu ke-{w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters Button */}
          {(selectedCpmk || selectedType || selectedWeek) && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
              id="reset-filter-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Saringan
            </button>
          )}
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {columns.map((col) => {
          const colCards = getCardsByColumn(col.id);
          return (
            <div
              key={col.id}
              className="flex flex-col bg-slate-100/70 rounded-xl border border-slate-200 shadow-3xs min-h-[500px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              id={`column-${col.id}`}
            >
              
              {/* Column Header */}
              <div className={`p-4 rounded-t-xl ${col.color}`}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm tracking-tight">{col.title}</h3>
                  <span className="inline-flex items-center justify-center bg-white/85 text-slate-800 font-mono text-xs font-bold w-6 h-6 rounded-full border border-slate-200 shadow-3xs">
                    {colCards.length}
                  </span>
                </div>
                <p className="text-[11px] leading-tight opacity-80 font-medium">
                  {col.description}
                </p>
              </div>

              {/* Cards List container */}
              <div className="p-3 flex-1 flex flex-col gap-3.5 max-h-[700px] overflow-y-auto custom-scrollbar">
                {colCards.length === 0 ? (
                  <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-1.5 my-2">
                    <p>Belum ada aktivitas</p>
                    <button
                      onClick={() => onAddCard(col.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 mt-1 text-[11px]"
                      id={`empty-add-btn-${col.id}`}
                    >
                      <Plus className="w-3 h-3" /> Tambah Baru
                    </button>
                  </div>
                ) : (
                  colCards.map((card) => {
                    const mappedCpmk = cpmks.find((c) => c.id === card.cpmkId);
                    return (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onCardClick(card)}
                        className={`bg-white rounded-lg border border-slate-200 p-3.5 shadow-3xs hover:shadow-md cursor-grab active:cursor-grabbing transition-all relative group hover:border-slate-300 ${
                          draggedCardId === card.id ? 'opacity-45 scale-95 border-dashed border-indigo-400' : ''
                        }`}
                        id={`card-${card.id}`}
                      >
                        
                        {/* Type Icon & Action buttons */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            card.type === 'assessment'
                              ? 'bg-purple-50 text-purple-700 border border-purple-100'
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {card.type === 'assessment' ? (
                              <>
                                <FileCheck className="w-3 h-3" />
                                Asesmen
                              </>
                            ) : (
                              <>
                                <BookOpen className="w-3 h-3" />
                                Materi
                              </>
                            )}
                          </span>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2.5 right-2 bg-white pl-1.5 rounded-lg py-0.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onCardClick(card);
                              }}
                              title="Sunting Kartu"
                              className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                              id={`edit-card-${card.id}`}
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCard(card.id);
                              }}
                              title="Hapus Kartu"
                              className="p-1 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                              id={`delete-card-${card.id}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="font-semibold text-slate-800 text-sm leading-snug tracking-tight mb-1.5 group-hover:text-indigo-600 transition-colors">
                          {card.title}
                        </h4>

                        {/* Description snippet */}
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                          {card.description}
                        </p>

                        {/* OBE Badges Grid */}
                        <div className="flex flex-wrap gap-1.5 mb-3 pt-2 border-t border-slate-100">
                          {/* CPMK */}
                          {mappedCpmk && (
                            <span
                              title={`Target: ${mappedCpmk.code} - ${mappedCpmk.description}`}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm text-[10px] bg-slate-100 text-slate-700 font-medium"
                            >
                              <GraduationCap className="w-2.5 h-2.5" />
                              {mappedCpmk.code}
                            </span>
                          )}

                          {/* Taxonomy */}
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm text-[10px] bg-sky-50 text-sky-800 font-medium">
                            {card.taxonomy.split(' - ')[0]}
                          </span>

                          {/* Week */}
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm text-[10px] bg-amber-50 text-amber-800 font-medium">
                            <Calendar className="w-2.5 h-2.5" />
                            W{card.week}
                          </span>

                          {/* Weight (Only for assessment) */}
                          {card.type === 'assessment' && card.weight > 0 && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm text-[10px] bg-emerald-50 text-emerald-800 font-bold font-mono">
                              Bobot: {card.weight}%
                            </span>
                          )}
                        </div>

                        {/* Footer details: Rubrics count or CQI reflection note */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                          <span className="italic leading-none">
                            Metode: {card.method}
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            {card.type === 'assessment' && card.rubrics.length > 0 && (
                              <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm" title="Rubrik penilaian tersedia">
                                {card.rubrics.length} Rubrik
                              </span>
                            )}
                            
                            {card.cqiNote && (
                              <span className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 rounded-sm" title={`Ada Catatan Evaluasi/CQI: ${card.cqiNote}`}>
                                <MessageSquare className="w-2.5 h-2.5" />
                                CQI
                              </span>
                            )}
                          </div>
                        </div>

                        {/* ACCESSIBILITY CONTROLS (Manual shifting via buttons in group) */}
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              shiftColumn(card, 'left');
                            }}
                            disabled={card.columnId === 'planning'}
                            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            title="Pindah ke kolom kiri"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[9px] text-slate-400 font-mono tracking-wider">
                            PINDAH FASE
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              shiftColumn(card, 'right');
                            }}
                            disabled={card.columnId === 'completed'}
                            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            title="Pindah ke kolom kanan"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* Column Footer: Add card button */}
              <div className="p-3 border-t border-slate-200/50 bg-slate-100/50 rounded-b-xl">
                <button
                  onClick={() => onAddCard(col.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-slate-300 hover:border-indigo-400 rounded-lg text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                  id={`column-add-btn-${col.id}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Aktivitas
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
