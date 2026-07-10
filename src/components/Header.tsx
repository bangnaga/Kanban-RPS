import React from 'react';
import { LayoutDashboard, BarChart3, Settings2, Download, Upload, RotateCcw, Award } from 'lucide-react';

interface HeaderProps {
  courseName: string;
  setCourseName: (name: string) => void;
  activeTab: 'board' | 'analysis';
  setActiveTab: (tab: 'board' | 'analysis') => void;
  onOpenCurriculum: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  totalWeight: number;
}

export default function Header({
  courseName,
  setCourseName,
  activeTab,
  setActiveTab,
  onOpenCurriculum,
  onExport,
  onImport,
  onReset,
  totalWeight,
}: HeaderProps) {
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [tempName, setTempName] = React.useState(courseName);

  React.useEffect(() => {
    setTempName(courseName);
  }, [courseName]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setCourseName(tempName);
    }
    setIsEditingName(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-xs" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Title & Course Name */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Award className="w-3.5 h-3.5" />
                Sistem Pembelajaran OBE
              </span>
              <span className="text-xs text-slate-400 font-mono">v1.0.0</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="text-lg font-bold text-slate-800 border-b-2 border-indigo-600 focus:outline-hidden py-0.5 max-w-sm"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    onBlur={handleSaveName}
                    id="course-name-input"
                  />
                  <button
                    onClick={handleSaveName}
                    className="text-xs text-indigo-600 font-medium hover:text-indigo-800"
                  >
                    Simpan
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    {courseName}
                  </h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-medium px-2 py-0.5 rounded-md hover:bg-slate-100 transition-colors"
                    id="edit-course-name-btn"
                  >
                    Ubah Nama MK
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola rencana pengajaran, aktivitas kelas, asesmen, & rubrik secara sistematis sesuai CPL/CPMK.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 md:self-end">
            {/* Tab Navigation */}
            <div className="bg-slate-100 p-0.5 rounded-lg flex border border-slate-200">
              <button
                onClick={() => setActiveTab('board')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'board'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id="tab-board-btn"
              >
                <LayoutDashboard className="w-4 h-4" />
                Papan Kanban
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'analysis'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id="tab-analysis-btn"
              >
                <BarChart3 className="w-4 h-4" />
                Analisis & Pemetaan
              </button>
            </div>

            {/* Curriculum Management Button */}
            <button
              onClick={onOpenCurriculum}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
              id="curriculum-setup-btn"
            >
              <Settings2 className="w-4 h-4" />
              Kelola CPL & CPMK
            </button>

            {/* Data Operations */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              {/* Export */}
              <button
                onClick={onExport}
                title="Ekspor Data JSON"
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                id="export-data-btn"
              >
                <Download className="w-4 h-4" />
              </button>
              
              {/* Import */}
              <label className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer relative">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept=".json"
                  onChange={onImport}
                  className="absolute inset-0 w-0 h-0 opacity-0 cursor-pointer"
                  id="import-data-file"
                />
              </label>

              {/* Reset */}
              <button
                onClick={onReset}
                title="Reset ke Silabus Standar"
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                id="reset-data-btn"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Bobot Indicator */}
            <div className="hidden lg:flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">TOTAL BOBOT ASESMEN</span>
                <span className={`text-sm font-bold font-mono ${
                  totalWeight === 100 
                    ? 'text-emerald-600' 
                    : totalWeight > 100 
                      ? 'text-rose-600' 
                      : 'text-amber-500'
                }`}>
                  {totalWeight}% / 100%
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
